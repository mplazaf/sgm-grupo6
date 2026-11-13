SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS BD06_VALIDACIONES CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE BD06_VALIDACIONES;

CREATE TABLE IF NOT EXISTS trabajo_de_titulo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    estado VARCHAR(30) DEFAULT 'en_desarrollo',
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    orden_hito INT NOT NULL,
    FOREIGN KEY (trabajo_id) REFERENCES trabajo_de_titulo(id)
);


CREATE TABLE IF NOT EXISTS examen_titulo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    numero_intento TINYINT NOT NULL,
    fecha DATE NOT NULL,
    sala VARCHAR(100) NOT NULL,
    nota DECIMAL(5,1) DEFAULT NULL,
    resultado ENUM('aprobado', 'reprobado') DEFAULT NULL,
    fecha_resultado DATETIME DEFAULT NULL,
    CONSTRAINT chk_numero_intento
        CHECK (numero_intento BETWEEN 1 AND 2),
    CONSTRAINT uq_examen_trabajo_intento
        UNIQUE (trabajo_id, numero_intento),
    FOREIGN KEY (trabajo_id)
        REFERENCES trabajo_de_titulo(id)
);

CREATE TABLE IF NOT EXISTS evaluacion_examen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    examen_id INT NOT NULL,
    evaluador_id INT NOT NULL,
    tipo_evaluacion VARCHAR(50) NOT NULL,
    calificacion DECIMAL(5,1) NOT NULL,
    fecha_evaluacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_evaluacion_examen_tipo
        UNIQUE (examen_id, tipo_evaluacion),

    FOREIGN KEY (examen_id)
        REFERENCES examen_titulo(id)
);

CREATE TABLE IF NOT EXISTS historial_estado_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    estado_anterior VARCHAR(30) NOT NULL,
    estado_nuevo VARCHAR(30) NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trabajo_id) REFERENCES trabajo_de_titulo(id)
);

CREATE TABLE IF NOT EXISTS accion_pendiente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente',
    FOREIGN KEY (trabajo_id) REFERENCES trabajo_de_titulo(id)
);

CREATE TABLE IF NOT EXISTS version_tt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    numero_version VARCHAR(20) NOT NULL,
    fecha_entrega DATE NOT NULL,
    contenido TEXT NOT NULL,
    FOREIGN KEY (trabajo_id) REFERENCES trabajo_de_titulo(id)
);

CREATE TABLE IF NOT EXISTS anotacion_tt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario TEXT NOT NULL,
    version_id INT NOT NULL,
    guia_id INT NOT NULL,
    autor VARCHAR(100) DEFAULT 'Guía',
    fecha DATETIME NOT NULL,
    FOREIGN KEY (version_id) REFERENCES version_tt(id)
);

CREATE TABLE IF NOT EXISTS evaluacion_guia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    guia_id INT NOT NULL,
    numero_intento INT NOT NULL,
    calificacion DECIMAL(5,1) NOT NULL,
    decision VARCHAR(30) NOT NULL,
    fecha_evaluacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (trabajo_id, numero_intento),

    FOREIGN KEY (trabajo_id)
        REFERENCES trabajo_de_titulo(id)
);

CREATE TABLE IF NOT EXISTS evento_seguimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trabajo_id) REFERENCES trabajo_de_titulo(id)
);

CREATE TABLE IF NOT EXISTS registro_estado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    nombre_estado VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    FOREIGN KEY (trabajo_id) REFERENCES trabajo_de_titulo(id)
);

-- Trabajo de Título 1: caso principal en desarrollo
-- Sirve para probar seguimiento, versiones, anotaciones y evaluación del Guía
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 1, 'Optimización de rutas en redes de transporte público', 'en_desarrollo'
WHERE NOT EXISTS (
    SELECT 1
    FROM trabajo_de_titulo
    WHERE id = 1
);

-- Trabajo de Título 2: caso ya completado
-- Sirve para comprobar que no se puedan registrar nuevas versiones
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 2, 'Trabajo de Título finalizado para pruebas', 'completado'
WHERE NOT EXISTS (
    SELECT 1
    FROM trabajo_de_titulo
    WHERE id = 2
);


-- Hito 1 del Trabajo de Título 1: la propuesta ya fue completada
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 1, 'TT1 · Propuesta de Trabajo de Título', 'completado', 1
WHERE NOT EXISTS (
    SELECT 1
    FROM hito
    WHERE trabajo_id = 1
      AND orden_hito = 1
);

-- Hito 2 del Trabajo de Título 1: actualmente se encuentra en revisión
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 1, 'TT2 · Desarrollo del Trabajo de Título', 'en_revision', 2
WHERE NOT EXISTS (
    SELECT 1
    FROM hito
    WHERE trabajo_id = 1
      AND orden_hito = 2
);

-- Hito 3 del Trabajo de Título 1: examen todavía pendiente
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 1, 'Examen de Título', 'pendiente', 3
WHERE NOT EXISTS (
    SELECT 1
    FROM hito
    WHERE trabajo_id = 1
      AND orden_hito = 3
);


-- Acción pendiente para el Memorista: entregar una nueva versión
INSERT INTO accion_pendiente (trabajo_id, descripcion, responsable, estado)
SELECT 1, 'Entregar nueva versión del Trabajo de Título', 'Memorista', 'pendiente'
WHERE NOT EXISTS (
    SELECT 1
    FROM accion_pendiente
    WHERE trabajo_id = 1
      AND descripcion = 'Entregar nueva versión del Trabajo de Título'
);

-- Acción pendiente para el Guía: revisar la versión 2
INSERT INTO accion_pendiente (trabajo_id, descripcion, responsable, estado)
SELECT 1, 'Revisar versión 2 del Trabajo de Título', 'Guía', 'pendiente'
WHERE NOT EXISTS (
    SELECT 1
    FROM accion_pendiente
    WHERE trabajo_id = 1
      AND descripcion = 'Revisar versión 2 del Trabajo de Título'
);

-- Acción pendiente para el Memorista: corregir observaciones de la versión 2
INSERT INTO accion_pendiente (trabajo_id, descripcion, responsable, estado)
SELECT 1, 'Corregir anotaciones de la versión 2', 'Memorista', 'pendiente'
WHERE NOT EXISTS (
    SELECT 1
    FROM accion_pendiente
    WHERE trabajo_id = 1
      AND descripcion = 'Corregir anotaciones de la versión 2'
);


-- Primera versión registrada del Trabajo de Título 1
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 1, 1, '1.0', '2026-05-10', 'Primera versión del Trabajo de Título con definición inicial del problema y objetivos.'
WHERE NOT EXISTS (
    SELECT 1
    FROM version_tt
    WHERE id = 1
);

-- Segunda versión del Trabajo de Título 1
-- Sobre esta versión se registran posteriormente las anotaciones del Guía
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 2, 1, '2.0', '2026-05-16', 'Segunda versión con ajustes metodológicos y avance del estado del arte.'
WHERE NOT EXISTS (
    SELECT 1
    FROM version_tt
    WHERE id = 2
);

-- Tercera versión del Trabajo de Título 1
-- Permite tener varias versiones disponibles para consultar
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 3, 1, '3.0', '2026-05-22', 'Tercera versión con propuesta de solución y plan preliminar de validación.'
WHERE NOT EXISTS (
    SELECT 1
    FROM version_tt
    WHERE id = 3
);


-- Primera anotación del Guía sobre la versión 2
INSERT INTO anotacion_tt (comentario, version_id, guia_id, autor, fecha)
SELECT 'Precisar la metodología y justificar las métricas seleccionadas.', 2, 1, 'Guía', '2026-05-18 10:30:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_tt
    WHERE version_id = 2
      AND comentario = 'Precisar la metodología y justificar las métricas seleccionadas.'
);

-- Segunda anotación del Guía sobre la misma versión
-- Sirve para comprobar que una versión pueda tener varias anotaciones
INSERT INTO anotacion_tt (comentario, version_id, guia_id, autor, fecha)
SELECT 'Agregar una comparación con trabajos relacionados.', 2, 1, 'Guía', '2026-05-19 15:10:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_tt
    WHERE version_id = 2
      AND comentario = 'Agregar una comparación con trabajos relacionados.'
);


-- Primer estado histórico del Trabajo de Título 1:
-- la propuesta ya había sido aprobada
INSERT INTO registro_estado (trabajo_id, nombre_estado, fecha_inicio, fecha_fin)
SELECT 1, 'propuesta_aprobada', '2026-05-10', '2026-05-16'
WHERE NOT EXISTS (
    SELECT 1
    FROM registro_estado
    WHERE trabajo_id = 1
      AND nombre_estado = 'propuesta_aprobada'
);

-- Estado actual registrado en el historial del Trabajo de Título 1
INSERT INTO registro_estado (trabajo_id, nombre_estado, fecha_inicio, fecha_fin)
SELECT 1, 'en_desarrollo', '2026-05-16', NULL
WHERE NOT EXISTS (
    SELECT 1
    FROM registro_estado
    WHERE trabajo_id = 1
      AND nombre_estado = 'en_desarrollo'
);


-- Historial del Trabajo de Título 2:
-- primero estuvo en desarrollo
INSERT INTO registro_estado (trabajo_id, nombre_estado, fecha_inicio, fecha_fin)
SELECT 2, 'en_desarrollo', '2026-04-01', '2026-04-30'
WHERE NOT EXISTS (
    SELECT 1
    FROM registro_estado
    WHERE trabajo_id = 2
      AND nombre_estado = 'en_desarrollo'
);

-- Estado final del Trabajo de Título 2
INSERT INTO registro_estado (trabajo_id, nombre_estado, fecha_inicio, fecha_fin)
SELECT 2, 'completado', '2026-04-30', NULL
WHERE NOT EXISTS (
    SELECT 1
    FROM registro_estado
    WHERE trabajo_id = 2
      AND nombre_estado = 'completado'
);


-- Evento de seguimiento: se completó el hito de propuesta del Trabajo de Título 1
INSERT INTO evento_seguimiento (trabajo_id, tipo, descripcion, fecha)
SELECT 1, 'hito_completado', 'Se completó el hito TT1 · Propuesta de Trabajo de Título', '2026-05-10 09:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evento_seguimiento
    WHERE trabajo_id = 1
      AND descripcion = 'Se completó el hito TT1 · Propuesta de Trabajo de Título'
);

-- Evento de seguimiento: registro de la versión 1.0
INSERT INTO evento_seguimiento (trabajo_id, tipo, descripcion, fecha)
SELECT 1, 'version_registrada', 'Se registró la versión 1.0 del Trabajo de Título', '2026-05-10 10:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evento_seguimiento
    WHERE trabajo_id = 1
      AND descripcion = 'Se registró la versión 1.0 del Trabajo de Título'
);

-- Evento de seguimiento: registro de la versión 2.0
INSERT INTO evento_seguimiento (trabajo_id, tipo, descripcion, fecha)
SELECT 1, 'version_registrada', 'Se registró la versión 2.0 del Trabajo de Título', '2026-05-16 09:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evento_seguimiento
    WHERE trabajo_id = 1
      AND descripcion = 'Se registró la versión 2.0 del Trabajo de Título'
);

-- Evento de seguimiento: primera anotación registrada sobre la versión 2.0
INSERT INTO evento_seguimiento (trabajo_id, tipo, descripcion, fecha)
SELECT 1, 'anotacion_registrada', 'El Guía registró una anotación sobre la versión 2.0', '2026-05-18 10:30:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evento_seguimiento
    WHERE trabajo_id = 1
      AND descripcion = 'El Guía registró una anotación sobre la versión 2.0'
      AND fecha = '2026-05-18 10:30:00'
);

-- Evento de seguimiento: segunda anotación registrada sobre la versión 2.0
INSERT INTO evento_seguimiento (trabajo_id, tipo, descripcion, fecha)
SELECT 1, 'anotacion_registrada', 'El Guía registró una anotación sobre la versión 2.0', '2026-05-19 15:10:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evento_seguimiento
    WHERE trabajo_id = 1
      AND descripcion = 'El Guía registró una anotación sobre la versión 2.0'
      AND fecha = '2026-05-19 15:10:00'
);

-- Evento de seguimiento: registro de la versión 3.0
INSERT INTO evento_seguimiento (trabajo_id, tipo, descripcion, fecha)
SELECT 1, 'version_registrada', 'Se registró la versión 3.0 del Trabajo de Título', '2026-05-22 09:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evento_seguimiento
    WHERE trabajo_id = 1
      AND descripcion = 'Se registró la versión 3.0 del Trabajo de Título'
);

-- =====================================================
-- Casos adicionales para probar evaluación y examen
-- =====================================================

-- Trabajo de Título 3: aprobado por el Guía y con una defensa pendiente de calificar
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 3, 'Sistema inteligente de gestión de salas universitarias', 'aprobado_por_guia'
WHERE NOT EXISTS (
    SELECT 1 FROM trabajo_de_titulo WHERE id = 3
);

-- Versiones del Trabajo de Título 3
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 4, 3, '1.0', '2026-10-20', 'Primera versión del sistema de gestión inteligente de salas universitarias.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 4
);

INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 5, 3, '2.0', '2026-11-02', 'Versión final con implementación, pruebas y resultados del sistema de gestión de salas.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 5
);

-- Evaluación del Guía aprobada para permitir que el trabajo continúe al examen
INSERT INTO evaluacion_guia (trabajo_id, guia_id, numero_intento, calificacion, decision, fecha_evaluacion)
SELECT 3, 10, 1, 78.0, 'aprobado', '2026-11-03 10:30:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluacion_guia
    WHERE trabajo_id = 3
      AND numero_intento = 1
);

-- Hitos del Trabajo de Título 3
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 3, 'TT1 · Propuesta de Trabajo de Título', 'completado', 1
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 3 AND orden_hito = 1
);

INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 3, 'TT2 · Desarrollo del Trabajo de Título', 'completado', 2
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 3 AND orden_hito = 2
);

INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 3, 'Examen de Título', 'habilitado', 3
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 3 AND orden_hito = 3
);

-- Primera oportunidad del Trabajo 3, todavía sin resultado
-- Este caso sirve directamente para probar el botón Calificar de HU-08
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 1, 3, 1, '2026-11-12', 'Sala B-201', NULL, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 1
);


-- Trabajo de Título 4: caso ya aprobado y finalizado
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 4, 'Plataforma de análisis de rendimiento académico', 'finalizado'
WHERE NOT EXISTS (
    SELECT 1 FROM trabajo_de_titulo WHERE id = 4
);

-- Versiones del Trabajo de Título 4
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 6, 4, '1.0', '2026-09-25', 'Versión inicial de la plataforma de análisis de rendimiento académico.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 6
);

INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 7, 4, '2.0', '2026-10-20', 'Versión final con análisis, implementación y conclusiones.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 7
);

-- Evaluación del Guía aprobada para el Trabajo 4
INSERT INTO evaluacion_guia (trabajo_id, guia_id, numero_intento, calificacion, decision, fecha_evaluacion)
SELECT 4, 11, 1, 82.0, 'aprobado', '2026-10-22 11:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluacion_guia
    WHERE trabajo_id = 4
      AND numero_intento = 1
);

-- Hito de examen del Trabajo 4
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 4, 'Examen de Título', 'habilitado', 3
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 4 AND orden_hito = 3
);

-- Examen del Trabajo 4 ya aprobado
-- Sirve para comprobar que no se pueda volver a calificar
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 2, 4, 1, '2026-11-06', 'Sala C-110', 72.0, 'aprobado', '2026-11-06 16:20:00'
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 2
);

-- Cambio de estado provocado por el examen aprobado
INSERT INTO historial_estado_trabajo (trabajo_id, estado_anterior, estado_nuevo, fecha_cambio)
SELECT 4, 'aprobado_por_guia', 'finalizado', '2026-11-06 16:20:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM historial_estado_trabajo
    WHERE trabajo_id = 4
      AND estado_nuevo = 'finalizado'
);


-- Trabajo de Título 5: primera oportunidad reprobada
-- Sirve para probar la habilitación de una segunda oportunidad en HU-09
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 5, 'Sistema de detección de anomalías en redes computacionales', 'segunda_oportunidad_pendiente'
WHERE NOT EXISTS (
    SELECT 1 FROM trabajo_de_titulo WHERE id = 5
);

-- Versiones del Trabajo de Título 5
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 8, 5, '1.0', '2026-09-18', 'Primera versión del sistema de detección de anomalías en redes.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 8
);

INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 9, 5, '2.0', '2026-10-20', 'Versión final del sistema con resultados de validación y conclusiones.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 9
);

-- Evaluación aprobada del Guía para el Trabajo 5
INSERT INTO evaluacion_guia (trabajo_id, guia_id, numero_intento, calificacion, decision, fecha_evaluacion)
SELECT 5, 12, 1, 75.0, 'aprobado', '2026-10-22 09:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluacion_guia
    WHERE trabajo_id = 5
      AND numero_intento = 1
);

-- Hito de examen habilitado para el Trabajo 5
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 5, 'Examen de Título', 'habilitado', 3
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 5 AND orden_hito = 3
);

-- Primera oportunidad reprobada
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 3, 5, 1, '2026-11-04', 'Sala A-105', 49.0, 'reprobado', '2026-11-04 15:15:00'
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 3
);

-- Historial del cambio luego de reprobar la primera oportunidad
INSERT INTO historial_estado_trabajo (trabajo_id, estado_anterior, estado_nuevo, fecha_cambio)
SELECT 5, 'aprobado_por_guia', 'segunda_oportunidad_pendiente', '2026-11-04 15:15:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM historial_estado_trabajo
    WHERE trabajo_id = 5
      AND estado_nuevo = 'segunda_oportunidad_pendiente'
);


-- Trabajo de Título 6: primera oportunidad reprobada y segunda ya programada
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 6, 'Aplicación de monitoreo de infraestructura universitaria', 'segunda_oportunidad_pendiente'
WHERE NOT EXISTS (
    SELECT 1 FROM trabajo_de_titulo WHERE id = 6
);

-- Versiones del Trabajo de Título 6
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 10, 6, '1.0', '2026-09-15', 'Primera versión de la aplicación de monitoreo de infraestructura.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 10
);

INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 11, 6, '2.0', '2026-10-18', 'Versión final con implementación y pruebas de monitoreo.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 11
);

-- Evaluación aprobada del Guía para el Trabajo 6
INSERT INTO evaluacion_guia (trabajo_id, guia_id, numero_intento, calificacion, decision, fecha_evaluacion)
SELECT 6, 13, 1, 68.0, 'aprobado', '2026-10-21 12:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluacion_guia
    WHERE trabajo_id = 6
      AND numero_intento = 1
);

-- Hito de examen habilitado para el Trabajo 6
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 6, 'Examen de Título', 'habilitado', 3
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 6 AND orden_hito = 3
);

-- Primera oportunidad reprobada del Trabajo 6
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 4, 6, 1, '2026-11-05', 'Sala A-210', 52.0, 'reprobado', '2026-11-05 14:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 4
);

-- Segunda oportunidad pendiente del Trabajo 6
-- Este caso sirve para probar la calificación de una segunda oportunidad en HU-08
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 5, 6, 2, '2026-11-18', 'Sala A-212', NULL, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 5
);

-- Historial asociado a la primera reprobación del Trabajo 6
INSERT INTO historial_estado_trabajo (trabajo_id, estado_anterior, estado_nuevo, fecha_cambio)
SELECT 6, 'aprobado_por_guia', 'segunda_oportunidad_pendiente', '2026-11-05 14:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM historial_estado_trabajo
    WHERE trabajo_id = 6
      AND estado_nuevo = 'segunda_oportunidad_pendiente'
);


-- Trabajo de Título 7: ambas oportunidades reprobadas
-- Sirve para revisar el caso final de examen reprobado
INSERT INTO trabajo_de_titulo (id, nombre, estado)
SELECT 7, 'Herramienta de apoyo para planificación de proyectos de software', 'examen_reprobado'
WHERE NOT EXISTS (
    SELECT 1 FROM trabajo_de_titulo WHERE id = 7
);

-- Versiones del Trabajo de Título 7
INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 12, 7, '1.0', '2026-09-10', 'Primera versión de la herramienta de planificación de proyectos.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 12
);

INSERT INTO version_tt (id, trabajo_id, numero_version, fecha_entrega, contenido)
SELECT 13, 7, '2.0', '2026-10-10', 'Versión final de la herramienta con resultados y conclusiones.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_tt WHERE id = 13
);

-- Evaluación aprobada del Guía para el Trabajo 7
INSERT INTO evaluacion_guia (trabajo_id, guia_id, numero_intento, calificacion, decision, fecha_evaluacion)
SELECT 7, 14, 1, 70.0, 'aprobado', '2026-10-12 11:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluacion_guia
    WHERE trabajo_id = 7
      AND numero_intento = 1
);

-- Hito de examen habilitado para el Trabajo 7
INSERT INTO hito (trabajo_id, nombre, estado, orden_hito)
SELECT 7, 'Examen de Título', 'habilitado', 3
WHERE NOT EXISTS (
    SELECT 1 FROM hito WHERE trabajo_id = 7 AND orden_hito = 3
);

-- Primera oportunidad reprobada
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 6, 7, 1, '2026-10-28', 'Sala B-102', 45.0, 'reprobado', '2026-10-28 13:30:00'
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 6
);

-- Segunda oportunidad también reprobada
INSERT INTO examen_titulo (id, trabajo_id, numero_intento, fecha, sala, nota, resultado, fecha_resultado)
SELECT 7, 7, 2, '2026-11-10', 'Sala B-104', 51.0, 'reprobado', '2026-11-10 16:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM examen_titulo WHERE id = 7
);

-- Historial de la primera reprobación
INSERT INTO historial_estado_trabajo (trabajo_id, estado_anterior, estado_nuevo, fecha_cambio)
SELECT 7, 'aprobado_por_guia', 'segunda_oportunidad_pendiente', '2026-10-28 13:30:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM historial_estado_trabajo
    WHERE trabajo_id = 7
      AND estado_nuevo = 'segunda_oportunidad_pendiente'
);

-- Historial de la segunda reprobación
INSERT INTO historial_estado_trabajo (trabajo_id, estado_anterior, estado_nuevo, fecha_cambio)
SELECT 7, 'segunda_oportunidad_pendiente', 'examen_reprobado', '2026-11-10 16:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM historial_estado_trabajo
    WHERE trabajo_id = 7
      AND estado_nuevo = 'examen_reprobado'
);


-- Evaluación de otro participante asociada al examen 1
-- Sirve para probar que HU-05 pueda distinguir la evaluación del Correferente
INSERT INTO evaluacion_examen (examen_id, evaluador_id, tipo_evaluacion, calificacion, fecha_evaluacion)
SELECT 1, 20, 'Comisión', 80.0, '2026-11-12 12:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM evaluacion_examen
    WHERE examen_id = 1
      AND tipo_evaluacion = 'Comisión'
);


CREATE DATABASE IF NOT EXISTS BD06_TRAMITACION CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE BD06_TRAMITACION;

CREATE TABLE IF NOT EXISTS propuesta_tt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tema VARCHAR(150) NOT NULL,
    memorista VARCHAR(120) NOT NULL,
    contenido TEXT NOT NULL,
    estado_aprobacion VARCHAR(30) DEFAULT 'pendiente',
    fecha_registro DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS version_propuesta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propuesta_id INT NOT NULL,
    numero_version VARCHAR(20) NOT NULL,
    fecha_entrega DATE NOT NULL,
    contenido TEXT NOT NULL,
    FOREIGN KEY (propuesta_id) REFERENCES propuesta_tt(id)
);

CREATE TABLE IF NOT EXISTS anotacion_propuesta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version_propuesta_id INT NOT NULL,
    comentario TEXT NOT NULL,
    autor VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (version_propuesta_id) REFERENCES version_propuesta(id)
);

-- Propuesta 1: caso pendiente, útil para probar la revisión y aprobación
INSERT INTO propuesta_tt (id, nombre_tema, memorista, contenido, estado_aprobacion, fecha_registro)
SELECT 1, 'Optimización de rutas en redes de transporte público', 'Diego Salinas', 'Propuesta orientada a optimizar rutas de transporte público mediante análisis de datos y criterios de eficiencia.', 'pendiente', '2026-05-21'
WHERE NOT EXISTS (SELECT 1 FROM propuesta_tt WHERE id = 1);

-- Propuesta 2: segundo caso pendiente para poder probar más de una propuesta
INSERT INTO propuesta_tt (id, nombre_tema, memorista, contenido, estado_aprobacion, fecha_registro)
SELECT 2, 'Sistema de apoyo para planificación académica', 'Camila Soto', 'Propuesta para apoyar la planificación académica mediante seguimiento de carga y requisitos.', 'pendiente', '2026-05-20'
WHERE NOT EXISTS (SELECT 1 FROM propuesta_tt WHERE id = 2);

-- Propuesta 3: caso ya aprobado para tener un ejemplo con un estado distinto
INSERT INTO propuesta_tt (id, nombre_tema, memorista, contenido, estado_aprobacion, fecha_registro)
SELECT 3, 'Visualización de indicadores para gestión universitaria', 'Martín Pérez', 'Propuesta de tablero para visualizar indicadores relevantes de gestión universitaria.', 'aprobada', '2026-05-18'
WHERE NOT EXISTS (SELECT 1 FROM propuesta_tt WHERE id = 3);


-- Primera versión de la propuesta 1
INSERT INTO version_propuesta (id, propuesta_id, numero_version, fecha_entrega, contenido)
SELECT 1, 1, '1.0', '2026-05-21', 'Primera versión de la propuesta: optimización de rutas en redes de transporte público, con problema, objetivos y justificación inicial.'
WHERE NOT EXISTS (SELECT 1 FROM version_propuesta WHERE id = 1);


-- Primera observación realizada sobre la versión 1 de la propuesta 1
INSERT INTO anotacion_propuesta (version_propuesta_id, comentario, autor, fecha)
SELECT 1, 'Precisar mejor la definición del problema y revisar que los objetivos específicos estén alineados con la solución propuesta.', 'Profesor TT1', '2026-05-21'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_propuesta
    WHERE version_propuesta_id = 1
      AND comentario LIKE 'Precisar mejor%'
);

-- Segunda observación sobre la misma versión, para probar varias anotaciones asociadas
INSERT INTO anotacion_propuesta (version_propuesta_id, comentario, autor, fecha)
SELECT 1, 'Incluir antecedentes que permitan justificar la relevancia del problema abordado.', 'Profesor TT1', '2026-05-21'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_propuesta
    WHERE version_propuesta_id = 1
      AND comentario LIKE 'Incluir antecedentes%'
);

-- Propuesta 4: caso pendiente con una temática distinta
INSERT INTO propuesta_tt (id, nombre_tema, memorista, contenido, estado_aprobacion, fecha_registro)
SELECT 4, 'Aplicación web para seguimiento de prácticas profesionales', 'Valentina Rojas', 'Sistema web orientado al seguimiento de estudiantes durante su proceso de práctica profesional.', 'pendiente', '2026-06-02'
WHERE NOT EXISTS (
    SELECT 1 FROM propuesta_tt WHERE id = 4
);

-- Propuesta 5: segundo caso pendiente para ampliar los datos disponibles
INSERT INTO propuesta_tt (id, nombre_tema, memorista, contenido, estado_aprobacion, fecha_registro)
SELECT 5, 'Sistema de recomendación de asignaturas', 'Benjamín Torres', 'Sistema para recomendar asignaturas considerando avance curricular y requisitos académicos.', 'pendiente', '2026-06-05'
WHERE NOT EXISTS (
    SELECT 1 FROM propuesta_tt WHERE id = 5
);

-- Propuesta 6: caso ya aprobado
INSERT INTO propuesta_tt (id, nombre_tema, memorista, contenido, estado_aprobacion, fecha_registro)
SELECT 6, 'Plataforma de monitoreo energético para edificios universitarios', 'Fernanda Morales', 'Plataforma para visualizar y analizar el consumo energético de edificios universitarios.', 'aprobada', '2026-06-01'
WHERE NOT EXISTS (
    SELECT 1 FROM propuesta_tt WHERE id = 6
);

-- Segunda versión de la propuesta 1
INSERT INTO version_propuesta (id, propuesta_id, numero_version, fecha_entrega, contenido)
SELECT 2, 1, '2.0', '2026-05-25', 'Segunda versión de la propuesta con ajustes en los objetivos y una metodología más detallada.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_propuesta WHERE id = 2
);

-- Primera versión de la propuesta 4
INSERT INTO version_propuesta (id, propuesta_id, numero_version, fecha_entrega, contenido)
SELECT 3, 4, '1.0', '2026-06-02', 'Primera versión de la propuesta de seguimiento de prácticas profesionales.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_propuesta WHERE id = 3
);

-- Segunda versión de la propuesta 4
INSERT INTO version_propuesta (id, propuesta_id, numero_version, fecha_entrega, contenido)
SELECT 4, 4, '2.0', '2026-06-07', 'Segunda versión con ajustes en los actores involucrados y el flujo de seguimiento.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_propuesta WHERE id = 4
);

-- Primera versión de la propuesta 5
INSERT INTO version_propuesta (id, propuesta_id, numero_version, fecha_entrega, contenido)
SELECT 5, 5, '1.0', '2026-06-05', 'Primera versión de la propuesta de recomendación de asignaturas.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_propuesta WHERE id = 5
);

-- Primera versión de la propuesta 6
INSERT INTO version_propuesta (id, propuesta_id, numero_version, fecha_entrega, contenido)
SELECT 6, 6, '1.0', '2026-06-01', 'Versión aprobada de la propuesta de monitoreo energético.'
WHERE NOT EXISTS (
    SELECT 1 FROM version_propuesta WHERE id = 6
);

-- Observación sobre la segunda versión de la propuesta 1
INSERT INTO anotacion_propuesta (version_propuesta_id, comentario, autor, fecha)
SELECT 2, 'La metodología está mejor definida. Revisar únicamente la redacción del segundo objetivo específico.', 'Profesor TT1', '2026-05-26'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_propuesta
    WHERE version_propuesta_id = 2
      AND comentario LIKE 'La metodología está mejor definida%'
);

-- Observación sobre la primera versión de la propuesta 4
INSERT INTO anotacion_propuesta (version_propuesta_id, comentario, autor, fecha)
SELECT 3, 'Definir con mayor claridad quién será responsable de registrar los avances de la práctica.', 'Profesor TT1', '2026-06-03'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_propuesta
    WHERE version_propuesta_id = 3
      AND comentario LIKE 'Definir con mayor claridad%'
);

-- Observación sobre la segunda versión de la propuesta 4
INSERT INTO anotacion_propuesta (version_propuesta_id, comentario, autor, fecha)
SELECT 4, 'La nueva versión incorpora correctamente los actores identificados.', 'Profesor TT1', '2026-06-08'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_propuesta
    WHERE version_propuesta_id = 4
      AND comentario LIKE 'La nueva versión incorpora%'
);

-- Observación sobre la propuesta 5
INSERT INTO anotacion_propuesta (version_propuesta_id, comentario, autor, fecha)
SELECT 5, 'Agregar antecedentes que justifiquen el criterio utilizado para realizar las recomendaciones.', 'Profesor TT1', '2026-06-06'
WHERE NOT EXISTS (
    SELECT 1
    FROM anotacion_propuesta
    WHERE version_propuesta_id = 5
      AND comentario LIKE 'Agregar antecedentes%'
);

