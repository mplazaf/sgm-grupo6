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


module.exports = {
  getSeguimientoTrabajo,
  getVersionesTrabajo,
  getVersionDetalle,
  registrarAnotacion,
  registrarVersionTrabajo,
  getExamenTrabajo,
  guardarExamenTrabajo,
};
