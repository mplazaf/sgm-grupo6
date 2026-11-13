const express = require('express');
const router = new express.Router();
const index = require('../controllers/index');


// =====================================================
// HU-01 - Consultar seguimiento del Trabajo de Título
// =====================================================

router.get(
  '/api/trabajos/:id/seguimiento',
  index.getSeguimientoTrabajo
);


// =====================================================
// HU-02 - Registrar y consultar anotaciones por versión
// =====================================================

// Consultar versiones disponibles de un Trabajo de Título
router.get(
  '/api/trabajos/:id/versiones',
  index.getVersionesTrabajo
);

// Consultar detalle y anotaciones de una versión específica
router.get(
  '/api/versiones/:id',
  index.getVersionDetalle
);

// Registrar una anotación sobre una versión
router.post(
  '/api/versiones/:id/anotaciones',
  index.registrarAnotacion
);


// =====================================================
// HU-11 - Registrar nueva versión del Trabajo de Título
// =====================================================

router.post(
  '/api/trabajos/:id/versiones',
  index.registrarVersionTrabajo
);


// =====================================================
// HU-09 - Registrar fecha y sala del Examen de Título
// =====================================================

// HU-09 CA1 y CA3:
// Consultar los antecedentes y oportunidades de examen
router.get(
  '/api/trabajos/:id/examen',
  index.getExamenTrabajo
);

// HU-09 CA2 y CA4:
// Registrar o modificar fecha y sala del examen
router.put(
  '/api/trabajos/:id/examen',
  index.guardarExamenTrabajo
);


// =====================================================
// HU-07 - Registrar evaluación y aprobación del Guía
// =====================================================

// HU-07 CA1 y CA4:
// Consultar versión final, revisiones y evaluaciones del Guía
router.get(
  '/api/trabajos/:id/antecedentes-evaluacion',
  index.getAntecedentesParaEvaluacion
);

// HU-07 CA2 y CA3:
// Registrar evaluación del Guía
router.post(
  '/api/trabajos/:id/evaluacion',
  index.registrarEvaluacionGuia
);

// HU-07 CA3 y CA4:
// Consultar posteriormente evaluaciones registradas
router.get(
  '/api/trabajos/:id/evaluacion',
  index.getEvaluacionGuia
);


// =====================================================
// HU-06 - Consultar historial del Trabajo de Título
// =====================================================

// HU-06 CA1-CA4:
// Consultar historial cronológico del Trabajo de Título
router.get(
  '/api/trabajos/:id/historial',
  index.getHistorialSeguimiento
);


// =====================================================
// HU-08 - Registrar resultado del Examen de Título
// =====================================================

// HU-08 CA1, CA3 y CA4:
// Listar exámenes registrados
router.get(
  '/api/trabajos-examen',
  index.getTrabajosConExamen
);

// HU-08 CA1, CA2 y CA4:
// Registrar la nota y resultado de una oportunidad específica
//
// IMPORTANTE:
// examenId identifica exactamente qué oportunidad
// del examen se está calificando.
router.post(
  '/api/trabajos/:id/resultado-examen/:examenId',
  index.registrarResultadoExamen
);

// HU-08 CA3:
// Consultar los resultados de las oportunidades del examen
router.get(
  '/api/trabajos/:id/resultado-examen',
  index.getResultadoExamen
);

// HU-08 CA4:
// Consultar historial de cambios de estado
router.get(
  '/api/trabajos/:id/historial-estados',
  index.getHistorialEstados
);


// =====================================================
// HU-05 - Registrar evaluación del Correferente
// =====================================================

// HU-05 CA1, CA3 y CA4:
// Consultar versión final, exámenes y evaluaciones asociadas
router.get(
  '/api/trabajos/:id/antecedentes-correferente',
  index.getAntecedentesCorreferente
);

// HU-05 CA2:
// Registrar evaluación del Correferente
// asociada a una oportunidad específica del examen
router.post(
  '/api/examenes/:id/evaluacion-correferente',
  index.registrarEvaluacionCorreferente
);


// =====================================================
// EXPORTAR ROUTER
// =====================================================

module.exports = router;