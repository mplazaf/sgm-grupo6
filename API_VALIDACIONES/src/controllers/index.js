const database = require('../db');

// HU-01 CA1-CA4: consultar seguimiento actualizado del Trabajo de Título
const getSeguimientoTrabajo = (req, res) => {
  const trabajoId = req.params.id;

  database.query(
    'SELECT id, nombre, estado, actualizado_en FROM trabajo_de_titulo WHERE id = ?',
    [trabajoId],
    (err, trabajos) => {
      if (err) return res.status(500).json({ error: 'Error al consultar el Trabajo de Título' });
      if (!trabajos[0]) return res.status(404).json({ error: 'Trabajo de Título no encontrado' });

      database.query(
        'SELECT id, nombre, estado, orden_hito FROM hito WHERE trabajo_id = ? ORDER BY orden_hito',
        [trabajoId],
        (err2, hitos) => {
          if (err2) return res.status(500).json({ error: 'Error al consultar los hitos' });

          database.query(
            'SELECT id, descripcion, responsable, estado FROM accion_pendiente WHERE trabajo_id = ? ORDER BY id',
            [trabajoId],
            (err3, acciones) => {
              if (err3) return res.status(500).json({ error: 'Error al consultar las acciones pendientes' });
              res.status(200).json({ ...trabajos[0], hitos, acciones_pendientes: acciones });
            }
          );
        }
      );
    }
  );
};

// HU-02 CA1, CA3 y CA4: listar versiones disponibles.
const getVersionesTrabajo = (req, res) => {
  const trabajoId = req.params.id;
  database.query(
    'SELECT id, numero_version, fecha_entrega, contenido FROM version_tt WHERE trabajo_id = ? ORDER BY fecha_entrega',
    [trabajoId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al consultar las versiones' });
      res.status(200).json(rows);
    }
  );
};

// HU-02 CA1, CA3 y CA4: contenido + anotaciones solo de la versión consultada.
const getVersionDetalle = (req, res) => {
  const versionId = req.params.id;
  database.query('SELECT id, trabajo_id, numero_version, fecha_entrega, contenido FROM version_tt WHERE id = ?', [versionId], (err, versions) => {
    if (err) return res.status(500).json({ error: 'Error al consultar la versión' });
    if (!versions[0]) return res.status(404).json({ error: 'Versión no encontrada' });

    database.query(
      'SELECT id, comentario, version_id, guia_id, autor, fecha FROM anotacion_tt WHERE version_id = ? ORDER BY fecha DESC, id DESC',
      [versionId],
      (err2, annotations) => {
        if (err2) return res.status(500).json({ error: 'Error al consultar las anotaciones' });
        res.status(200).json({ ...versions[0], anotaciones: annotations });
      }
    );
  });
};

// HU-02 CA2: registrar anotación asociada a versión, autor y fecha.
const registrarAnotacion = (req, res) => {
  const versionId = req.params.id;
  const { comentario, guia_id } = req.body;

  if (!comentario || !comentario.trim() || !guia_id) {
    return res.status(400).json({ error: 'Comentario y Guía son obligatorios' });
  }

  database.query('SELECT id FROM version_tt WHERE id = ?', [versionId], (err, versions) => {
    if (err) return res.status(500).json({ error: 'Error al validar la versión' });
    if (!versions[0]) return res.status(404).json({ error: 'Versión no encontrada' });

    const query = "INSERT INTO anotacion_tt (comentario, version_id, guia_id, autor, fecha) VALUES (?, ?, ?, 'Guía', NOW())";
    database.query(query, [comentario.trim(), versionId, guia_id], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Error al registrar la anotación' });
      database.query('SELECT * FROM anotacion_tt WHERE id = ?', [result.insertId], (err3, rows) => {
        if (err3) return res.status(500).json({ error: 'Error al recuperar la anotación registrada' });
        res.status(201).json(rows[0]);
      });
    });
  });
};

// HU-11: Registrar una versión de Trabajo de Título
const registrarVersionTrabajo = (req, res) => {
  const trabajoId = req.params.id;
  const { contenido } = req.body;

  // HU-11 CA4: contenido obligatorio
  if (!contenido || !contenido.trim()) {
    return res.status(400).json({
      error: 'El contenido de la versión es obligatorio'
    });
  }

  // Primero consultar el Trabajo de Título
  database.query(
    'SELECT id, estado FROM trabajo_de_titulo WHERE id = ?',
    [trabajoId],
    (err, trabajos) => {
      if (err) {
        return res.status(500).json({
          error: 'Error al consultar el Trabajo de Título'
        });
      }

      if (!trabajos[0]) {
        return res.status(404).json({
          error: 'Trabajo de Título no encontrado'
        });
      }

      // HU-11 CA2: bloquear si está completado o no esta en desarrollo.
      if (trabajos[0].estado === 'completado') {
        return res.status(409).json({
          error: 'No se permiten nuevas versiones para un Trabajo de Título completado'
        });
      }

      if (trabajos[0].estado !== 'en_desarrollo') {
        return res.status(409).json({
          error: 'Solo se pueden registrar nuevas versiones cuando el Trabajo de Título está en desarrollo.'
        });
      }
      // Buscar última versión
      database.query(
        `
        SELECT id, numero_version
        FROM version_tt
        WHERE trabajo_id = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [trabajoId],
        (err2, versiones) => {
          if (err2) {
            return res.status(500).json({
              error: 'Error al consultar las versiones existentes'
            });
          }

          let nuevoNumero = '1.0';

          if (versiones[0]) {
            const numeroActual = parseFloat(versiones[0].numero_version);
            nuevoNumero = (numeroActual + 1).toFixed(1);
          }

          // CA1 y CA3
          database.query(
            `
            INSERT INTO version_tt
              (trabajo_id, numero_version, fecha_entrega, contenido)
            VALUES (?, ?, CURDATE(), ?)
            `,
            [trabajoId, nuevoNumero, contenido.trim()],
            (err3, result) => {
              if (err3) {
                return res.status(500).json({
                  error: 'Error al registrar la nueva versión'
                });
              }

              database.query(
                'SELECT * FROM version_tt WHERE id = ?',
                [result.insertId],
                (err4, rows) => {
                  if (err4) {
                    return res.status(500).json({
                      error: 'La versión fue registrada, pero no pudo recuperarse'
                    });
                  }

                  res.status(201).json(rows[0]);
                }
              );
            }
          );
        }
      );
    }
  );
};

// HU-09 CA1 y CA3: Consultar los exámenes de un Trabajo de Título.
const getExamenTrabajo = (req, res) => {
  const trabajoId = Number(req.params.id);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) {
    return res.status(400).json({
      error: 'Identificador de Trabajo de Título inválido'
    });
  }

  const query = `
    SELECT
      t.id AS trabajo_id,
      t.nombre AS trabajo_nombre,
      t.estado AS estado_trabajo,
      h.id AS hito_examen_id,
      h.estado AS estado_hito_examen,
      e.id AS examen_id,
      e.numero_intento,
      DATE_FORMAT(e.fecha, '%Y-%m-%d') AS fecha,
      e.sala
    FROM trabajo_de_titulo t
    LEFT JOIN hito h
      ON h.trabajo_id = t.id
      AND h.nombre LIKE 'Examen%'
    LEFT JOIN examen_titulo e
      ON e.trabajo_id = t.id
    WHERE t.id = ?
    ORDER BY e.numero_intento ASC
  `;

  database.query(query, [trabajoId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error al consultar los exámenes del Trabajo de Título'
      });
    }

    if (!rows[0]) {
      return res.status(404).json({
        error: 'Trabajo de Título no encontrado'
      });
    }

    const examenes = rows
      .filter(row => row.examen_id !== null)
      .map(row => ({
        id: row.examen_id,
        numero_intento: row.numero_intento,
        fecha: row.fecha,
        sala: row.sala
      }));

    res.status(200).json({
      trabajo_id: rows[0].trabajo_id,
      trabajo_nombre: rows[0].trabajo_nombre,
      estado_trabajo: rows[0].estado_trabajo,
      hito_examen_id: rows[0].hito_examen_id,
      estado_hito_examen: rows[0].estado_hito_examen,
      programado: examenes.length > 0,
      examenes
    });
  });
};

 
 // HU-09 CA2 y CA4: registrar o actualizar fecha y sala de un intento.
const guardarExamenTrabajo = (req, res) => {
  const trabajoId = Number(req.params.id);
  const { numero_intento, fecha, sala } = req.body || {};
  const numeroIntento = Number(numero_intento);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) {
    return res.status(400).json({
      error: 'Identificador de Trabajo de Título inválido'
    });
  }

  if (![1, 2].includes(numeroIntento)) {
    return res.status(400).json({
      error: 'El número de intento debe ser 1 o 2'
    });
  }

  if (typeof fecha !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
      typeof sala !== 'string' ||
      !sala.trim() ||
      sala.trim().length > 100) {
    return res.status(400).json({
      error: 'Debe ingresar una fecha (AAAA-MM-DD) y una sala de hasta 100 caracteres'
    });
  }

  const [anio, mes, dia] = fecha.split('-').map(Number);
  const fechaValidada = new Date(Date.UTC(anio, mes - 1, dia));

  if (anio < 100 ||
      fechaValidada.getUTCFullYear() !== anio ||
      fechaValidada.getUTCMonth() !== mes - 1 ||
      fechaValidada.getUTCDate() !== dia) {
    return res.status(400).json({
      error: 'La fecha ingresada no existe en el calendario'
    });
  }

  database.query(
    'SELECT id FROM trabajo_de_titulo WHERE id = ?',
    [trabajoId],
    (err, trabajos) => {
      if (err) {
        return res.status(500).json({
          error: 'Error al consultar el Trabajo de Título'
        });
      }

      if (!trabajos[0]) {
        return res.status(404).json({
          error: 'Trabajo de Título no encontrado'
        });
      }

      database.query(
        `SELECT numero_intento,
                DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
         FROM examen_titulo
         WHERE trabajo_id = ?`,
        [trabajoId],
        (err2, intentos) => {
          if (err2) {
            return res.status(500).json({
              error: 'Error al consultar los intentos existentes'
            });
          }

          const primero = intentos.find(
            intento => intento.numero_intento === 1
          );

          const segundo = intentos.find(
            intento => intento.numero_intento === 2
          );

          if (numeroIntento === 2 && !primero) {
            return res.status(409).json({
              error: 'Debe existir la primera oportunidad antes de registrar la segunda'
            });
          }

          if (numeroIntento === 2 && fecha <= primero.fecha) {
            return res.status(409).json({
              error: 'La segunda oportunidad debe tener una fecha posterior a la primera'
            });
          }

          if (numeroIntento === 1 && segundo &&
              fecha >= segundo.fecha) {
            return res.status(409).json({
              error: 'La primera oportunidad debe tener una fecha anterior a la segunda'
            });
          }

          const query = `
            INSERT INTO examen_titulo
              (trabajo_id, numero_intento, fecha, sala)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              fecha = VALUES(fecha),
              sala = VALUES(sala)
          `;

          database.query(
            query,
            [trabajoId, numeroIntento, fecha, sala.trim()],
            (err3, resultado) => {
              if (err3) {
                return res.status(500).json({
                  error: 'Error al guardar los antecedentes del examen'
                });
              }

              database.query(
                `SELECT id, trabajo_id, numero_intento,
                        DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
                        sala
                 FROM examen_titulo
                 WHERE trabajo_id = ? AND numero_intento = ?`,
                [trabajoId, numeroIntento],
                (err4, examenes) => {
                  if (err4) {
                    return res.status(500).json({
                      error: 'Error al consultar el examen registrado'
                    });
                  }

                  const codigo = resultado.affectedRows === 1 ? 201 : 200;
                  return res.status(codigo).json(examenes[0]);
                }
              );
            }
          );
        }
      );
    }
  );
};

// HU-07 - Registrar evaluación del Guía

// CA1 y CA4:
// Consultar la versión final, las revisiones realizadas durante
// el desarrollo y, si existe, la evaluación registrada.
const getAntecedentesParaEvaluacion = (req, res) => {
  const trabajoId = Number(req.params.id);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) {
    return res.status(400).json({
      error: 'Identificador de Trabajo de Título inválido'
    });
  }

  // Primero comprobar que el Trabajo de Título existe
  database.query(
    `
    SELECT id, nombre, estado, actualizado_en
    FROM trabajo_de_titulo
    WHERE id = ?
    `,
    [trabajoId],
    (err, trabajos) => {

      if (err) {
        return res.status(500).json({
          error: 'Error al consultar el Trabajo de Título'
        });
      }

      if (!trabajos[0]) {
        return res.status(404).json({
          error: 'Trabajo de Título no encontrado'
        });
      }

      // Obtener la última versión registrada
      database.query(
        `
        SELECT
          id,
          numero_version,
          fecha_entrega,
          contenido
        FROM version_tt
        WHERE trabajo_id = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [trabajoId],
        (err2, versiones) => {

          if (err2) {
            return res.status(500).json({
              error: 'Error al consultar la versión final'
            });
          }

          if (!versiones[0]) {
            return res.status(404).json({
              error: 'El Trabajo de Título aún no posee versiones registradas'
            });
          }

          const versionFinal = versiones[0];

          // Obtener todas las revisiones realizadas durante el desarrollo.
          // Se incluye la versión a la cual corresponde cada anotación.
          database.query(
            `
            SELECT
              a.id,
              a.comentario,
              a.autor,
              a.fecha,
              v.numero_version
            FROM anotacion_tt a
            INNER JOIN version_tt v
              ON v.id = a.version_id
            WHERE v.trabajo_id = ?
            ORDER BY a.fecha ASC, a.id ASC
            `,
            [trabajoId],
            (err3, revisiones) => {

              if (err3) {
                return res.status(500).json({
                  error: 'Error al consultar las revisiones'
                });
              }

              // CA4: recuperar la evaluación si ya fue registrada
              database.query(
                `
                SELECT
                  id,
                  trabajo_id,
                  guia_id,
                  numero_intento,
                  calificacion,
                  decision,
                  fecha_evaluacion
                FROM evaluacion_guia
                WHERE trabajo_id = ?
                ORDER BY numero_intento ASC
                `,
                [trabajoId],
                (err4, evaluaciones) => {

                  if (err4) {
                    return res.status(500).json({
                      error: 'Error al consultar la evaluación del Guía'
                    });
                  }

                  return res.status(200).json({
                    trabajo: trabajos[0],
                    version_final: versionFinal,
                    revisiones_previas: revisiones,
                    evaluaciones_guia: evaluaciones
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};


// CA2 y CA3:
// Registrar calificación y decisión del Guía. Si el Guía aprueba, el estado permite identificar
// que la aprobación requerida ya fue cumplida.

const registrarEvaluacionGuia = (req, res) => {
  const trabajoId = Number(req.params.id);

  const {
    guia_id,
    calificacion
  } = req.body || {};

  const guiaId = Number(guia_id);
  const nota = Number(calificacion);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) {
    return res.status(400).json({
      error: 'Identificador de Trabajo de Título inválido'
    });
  }

  if (!Number.isInteger(guiaId) || guiaId <= 0) {
    return res.status(400).json({
      error: 'Debe ingresar un ID de Guía válido'
    });
  }

  if (!Number.isFinite(nota) || nota < 1 || nota > 100) {
    return res.status(400).json({
      error: 'La calificación debe estar entre 1.0 y 100.0'
    });
  }

  // Verificar que el TT exista
  database.query(
    `
    SELECT id, estado
    FROM trabajo_de_titulo
    WHERE id = ?
    `,
    [trabajoId],
    (err, trabajos) => {

      if (err) {
        return res.status(500).json({
          error: 'Error al consultar el Trabajo de Título'
        });
      }

      if (!trabajos[0]) {
        return res.status(404).json({
          error: 'Trabajo de Título no encontrado'
        });
      }

      // Verificar que exista una versión final
      database.query(
        `
        SELECT id
        FROM version_tt
        WHERE trabajo_id = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [trabajoId],
        (err2, versiones) => {

          if (err2) {
            return res.status(500).json({
              error: 'Error al comprobar la versión final'
            });
          }

          if (!versiones[0]) {
            return res.status(409).json({
              error: 'No se puede evaluar un Trabajo de Título sin una versión registrada'
            });
          }

          // Consultar evaluaciones anteriores
          database.query(
            `
            SELECT
              id,
              numero_intento,
              calificacion,
              decision,
              fecha_evaluacion
            FROM evaluacion_guia
            WHERE trabajo_id = ?
            ORDER BY numero_intento ASC
            `,
            [trabajoId],
            (err3, evaluaciones) => {

              if (err3) {
                return res.status(500).json({
                  error: 'Error al consultar las evaluaciones anteriores'
                });
              }

              // Si ya obtuvo una nota igual o superior a 55, no permitir más intentos
              const aprobada = evaluaciones.some(
                evaluacion => Number(evaluacion.calificacion) >= 55
              );

              if (aprobada) {
                return res.status(409).json({
                  error: 'El Trabajo de Título ya fue aprobado por el Guía. No se permiten nuevas evaluaciones.'
                });
              }

              // Máximo 3 intentos
              if (evaluaciones.length >= 3) {
                return res.status(409).json({
                  error: 'Se alcanzó el máximo de 3 VTRs permitidos para este Trabajo de Título.'
                });
              }

              const numeroIntento = evaluaciones.length + 1;

              // La decisión se obtiene automáticamente
              const decision =
                nota >= 55
                  ? 'aprobado'
                  : 'rechazado';

              database.query(
                `
                INSERT INTO evaluacion_guia
                  (
                    trabajo_id,
                    guia_id,
                    numero_intento,
                    calificacion,
                    decision,
                    fecha_evaluacion
                  )
                VALUES (?, ?, ?, ?, ?, NOW())
                `,
                [
                  trabajoId,
                  guiaId,
                  numeroIntento,
                  nota,
                  decision
                ],
                (err4, resultado) => {

                  if (err4) {
                    return res.status(500).json({
                      error: 'Error al registrar la evaluación del Guía'
                    });
                  }

                  const nuevoEstado =
                    decision === 'aprobado'
                      ? 'aprobado_por_guia'
                      : numeroIntento === 3
                        ? 'reprobado_max_vtr'
                        : 'reprobado_por_guia';

                  database.query(
                    `
                    UPDATE trabajo_de_titulo
                    SET estado = ?
                    WHERE id = ?
                    `,
                    [nuevoEstado, trabajoId],
                    (err5) => {

                      if (err5) {
                        return res.status(500).json({
                          error: 'La evaluación fue registrada, pero no pudo actualizarse el estado del Trabajo de Título'
                        });
                      }

                      const estadoHito =
                        decision === 'aprobado'
                          ? 'completado'
                          : 'en_revision';

                      database.query(
                        `
                        UPDATE hito
                        SET estado = ?
                        WHERE trabajo_id = ?
                          AND orden_hito = 2
                        `,
                        [estadoHito, trabajoId],
                        (err6) => {

                          if (err6) {
                            return res.status(500).json({
                              error: 'La evaluación fue registrada, pero no pudo actualizarse el hito'
                            });
                          }

                          database.query(
                            `
                            SELECT
                              id,
                              trabajo_id,
                              guia_id,
                              numero_intento,
                              calificacion,
                              decision,
                              fecha_evaluacion
                            FROM evaluacion_guia
                            WHERE id = ?
                            `,
                            [resultado.insertId],
                            (err7, rows) => {

                              if (err7) {
                                return res.status(500).json({
                                  error: 'Evaluación registrada, pero no pudo recuperarse'
                                });
                              }

                              return res.status(201).json({
                                mensaje:
                                  decision === 'aprobado'
                                    ? 'Evaluación aprobada. No se permiten nuevos intentos.'
                                    : numeroIntento === 3
                                      ? 'Evaluación reprobada. Se alcanzó el máximo de 3 VTRs.'
                                      : `Evaluación reprobada. Quedan ${3 - numeroIntento} intento(s).`,
                                ...rows[0],
                                estado_trabajo: nuevoEstado,
                                intentos_restantes:
                                  decision === 'aprobado'
                                    ? 0
                                    : 3 - numeroIntento
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};


// CA3 y CA4:
// Consultar posteriormente la evaluación registrada.

const getEvaluacionGuia = (req, res) => {
  const trabajoId = Number(req.params.id);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) {
    return res.status(400).json({
      error: 'Identificador de Trabajo de Título inválido'
    });
  }

  database.query(
    `
    SELECT
      e.id,
      e.trabajo_id,
      e.guia_id,
      e.numero_intento,
      e.calificacion,
      e.decision,
      e.fecha_evaluacion,
      t.nombre AS trabajo_nombre,
      t.estado AS estado_trabajo
    FROM evaluacion_guia e
    INNER JOIN trabajo_de_titulo t
      ON t.id = e.trabajo_id
    WHERE e.trabajo_id = ?
    ORDER BY e.numero_intento ASC
    `,
    [trabajoId],
    (err, evaluaciones) => {
      if (err) {
        console.error('ERROR CONSULTANDO evaluacion_guia:', err);

        return res.status(500).json({
          error: 'Error al consultar la evaluación del Guía',
          detalle: err.message
        });
      }

      if (!evaluaciones.length) {
        return res.status(404).json({
          error: 'El Trabajo de Título todavía no posee evaluaciones del Guía'
        });
      }

      return res.status(200).json({
        trabajo_id: trabajoId,
        estado_trabajo: evaluaciones[0].estado_trabajo,
        evaluaciones
      });
    }
  );
};


// HU-08: Registrar y consultar resultados del Examen de Título
// CA1, CA3 y CA4: Listar todos los exámenes registrados (con o sin nota)
const getTrabajosConExamen = (req, res) => {
  const query = `
    SELECT
      t.id AS trabajo_id,
      t.nombre,
      t.estado AS estado_trabajo,
      e.id AS examen_id,
      e.numero_intento,
      DATE_FORMAT(e.fecha, '%Y-%m-%d') AS fecha_examen,
      e.sala,
      e.nota,
      e.resultado,
      e.fecha_resultado
    FROM examen_titulo e
    INNER JOIN trabajo_de_titulo t
      ON t.id = e.trabajo_id
    ORDER BY t.id ASC, e.numero_intento ASC
  `;

  database.query(query, (err, rows) => {
    if (err) {
      console.error('ERROR HU08 - LISTAR EXÁMENES:', err);
      return res.status(500).json({ error: 'Error al obtener la lista' });
    }
    return res.status(200).json(rows);
  });
};

// CA1, CA2 y CA4: Registrar la nota de un examen específico
const registrarResultadoExamen = (req, res) => {
  const trabajoId = Number(req.params.id);
  const examenId = Number(req.params.examenId);
  const nota = Number(req.body?.nota);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) return res.status(400).json({ error: 'Identificador de Trabajo inválido' });
  if (!Number.isInteger(examenId) || examenId <= 0) return res.status(400).json({ error: 'Identificador de examen inválido' });
  if (req.body?.nota === undefined || req.body?.nota === null || req.body?.nota === '' || !Number.isFinite(nota) || nota < 0 || nota > 100) {
    return res.status(400).json({ error: 'La nota debe ser un número entre 0 y 100' });
  }

  const resultado = nota >= 55 ? 'aprobado' : 'reprobado';

  database.query(
    `SELECT e.id AS examen_id, e.trabajo_id, e.numero_intento, e.nota, e.resultado, t.estado AS estado_actual 
     FROM examen_titulo e INNER JOIN trabajo_de_titulo t ON t.id = e.trabajo_id 
     WHERE e.id = ? AND e.trabajo_id = ? LIMIT 1`,
    [examenId, trabajoId],
    (err, examenes) => {
      if (err) return res.status(500).json({ error: 'Error al consultar el examen' });
      if (!examenes[0]) return res.status(404).json({ error: 'Examen no encontrado' });

      const examen = examenes[0];

      // FIX: Ahora verifica que no sea ni NULL ni texto vacío
      if (examen.resultado !== null && examen.resultado !== '') {
        return res.status(409).json({ error: 'Este examen ya tiene una calificación registrada' });
      }

      const validarSegundoIntento = (continuar) => {
        if (Number(examen.numero_intento) !== 2) return continuar();
        database.query(
          `SELECT resultado FROM examen_titulo WHERE trabajo_id = ? AND numero_intento = 1 LIMIT 1`,
          [trabajoId],
          (errPrimero, primeros) => {
            if (errPrimero) return res.status(500).json({ error: 'Error al validar la primera oportunidad' });
            if (!primeros[0] || primeros[0].resultado !== 'reprobado') {
              return res.status(409).json({ error: 'La segunda oportunidad requiere reprobar la primera' });
            }
            continuar();
          }
        );
      };

      validarSegundoIntento(() => {
        let nuevoEstado;
        if (resultado === 'aprobado') {
          nuevoEstado = 'finalizado';
        } else if (Number(examen.numero_intento) === 1) {
          nuevoEstado = 'segunda_oportunidad_pendiente';
        } else {
          nuevoEstado = 'examen_reprobado';
        }

        // Actualiza asegurando que soporte NULL o vacío en el examen
        database.query(
          `UPDATE examen_titulo SET nota = ?, resultado = ?, fecha_resultado = NOW() 
           WHERE id = ? AND trabajo_id = ? AND (resultado IS NULL OR resultado = '')`,
          [nota, resultado, examenId, trabajoId],
          (errUpdate, updateResult) => {
            if (errUpdate) return res.status(500).json({ error: 'Error al guardar la calificación' });
            if (updateResult.affectedRows !== 1) return res.status(409).json({ error: 'El examen ya fue calificado' });

            database.query(
              `UPDATE trabajo_de_titulo SET estado = ? WHERE id = ?`,
              [nuevoEstado, trabajoId],
              (errEstado) => {
                if (errEstado) return res.status(500).json({ error: 'Error al actualizar el estado' });

                if (examen.estado_actual === nuevoEstado) return responderResultado();

                database.query(
                  `INSERT INTO historial_estado_trabajo (trabajo_id, estado_anterior, estado_nuevo, fecha_cambio) 
                   VALUES (?, ?, ?, NOW())`,
                  [trabajoId, examen.estado_actual, nuevoEstado],
                  (errHistorial) => {
                    if (errHistorial) return res.status(500).json({ error: 'Error al registrar historial' });
                    responderResultado();
                  }
                );

                function responderResultado() {
                  database.query(
                    `SELECT id AS examen_id, trabajo_id, numero_intento, nota, resultado, fecha_resultado 
                     FROM examen_titulo WHERE id = ?`,
                    [examenId],
                    (errFinal, rows) => {
                      if (errFinal) return res.status(500).json({ error: 'Error al recuperar resultado' });
                      return res.status(200).json({
                        mensaje: resultado === 'aprobado' ? 'Examen aprobado correctamente' : 'Examen reprobado',
                        ...rows[0],
                        nuevo_estado: nuevoEstado
                      });
                    }
                  );
                }
              }
            );
          }
        );
      });
    }
  );
};

// CA3: Consultar todos los resultados
const getResultadoExamen = (req, res) => {
  const trabajoId = Number(req.params.id);
  if (!Number.isInteger(trabajoId) || trabajoId <= 0) return res.status(400).json({ error: 'Identificador inválido' });

  database.query(
    `SELECT t.id AS trabajo_id, t.nombre, t.estado AS estado_trabajo, e.id AS examen_id, e.numero_intento, DATE_FORMAT(e.fecha, '%Y-%m-%d') AS fecha, e.sala, e.nota, e.resultado, e.fecha_resultado 
     FROM examen_titulo e INNER JOIN trabajo_de_titulo t ON t.id = e.trabajo_id 
     WHERE e.trabajo_id = ? ORDER BY e.numero_intento ASC`,
    [trabajoId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al consultar resultados' });
      if (!rows.length) return res.status(404).json({ error: 'No hay exámenes registrados' });
      return res.status(200).json(rows);
    }
  );
};

// CA4: Consultar historial
const getHistorialEstados = (req, res) => {
  const trabajoId = Number(req.params.id);
  if (!Number.isInteger(trabajoId) || trabajoId <= 0) return res.status(400).json({ error: 'Identificador inválido' });

  database.query(
    `SELECT id, trabajo_id, estado_anterior, estado_nuevo, fecha_cambio FROM historial_estado_trabajo WHERE trabajo_id = ? ORDER BY fecha_cambio ASC, id ASC`,
    [trabajoId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al consultar historial' });
      return res.status(200).json(rows);
    }
  );
};

module.exports = {
  getSeguimientoTrabajo,
  getVersionesTrabajo,
  getVersionDetalle,
  registrarAnotacion,
  registrarVersionTrabajo,

  getExamenTrabajo,
  guardarExamenTrabajo,

  getAntecedentesParaEvaluacion,
  registrarEvaluacionGuia,
  getEvaluacionGuia,

  registrarResultadoExamen,
  getResultadoExamen,
  getHistorialEstados,
  getTrabajosConExamen,
};
