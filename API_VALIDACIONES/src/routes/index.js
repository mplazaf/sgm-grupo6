const express = require('express');
const router = new express.Router();
const index = require('../controllers/index');

router.get('/api/trabajos/:id/seguimiento', index.getSeguimientoTrabajo);
router.get('/api/trabajos/:id/versiones', index.getVersionesTrabajo);
router.get('/api/versiones/:id', index.getVersionDetalle);
router.post('/api/versiones/:id/anotaciones', index.registrarAnotacion);
router.post('/api/trabajos/:id/versiones', index.registrarVersionTrabajo);
router.get('/api/trabajos/:id/examen', index.getExamenTrabajo);
router.put('/api/trabajos/:id/examen', index.guardarExamenTrabajo);
router.get('/api/trabajos/:id/antecedentes-evaluacion', index.getAntecedentesParaEvaluacion);
router.post('/api/trabajos/:id/evaluacion', index.registrarEvaluacionGuia);
router.get('/api/trabajos/:id/evaluacion', index.getEvaluacionGuia);
router.get('/api/trabajos/:id/historial', index.getHistorialSeguimiento);

module.exports = router;

