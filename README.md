# GRUPO06-2026-PROYINF

Repositorio correspondiente al proyecto de la asignatura **INF236 - Análisis y Diseño de Software**.

El proyecto corresponde a un **Sistema de Gestión de Trabajos de Título (SGM)**, orientado al seguimiento del proceso de titulación y a la interacción entre Memoristas, Profesor TT1, Guías, Correferentes, Secretaría y Jefatura de Carrera.

## Integrantes

- Sebastián Contreras - 202473041-K
- Miguel Plaza - 202473058-4
- María José Alvarez - 202473045-2
- Noelia Opazo - 202473069-K

## Ayudante - Tutor

- Fernanda Araya

## Wiki

La documentación del proyecto, incluyendo historias de usuario, modelo de dominio, decisiones de diseño y documentación del prototipo, se encuentra disponible en la Wiki del repositorio.

[Ir a la Wiki](https://gitlab.inf.utfsm.cl/inf236-cc-2026-2/grupo06-2026-proyinf/-/wikis/home)

## Video final - Hito 5

El video final de demostración del sistema debe mostrar las historias de usuario comprometidas, su funcionamiento y la trazabilidad con los criterios de aceptación.

**Enlace del video:**  
[[Video de Proyecto Finalizado](https://usmcl-my.sharepoint.com/:v:/g/personal/scontrerasa_usm_cl/IQALNcQ6H4QNR6grCEjtz8JdAQjkklRwaPVIBsNu4CIuVTU)]

---

# Funcionalidades implementadas

El sistema cuenta con funcionalidades asociadas a las siguientes historias de usuario.

### HU-01 - Consultar seguimiento del Trabajo de Título

Permite al Memorista:

- Consultar el estado actual del Trabajo de Título.
- Visualizar los hitos asociados al proceso.
- Consultar el estado de cada hito.
- Visualizar las acciones pendientes.
- Identificar al responsable de cada acción pendiente.

### HU-02 - Registrar anotaciones sobre una versión del Trabajo de Título

Permite al Guía:

- Consultar las versiones registradas de un Trabajo de Título.
- Revisar el contenido de una versión específica.
- Consultar las anotaciones asociadas a esa versión.
- Registrar nuevas anotaciones asociadas a la versión.
- Mantener autor y fecha de cada anotación.

### HU-03 - Revisar Propuesta de Trabajo de Título para aprobación

Permite al Profesor TT1:

- Consultar el contenido de una versión de la Propuesta de Trabajo de Título pendiente de revisión.
- Registrar anotaciones asociadas a una versión de la propuesta junto con su autor y fecha.
- Consultar posteriormente las anotaciones registradas sobre una versión.
- Mantener disponibles las anotaciones para que el Jefe de Carrera pueda revisarlas durante el proceso de aprobación.

### HU-04 - Aprobar Propuesta de Trabajo de Título

Permite al Jefe de Carrera:

- Consultar las propuestas registradas.
- Identificar propuestas pendientes y aprobadas.
- Revisar el contenido de una propuesta.
- Consultar las observaciones realizadas por el Profesor TT1.
- Aprobar una propuesta pendiente.
- Consultar posteriormente su estado de aprobación.

### HU-05 - Registrar evaluación del Correferente

Permite al Correferente:

- Consultar los antecedentes de un Examen de Título asociado al Trabajo de Título.
- Revisar la versión final correspondiente.
- Registrar una calificación asociada al Examen de Título.
- Mantener registrada la fecha y el tipo de evaluación.
- Consultar posteriormente la evaluación registrada.
- Distinguir la evaluación del Correferente de las evaluaciones realizadas por otros participantes.

### HU-06 - Consultar historial de seguimiento

Permite al Memorista:

- Consultar eventos de seguimiento del Trabajo de Título.
- Revisar los eventos en orden cronológico.
- Identificar el tipo y fecha de cada evento.
- Consultar los cambios de estado registrados.
- Mantener disponibles los registros anteriores al incorporar nuevos eventos.

### HU-07 - Registrar evaluación del Guía

Permite al Guía:

- Consultar la versión final del Trabajo de Título y las revisiones realizadas durante su desarrollo.
- Registrar la evaluación del Trabajo de Título.
- Asociar una calificación y una decisión de aprobación.
- Consultar posteriormente la calificación, resultado y fecha de evaluación.
- Identificar que la aprobación del Guía requerida para continuar hacia el Examen de Título se encuentra cumplida.

### HU-08 - Registrar resultado del Examen de Título y finalizar el proceso

Permite al Jefe de Carrera:

- Consultar los exámenes registrados.
- Identificar la oportunidad específica de examen.
- Registrar una nota entre 0 y 100.
- Determinar automáticamente si la defensa fue aprobada o reprobada.
- Cambiar el Trabajo de Título a `finalizado` cuando el examen es aprobado.
- Habilitar una segunda oportunidad cuando la primera es reprobada.
- Cambiar el estado a `examen_reprobado` cuando la segunda oportunidad es reprobada.
- Consultar posteriormente el resultado y su fecha.
- Mantener un historial cronológico de los cambios de estado.
- Impedir volver a calificar una oportunidad que ya posee resultado.

### HU-09 - Registrar información del Examen de Título

Permite a Secretaría:

- Consultar la información de un Trabajo de Título que se encuentra en condiciones de continuar hacia el Examen de Título.
- Identificar el examen correspondiente.
- Registrar la fecha y sala de la defensa.
- Consultar posteriormente la fecha y sala registradas.
- Modificar la información del examen.
- Consultar nuevamente el examen y visualizar la fecha y sala vigentes.

### HU-10 - Consultar anotaciones de una versión del Trabajo de Título

Permite al Memorista:

- Consultar las versiones registradas de su Trabajo de Título.
- Seleccionar una versión específica.
- Revisar su contenido.
- Consultar las anotaciones realizadas por el Guía.
- Visualizar autor y fecha de cada anotación.
- Recibir un aviso cuando una versión no posee anotaciones.

### HU-11 - Registrar nueva versión del Trabajo de Título

Permite al Memorista:

- Registrar el contenido de una nueva versión.
- Generar automáticamente un número de versión correlativo.
- Registrar automáticamente su fecha de entrega.
- Mantener disponibles las versiones anteriores.
- Impedir entregas con contenido vacío.
- Impedir nuevas entregas cuando el Trabajo de Título ya se encuentra completado.

---

# Estructura del proyecto

El proyecto se encuentra dividido en dos API, un frontend y la configuración de la base de datos.

```text
grupo06-2026-proyinf/
├── API_TRAMITACION/
├── API_VALIDACIONES/
├── FRONTEND/
├── database/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## API_TRAMITACION

API destinada a las operaciones relacionadas con la tramitación y revisión de las propuestas de Trabajo de Título.

Contiene principalmente las funcionalidades de:

- HU-03
- HU-04

Puerto:

```text
8080
```

## API_VALIDACIONES

API utilizada para seguimiento, versiones, anotaciones, historial, evaluaciones y gestión del Examen de Título.

Contiene principalmente las funcionalidades de:

- HU-01
- HU-02
- HU-05
- HU-06
- HU-07
- HU-08
- HU-09
- HU-10
- HU-11

Puerto:

```text
8081
```

## FRONTEND

Contiene las interfaces utilizadas para interactuar con las 11 historias de usuario implementadas.

## database

Contiene:

```text
database/init.sql
```

El archivo crea las bases de datos, tablas y datos iniciales utilizados para probar distintos estados del flujo del Trabajo de Título.

---

# Tecnologías utilizadas

El proyecto utiliza:

- Node.js
- Express
- MySQL
- HTML
- CSS
- JavaScript
- Docker
- Docker Compose
- Python 3, utilizado para servir localmente el frontend

Las API se ejecutan utilizando la imagen:

```text
node:18-alpine
```

La base de datos utiliza la imagen oficial:

```text
mysql
```

---

# Dependencias

Las API utilizan las siguientes dependencias:

- `cors`: permite solicitudes entre el frontend y las API ejecutadas en distintos puertos.
- `dotenv`: carga las variables definidas en los archivos `.env`.
- `express`: framework utilizado para implementar las API REST.
- `morgan`: registra las solicitudes HTTP recibidas.
- `mysql2`: permite la conexión entre Node.js y MySQL.

---

# Bases de datos

El archivo `database/init.sql` crea dos bases de datos.

## BD06_VALIDACIONES

Contiene información relacionada con:

- Trabajos de Título.
- Hitos.
- Acciones pendientes.
- Versiones del Trabajo de Título.
- Anotaciones sobre versiones.
- Evaluaciones del Guía.
- Exámenes de Título.
- Evaluaciones asociadas al examen.
- Historial de cambios de estado.
- Eventos de seguimiento.

## BD06_TRAMITACION

Contiene información relacionada con:

- Propuestas de Trabajo de Título.
- Versiones de propuestas.
- Anotaciones realizadas durante la revisión.
- Estado de aprobación de las propuestas.

---

# Variables de configuración

Cada API requiere un archivo `.env` local con su puerto y los parámetros de conexión a MySQL.

Los archivos `.env` no se versionan. Cada API incluye un `.env.example`.

## API_TRAMITACION

Crear:

```text
API_TRAMITACION/.env
```

a partir de:

```text
API_TRAMITACION/.env.example
```

Configuración esperada:

```env
PORT_API=8080
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="BD06_TRAMITACION"
DB_PORT=3306
DB_HOST="host.docker.internal"
```

## API_VALIDACIONES

Crear:

```text
API_VALIDACIONES/.env
```

a partir de:

```text
API_VALIDACIONES/.env.example
```

Configuración esperada:

```env
PORT_API=8081
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="BD06_VALIDACIONES"
DB_PORT=3306
DB_HOST="host.docker.internal"
```

---

# Cómo levantar el proyecto

## 1. Requisitos previos

Se debe contar con:

- Git
- Docker
- Docker Compose
- Python 3

En Linux, dependiendo de la configuración de Docker, puede ser necesario utilizar `sudo` antes de los comandos `docker compose`.

## 2. Clonar el repositorio

```bash
git clone https://gitlab.inf.utfsm.cl/inf236-cc-2026-2/grupo06-2026-proyinf.git
cd grupo06-2026-proyinf
```

## 3. Crear los archivos `.env`

En cada API copiar el archivo `.env.example` como `.env`.

## 4. Levantar MySQL

Desde la carpeta raíz:

```bash
docker compose up -d
```

La base de datos queda disponible en:

```text
localhost:3306
```

## 5. Levantar API_TRAMITACION

```bash
cd API_TRAMITACION
docker compose up --build -d
```

Disponible en:

```text
http://localhost:8080
```

## 6. Levantar API_VALIDACIONES

```bash
cd ../API_VALIDACIONES
docker compose up --build -d
```

Disponible en:

```text
http://localhost:8081
```

## 7. Levantar el frontend

```bash
cd ../FRONTEND
python3 -m http.server 5500
```

En Windows también puede utilizarse:

```bash
python -m http.server 5500
```

Abrir:

```text
http://localhost:5500/seguimiento.html
```

---

# Pantallas disponibles

| HU | Funcionalidad | URL |
|---|---|---|
| HU-01 | Seguimiento del Trabajo de Título | `http://localhost:5500/seguimiento.html` |
| HU-02 | Registrar anotaciones | `http://localhost:5500/anotacion.html` |
| HU-03 | Revisar Propuesta de Trabajo de Título para aprobación | `http://localhost:5500/revision-propuesta.html` |
| HU-04 | Aprobar propuesta | `http://localhost:5500/propuestas.html` |
| HU-05 | Evaluación del Correferente | `http://localhost:5500/evaluacion-correferente.html` |
| HU-06 | Historial de seguimiento | `http://localhost:5500/historial.html` |
| HU-07 | Evaluación del Guía | `http://localhost:5500/evaluacion.html` |
| HU-08 | Resultado del Examen de Título | `http://localhost:5500/resultado-examen.html` |
| HU-09 | Registrar Examen de Título | `http://localhost:5500/registrar-examen.html` |
| HU-10 | Consultar anotaciones | `http://localhost:5500/consultar-anotaciones.html` |
| HU-11 | Registrar nueva versión | `http://localhost:5500/nueva-version.html` |

---

# Endpoints principales

## API_TRAMITACION

```text
GET  /api/propuestas
GET  /api/propuestas/:id
PUT  /api/propuestas/:id/aprobar
GET  /api/propuestas/:id/versiones
GET  /api/version-propuesta/:id
POST /api/version-propuesta/:id/anotaciones
```

## API_VALIDACIONES

```text
GET  /api/trabajos/:id/seguimiento
GET  /api/trabajos/:id/versiones
GET  /api/versiones/:id
POST /api/versiones/:id/anotaciones
POST /api/trabajos/:id/versiones

GET  /api/trabajos/:id/historial

GET  /api/trabajos/:id/antecedentes-evaluacion
POST /api/trabajos/:id/evaluacion
GET  /api/trabajos/:id/evaluacion

GET  /api/trabajos-examen
POST /api/trabajos/:id/resultado-examen/:examenId
GET  /api/trabajos/:id/resultado-examen
GET  /api/trabajos/:id/historial-estados

GET  /api/trabajos/:id/examen
PUT  /api/trabajos/:id/examen

GET  /api/trabajos/:id/antecedentes-correferente
POST /api/examenes/:id/evaluacion-correferente
```

---

# Guía de prueba

Esta sección describe los pasos necesarios para reproducir los criterios de aceptación de cada historia de usuario comprometida.

Antes de comenzar, se deben levantar MySQL, ambas API y el frontend siguiendo la sección **Cómo levantar el proyecto**.

## HU-01 - Consultar seguimiento del Trabajo de Título

**Pantalla:** `seguimiento.html`

- **CA1:** Ingresar el ID `1` y consultar su seguimiento. Verificar que se muestre el estado actual del Trabajo de Título.
- **CA2:** En el mismo resultado, revisar los hitos asociados y comprobar que se pueda distinguir cuáles están completados, pendientes o en revisión.
- **CA3:** Revisar las acciones pendientes y verificar que cada una muestre la acción y su responsable.
- **CA4:** Realizar una operación que cambie información del Trabajo de Título o de uno de sus hitos y volver a consultar el seguimiento. Verificar que se muestre la información actualizada.

## HU-02 - Registrar anotaciones sobre una versión del Trabajo de Título

**Pantalla:** `anotacion.html`

- **CA1:** Consultar el Trabajo de Título `1`, seleccionar una versión y verificar que se pueda visualizar su contenido.
- **CA2:** Registrar una anotación sobre la versión seleccionada y comprobar que quede asociada a esa versión junto con autor y fecha.
- **CA3:** Consultar las anotaciones disponibles y verificar que se pueda identificar a qué versión corresponde cada una.
- **CA4:** Consultar dos versiones distintas y comprobar que cada una muestre únicamente las anotaciones asociadas a esa versión.

## HU-03 - Revisar Propuesta de Trabajo de Título para aprobación

**Pantalla:** `revision-propuesta.html`

- **CA1:** Consultar una propuesta con versión pendiente de revisión y verificar que el Profesor TT1 pueda visualizar el contenido de esa versión.
- **CA2:** Registrar una anotación sobre la versión y verificar que quede asociada a ella junto con autor y fecha.
- **CA3:** Volver a consultar la misma versión y comprobar que las anotaciones registradas anteriormente permanezcan disponibles.
- **CA4:** Abrir `propuestas.html` como Jefe de Carrera, seleccionar la misma propuesta y verificar que se puedan visualizar las anotaciones asociadas a la versión revisada.

## HU-04 - Aprobar Propuesta de Trabajo de Título

**Pantalla:** `propuestas.html`

- **CA1:** Abrir una propuesta pendiente, por ejemplo la propuesta `1`, y verificar que se muestre su contenido junto con las anotaciones registradas durante su revisión.
- **CA2:** Presionar **Aprobar propuesta**, confirmar la acción y comprobar que el estado cambie a `Aprobada`.
- **CA3:** Utilizar el filtro de estado y verificar que se puedan distinguir las propuestas pendientes de las ya aprobadas.
- **CA4:** Volver a consultar una propuesta aprobada y comprobar que el sistema muestre su estado `Aprobada` y que puede continuar hacia la siguiente etapa.

## HU-05 - Registrar evaluación del Correferente

**Pantalla:** `evaluacion-correferente.html`

- **CA1:** Consultar un Trabajo de Título con Examen de Título asociado y verificar que se pueda revisar su versión final.
- **CA2:** Registrar la calificación del Correferente y comprobar que quede asociada al Examen de Título junto con la fecha y el tipo de evaluación.
- **CA3:** Volver a consultar los antecedentes del Examen de Título y verificar que se visualicen la calificación, fecha y tipo de evaluación registrados.
- **CA4:** Revisar las evaluaciones asociadas al examen y comprobar que la evaluación del Correferente se pueda distinguir de las realizadas por otros participantes.

## HU-06 - Consultar historial de seguimiento

**Pantalla:** `historial.html`

- **CA1:** Consultar el historial del Trabajo de Título `1` y verificar que los eventos aparezcan en orden cronológico.
- **CA2:** Revisar los eventos y comprobar que cada uno muestre su tipo y fecha de registro.
- **CA3:** Verificar que los cambios de estado del Trabajo de Título aparezcan en el historial junto con sus fechas.
- **CA4:** Registrar una nueva acción que genere un evento de seguimiento, volver a consultar el historial y comprobar que el nuevo evento aparezca sin eliminar los registros anteriores.

## HU-07 - Registrar evaluación del Guía

**Pantalla:** `evaluacion.html`

- **CA1:** Consultar los antecedentes de un Trabajo de Título con versión final y verificar que el Guía pueda revisar la versión final y las revisiones realizadas durante su desarrollo.
- **CA2:** Registrar la evaluación del Guía y comprobar que queden asociadas la calificación y la decisión de aprobación.
- **CA3:** Consultar nuevamente el estado del Trabajo de Título y verificar que se pueda identificar que la aprobación del Guía requerida para continuar hacia el Examen de Título se encuentra cumplida.
- **CA4:** Consultar posteriormente los antecedentes del Trabajo de Título y verificar que se muestren la calificación, resultado y fecha de evaluación.

## HU-08 - Registrar resultado del Examen de Título y finalizar el proceso

**Pantalla:** `resultado-examen.html`

- **CA1:** Seleccionar un examen pendiente, registrar una nota y comprobar que el sistema indique si la defensa fue aprobada o reprobada.
- **CA2:** Registrar una nota aprobatoria en una defensa pendiente y verificar que el Trabajo de Título cambie al estado `Finalizado`.
- **CA3:** Volver a consultar el Trabajo de Título y comprobar que se pueda visualizar el resultado de la defensa y la fecha correspondiente.
- **CA4:** Consultar el historial de estados y verificar que el cambio producido por el resultado del examen quede registrado cronológicamente.

## HU-09 - Registrar información del Examen de Título

**Pantalla:** `registrar-examen.html`

- **CA1:** Consultar un Trabajo de Título que se encuentre en condiciones de continuar hacia el Examen de Título y verificar que Secretaría pueda identificar el examen correspondiente.
- **CA2:** Registrar la fecha y sala de la defensa y comprobar que ambas queden asociadas al Examen de Título.
- **CA3:** Volver a consultar el examen y verificar que la fecha y sala registradas permanezcan disponibles.
- **CA4:** Modificar la fecha o sala del examen, consultar nuevamente y comprobar que se muestren los datos vigentes.

## HU-10 - Consultar anotaciones de una versión del Trabajo de Título

**Pantalla:** `consultar-anotaciones.html`

- **CA1:** Consultar una versión del Trabajo de Título y verificar que se muestren su contenido y las anotaciones asociadas.
- **CA2:** Seleccionar una versión que posea anotaciones del Guía y comprobar que cada anotación muestre su contenido, autor y fecha.
- **CA3:** Consultar versiones distintas y verificar que solo se muestren las anotaciones correspondientes a la versión seleccionada.
- **CA4:** Consultar una versión que no posea anotaciones del Guía y comprobar que el sistema informe que no existen anotaciones disponibles.

## HU-11 - Registrar nueva versión del Trabajo de Título

**Pantalla:** `nueva-version.html`

- **CA1:** Utilizar un Trabajo de Título en estado `En desarrollo`, ingresar contenido y registrar una nueva versión. Verificar que se almacene con fecha de entrega y número correlativo en formato de texto, por ejemplo `2.0`.
- **CA2:** Utilizar un Trabajo de Título en estado `completado` e intentar registrar una nueva versión. Verificar que el sistema bloquee la acción e informe que no se permiten nuevas entregas.
- **CA3:** Registrar una nueva versión en un trabajo que ya posea versiones anteriores y verificar que la nueva entrega se incorpore sin sobrescribir las anteriores.
- **CA4:** Intentar registrar una versión con el contenido vacío y comprobar que el sistema rechace el registro e informe que el contenido es obligatorio.

---

# Verificar los servicios

Para revisar los contenedores Docker activos:

```bash
docker ps
```

Servicios utilizados:

| Servicio | Puerto |
|---|---:|
| MySQL | 3306 |
| API_TRAMITACION | 8080 |
| API_VALIDACIONES | 8081 |
| Frontend | 5500 |

---

# Cómo detener el proyecto

Para detener `API_TRAMITACION`:

```bash
cd API_TRAMITACION
docker compose down
```

Para detener `API_VALIDACIONES`:

```bash
cd ../API_VALIDACIONES
docker compose down
```

Finalmente, para detener MySQL:

```bash
cd ..
docker compose down
```
