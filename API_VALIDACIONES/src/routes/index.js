const express = require('express');
const router = new express.Router();
const index = require('../controllers/index');

router.get(
  '/api/trabajos/:id/seguimiento',
  index.getSeguimientoTrabajo
);

router.get(
  '/api/trabajos/:id/versiones',
  index.getVersionesTrabajo
);

router.get(
  '/api/versiones/:id',
  index.getVersionDetalle
);

router.post(
  '/api/versiones/:id/anotaciones',
  index.registrarAnotacion
);

router.post(
  '/api/trabajos/:id/versiones',
  index.registrarVersionTrabajo
);

// HU-09
router.get(
  '/api/trabajos/:id/examen',
  index.getExamenTrabajo
);

router.put(
  '/api/trabajos/:id/examen',
  index.guardarExamenTrabajo
);

// HU-07
router.get(
  '/api/trabajos/:id/antecedentes-evaluacion',
  index.getAntecedentesParaEvaluacion
);

router.post(
  '/api/trabajos/:id/evaluacion',
  index.registrarEvaluacionGuia
);

router.get(
  '/api/trabajos/:id/evaluacion',
  index.getEvaluacionGuia
);

// HU-06
router.get(
  '/api/trabajos/:id/historial',
  index.getHistorialSeguimiento
);

// HU-08
router.get(
  '/api/trabajos-examen',
  index.getTrabajosConExamen
);

router.post(
  '/api/trabajos/:id/resultado-examen/:examenId',
  index.registrarResultadoExamen
);

router.get(
  '/api/trabajos/:id/resultado-examen',
  index.getResultadoExamen
);

router.get(
  '/api/trabajos/:id/historial-estados',
  index.getHistorialEstados
);

// HU-05
router.get(
  '/api/trabajos/:id/antecedentes-correferente',
  index.getAntecedentesCorreferente
);

router.post(
  '/api/examenes/:id/evaluacion-correferente',
  index.registrarEvaluacionCorreferente
);

module.exports = router;