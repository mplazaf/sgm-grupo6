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

// HU-02 CA2: registrar anotación sobre una versión
const registrarAnotacion = (req, res) => {
  const versionId = req.params.id;
  const { comentario, guia_id } = req.body;
  const query = "INSERT INTO anotacion_tt (comentario, version_id, guia_id, fecha) VALUES (?, ?, ?, NOW())";

  database.query(query, [comentario, versionId, guia_id], (err, result) => {
    if (err) throw err;
    database.query("SELECT * FROM anotacion_tt WHERE id = ?", [result.insertId], (err2, rows) => {
      if (err2) throw err2;
      res.status(201).json(rows[0]);
    });
  });
};

module.exports = {
  getEstadoTrabajo,
  registrarAnotacion,
};
