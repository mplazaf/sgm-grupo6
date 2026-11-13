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

│   └── init.sql

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

GET  /api/propuestas

GET  /api/propuestas/:id

PUT  /api/propuestas/:id/aprobar

GET  /api/propuestas/:id/versiones

GET  /api/version-propuesta/:id

POST /api/version-propuesta/:id/anotaciones

```

## API_VALIDACIONES

```text

GET  /api/trabajos/:id/seguimiento

GET  /api/trabajos/:id/versiones

GET  /api/versiones/:id

POST /api/versiones/:id/anotaciones

POST /api/trabajos/:id/versiones

GET  /api/trabajos/:id/historial

GET  /api/trabajos/:id/antecedentes-evaluacion

POST /api/trabajos/:id/evaluacion

GET  /api/trabajos/:id/evaluacion

GET  /api/trabajos-examen

POST /api/trabajos/:id/resultado-examen/:examenId

GET  /api/trabajos/:id/resultado-examen

GET  /api/trabajos/:id/historial-estados

GET  /api/trabajos/:id/examen

PUT  /api/trabajos/:id/examen

GET  /api/trabajos/:id/antecedentes-correferente

POST /api/examenes/:id/evaluacion-correferente

```

---

**# Guía de prueba

Esta guía permite revisar las historias de usuario implementadas usando los datos iniciales cargados por database/init.sql.

Antes de comenzar, se deben levantar MySQL, ambas API y el frontend siguiendo la sección Cómo levantar el proyecto.

HU-01 - Consultar seguimiento del Trabajo de Título
Rol: Memorista
Pantalla: seguimiento.html
Dato de prueba: Trabajo de Título ID 1.
- CA1: Ingresar el ID 1 y presionar Consultar seguimiento.
  Se espera: visualizar el estado actual del Trabajo de Título.
- CA2: Revisar los hitos asociados al trabajo.
  Se espera: distinguir el estado de cada hito, por ejemplo completado, pendiente, en revisión o habilitado.
- CA3: Revisar las acciones pendientes.
  Se espera: ver la descripción de cada acción y su responsable.
- CA4: Realizar una acción que cambie el estado o los hitos del trabajo, por ejemplo aprobarlo desde HU-07, y volver a consultar.
  Se espera: visualizar la información actualizada.
HU-02 - Registrar anotaciones sobre una versión del Trabajo de Título
Rol: Guía
Pantalla: anotacion.html
Dato de prueba: Trabajo de Título ID 1.
- CA1: Consultar el trabajo y seleccionar una de sus versiones.
  Se espera: visualizar el contenido de la versión seleccionada.
- CA2: Registrar una anotación sobre esa versión.
  Se espera: que la anotación quede asociada a la versión junto con autor y fecha.
- CA3: Volver a consultar las anotaciones disponibles.
  Se espera: poder identificar a qué versión pertenece cada anotación.
- CA4: Consultar dos versiones distintas.
  Se espera: que cada versión muestre únicamente sus propias anotaciones.
HU-03 - Revisar Propuesta de Trabajo de Título para aprobación
Rol: Profesor TT1
Pantalla: revision-propuesta.html
Dato de prueba: Propuesta ID 1.
- CA1: Consultar la propuesta y abrir una versión disponible.
  Se espera: visualizar el contenido de la versión de la propuesta.
- CA2: Registrar una anotación.
  Se espera: que quede asociada a la versión junto con autor y fecha.
- CA3: Volver a abrir la misma versión.
  Se espera: que la anotación registrada siga disponible.
- CA4: Abrir después la misma propuesta desde propuestas.html.
  Se espera: que el Jefe de Carrera pueda ver las anotaciones realizadas por el Profesor TT1.
HU-04 - Aprobar Propuesta de Trabajo de Título
Rol: Jefe de Carrera
Pantalla: propuestas.html
Dato de prueba: Propuesta ID 1, inicialmente pendiente.
- CA1: Abrir una propuesta pendiente.
  Se espera: visualizar su contenido y las anotaciones asociadas.
- CA2: Presionar Aprobar propuesta y confirmar.
  Se espera: que el estado cambie a Aprobada.
- CA3: Revisar el listado o utilizar el filtro de estado.
  Se espera: distinguir propuestas pendientes de propuestas aprobadas.
- CA4: Volver a consultar la propuesta aprobada.
  Se espera: que siga apareciendo como aprobada y pueda continuar a la siguiente etapa.
Curso alternativo: intentar aprobar nuevamente una propuesta que ya está aprobada.
Se espera: que el sistema no genere una segunda aprobación ni deje un estado inconsistente.
HU-05 - Registrar evaluación del Correferente
Rol: Correferente
Pantalla: evaluacion-correferente.html
Dato de prueba: Trabajo de Título ID 3.
- CA1: Consultar el Trabajo de Título.
  Se espera: revisar la versión final asociada al examen.
- CA2: Seleccionar el examen, ingresar el ID del Correferente y registrar una calificación.
  Se espera: que la evaluación quede asociada al Examen de Título junto con su fecha y tipo.
- CA3: Volver a consultar los antecedentes del mismo trabajo.
  Se espera: visualizar nuevamente la calificación, fecha y tipo de evaluación.
- CA4: Revisar las evaluaciones asociadas al examen.
  Se espera: distinguir la evaluación del Correferente de las demás evaluaciones registradas.
HU-06 - Consultar historial de seguimiento
Rol: Memorista
Pantalla: historial.html
Dato de prueba: Trabajo de Título ID 1.
- CA1: Consultar el historial del trabajo.
  Se espera: ver los eventos registrados, mostrando primero los más recientes.
- CA2: Revisar los elementos de la línea de tiempo.
  Se espera: que cada evento muestre su tipo y fecha.
- CA3: Generar un cambio de estado, por ejemplo aprobando el trabajo desde HU-07, y volver a consultar.
  Se espera: que el cambio de estado aparezca en el historial junto con su fecha.
- CA4: Registrar una nueva acción que genere un evento y volver a consultar.
  Se espera: que el nuevo evento aparezca sin eliminar los registros anteriores.
HU-07 - Registrar evaluación del Guía
Rol: Guía
Pantalla: evaluacion.html
Dato de prueba: Trabajo de Título ID 1.
- CA1: Consultar los antecedentes del trabajo.
  Se espera: visualizar la versión final y las revisiones realizadas durante el desarrollo.
- CA2: Ingresar el ID del Guía y una calificación, luego registrar la evaluación.
  Se espera: que queden guardadas la calificación y la decisión de aprobación.
- CA3: Si la nota es 55 o superior, volver a consultar el seguimiento.
  Se espera: que el trabajo quede en estado aprobado_por_guia, que el hito TT2 quede completado y que el hito de Examen de Título quede habilitado.
- CA4: Consultar posteriormente los antecedentes de evaluación.
  Se espera: visualizar la calificación, resultado y fecha de la evaluación registrada.
Curso alternativo: registrar una nota menor a 55.
Se espera: que el trabajo quede reprobado por el Guía y que se permita otro intento mientras no se alcance el máximo de 3 VTR.

También se puede intentar registrar una nueva evaluación después de haber aprobado. En ese caso el sistema debe bloquear la operación.
HU-08 - Registrar resultado del Examen de Título y finalizar el proceso
Rol: Jefe de Carrera
Pantalla: resultado-examen.html
Datos de prueba: existen exámenes pendientes cargados desde init.sql.
- CA1: Seleccionar un examen pendiente e ingresar una nota.
  Se espera: que el sistema determine automáticamente si la defensa fue aprobada o reprobada.
- CA2: Registrar una nota de 55 o superior.
  Se espera: que el Trabajo de Título cambie al estado finalizado y que el hito Examen de Título quede completado.
- CA3: Volver a consultar el resultado.
  Se espera: visualizar la nota, el resultado y la fecha en que fue registrado.
- CA4: Consultar después el historial.
  Se espera: que aparezca el cambio de estado provocado por el resultado del examen y el evento de hito completado.
Curso alternativo: registrar una nota menor a 55 en la primera oportunidad.
Se espera: que el trabajo pase a segunda_oportunidad_pendiente y que el hito de examen siga habilitado.

Si se reprueba también la segunda oportunidad, el trabajo pasa a examen_reprobado y el hito de Examen de Título queda completado.
HU-09 - Registrar información del Examen de Título
Rol: Secretaría
Pantalla: registrar-examen.html
Dato de prueba: usar un Trabajo de Título aprobado por el Guía y con el hito de Examen de Título habilitado.
- CA1: Consultar el Trabajo de Título.
  Se espera: identificar el examen que corresponde registrar.
- CA2: Ingresar una fecha válida y una sala.
  Se espera: que ambos datos queden asociados al examen.
- CA3: Volver a consultar el mismo trabajo.
  Se espera: visualizar nuevamente la fecha y sala registradas.
- CA4: Modificar la fecha o sala y guardar.
  Se espera: que una nueva consulta muestre la información actualizada.
Curso alternativo: intentar usar una fecha pasada o correspondiente a fin de semana.
Se espera: que el sistema rechace la fecha.
HU-10 - Consultar anotaciones de una versión del Trabajo de Título
Rol: Memorista
Pantalla: consultar-anotaciones.html
Dato de prueba: Trabajo de Título ID 1.
- CA1: Consultar el trabajo y seleccionar una versión.
  Se espera: visualizar el contenido de la versión y sus anotaciones.
- CA2: Seleccionar una versión que tenga anotaciones del Guía.
  Se espera: ver el contenido de cada anotación junto con autor y fecha.
- CA3: Cambiar entre distintas versiones.
  Se espera: que solo se muestren las anotaciones de la versión seleccionada.
- CA4: Seleccionar una versión que no tenga anotaciones.
  Se espera: que el sistema informe que no existen anotaciones disponibles para esa versión.
HU-11 - Registrar nueva versión del Trabajo de Título
Rol: Memorista
Pantalla: nueva-version.html
Datos de prueba: Trabajo de Título ID 1 para un caso en desarrollo e ID 2 para un trabajo completado.
- CA1: Usar el Trabajo de Título ID 1, ingresar contenido y registrar una nueva versión.
  Se espera: que se genere una nueva versión con fecha de entrega y número correlativo.
- CA2: Usar el Trabajo de Título ID 2 e intentar registrar una nueva versión.
  Se espera: que el sistema bloquee la operación porque el trabajo ya está completado.
- CA3: Volver a consultar las versiones del Trabajo de Título ID 1.
  Se espera: que la nueva versión aparezca junto con las anteriores, sin sobrescribirlas.
- CA4: Intentar registrar una versión dejando el contenido vacío.
  Se espera: que el sistema rechace el registro e informe que el contenido es obligatorio.
Curso alternativo: el caso del contenido vacío también puede usarse como curso alternativo durante la demostración final.
Verificar los servicios**
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