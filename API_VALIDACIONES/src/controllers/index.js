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
                  calificacion,
                  decision,
                  fecha_evaluacion
                FROM evaluacion_guia
                WHERE trabajo_id = ?
                LIMIT 1
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
                    evaluacion_guia: evaluaciones[0] || null
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
    calificacion,
    decision
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

  if (!['Aprobado', 'Reprobado'].includes(decision)) {
    return res.status(400).json({
      error: 'La decisión debe ser Aprobado o Reprobado'
    });
  }

  // Verificar que el Trabajo de Título existe
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

      // CA1: debe existir al menos una versión para poder evaluarlo
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

          // CA2:
          // Guardar calificación, decisión, Guía y fecha.
          // Si ya existía una evaluación para este TT, se actualiza.
          database.query(
            `
            INSERT INTO evaluacion_guia
              (
                trabajo_id,
                guia_id,
                calificacion,
                decision,
                fecha_evaluacion
              )
            VALUES (?, ?, ?, ?, NOW())

            ON DUPLICATE KEY UPDATE
              guia_id = VALUES(guia_id),
              calificacion = VALUES(calificacion),
              decision = VALUES(decision),
              fecha_evaluacion = NOW()
            `,
            [
              trabajoId,
              guiaId,
              nota,
              decision
            ],
            (err3) => {

              if (err3) {
                return res.status(500).json({
                  error: 'Error al registrar la evaluación del Guía'
                });
              }

              // CA3
              const nuevoEstado =
                decision === 'Aprobado'
                  ? 'aprobado_por_guia'
                  : 'reprobado_por_guia';

              database.query(
                `
                UPDATE trabajo_de_titulo
                SET estado = ?
                WHERE id = ?
                `,
                [nuevoEstado, trabajoId],
                (err4) => {

                  if (err4) {
                    return res.status(500).json({
                      error: 'La evaluación fue registrada, pero no pudo actualizarse el estado del Trabajo de Título'
                    });
                  }

                  // Si está aprobado, cerrar el hito de desarrollo.
                  const estadoHito =
                    decision === 'Aprobado'
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
                    (err5) => {

                      if (err5) {
                        return res.status(500).json({
                          error: 'La evaluación fue registrada, pero no pudo actualizarse el hito'
                        });
                      }

                      // Recuperar la evaluación recién registrada
                      database.query(
                        `
                        SELECT
                          id,
                          trabajo_id,
                          guia_id,
                          calificacion,
                          decision,
                          fecha_evaluacion
                        FROM evaluacion_guia
                        WHERE trabajo_id = ?
                        `,
                        [trabajoId],
                        (err6, evaluaciones) => {

                          if (err6) {
                            return res.status(500).json({
                              error: 'Evaluación registrada, pero no pudo recuperarse'
                            });
                          }

                          return res.status(200).json({
                            mensaje: 'Evaluación del Guía registrada correctamente',
                            ...evaluaciones[0],
                            estado_trabajo: nuevoEstado
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
      e.calificacion,
      e.decision,
      e.fecha_evaluacion,
      t.nombre AS trabajo_nombre,
      t.estado AS estado_trabajo
    FROM evaluacion_guia e
    INNER JOIN trabajo_de_titulo t
      ON t.id = e.trabajo_id
    WHERE e.trabajo_id = ?
    LIMIT 1
    `,
    [trabajoId],
    (err, evaluaciones) => {

      if (err) {
        return res.status(500).json({
          error: 'Error al consultar la evaluación del Guía'
        });
      }

      if (!evaluaciones[0]) {
        return res.status(404).json({
          error: 'El Trabajo de Título todavía no posee una evaluación del Guía'
        });
      }

      return res.status(200).json(evaluaciones[0]);
    }
  );
};

module.exports = {
  getSeguimientoTrabajo,
  getVersionesTrabajo,
  getVersionDetalle,
  registrarAnotacion,
  registrarVersionTrabajo,
  getAntecedentesParaEvaluacion,
  getExamenTrabajo,
  guardarExamenTrabajo,
  registrarEvaluacionGuia,
  getEvaluacionGuia,
};
