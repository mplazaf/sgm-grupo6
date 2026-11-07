# GRUPO06-2026-PROYINF

Repositorio correspondiente al proyecto de la asignatura **INF236 - Análisis y Diseño de Software**.

El proyecto corresponde a un **Sistema de Gestión de Trabajos de Título**, orientado al seguimiento del proceso de titulación y a la interacción entre Memoristas, Guías y Jefatura de Carrera.

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

## Video del prototipo

El video de demostración correspondiente al Hito 3 se encuentra disponible en el siguiente enlace:

[Ver video del prototipo](https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F52BFE67361D9DD8B%21s5e7e5d63e5c14c1ba4c769d96a7e1d8f%3Fithint%3Dvideo%26e%3D8Vfkka%26migratedtospo%3Dtrue&cid=52BFE67361D9DD8B&id=52BFE67361D9DD8B%21s5e7e5d63e5c14c1ba4c769d96a7e1d8f&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy81MmJmZTY3MzYxZDlkZDhiL0lRQmpYWDVld2VVYlRLVEhhZGxxZmgyUEFWNXhNejM0TDNJdjhBeS1fSHJGMW1BP2U9OFZma2th&v=photos)

---

# Funcionalidades implementadas

Actualmente el sistema cuenta con funcionalidades asociadas a las siguientes historias de usuario:

### HU-01 - Consultar seguimiento del Trabajo de Título

Permite al Memorista consultar:

- Estado actual del Trabajo de Título.
- Hitos asociados al proceso.
- Estado de cada hito.
- Acciones pendientes.
- Responsable de cada acción pendiente.

### HU-02 - Registrar anotaciones sobre una versión del Trabajo de Título

Permite al Guía:

- Consultar las versiones registradas de un Trabajo de Título.
- Revisar el contenido de una versión específica.
- Consultar las anotaciones asociadas a esa versión.
- Registrar nuevas anotaciones con autor y fecha.

### HU-04 - Aprobar Propuesta de Trabajo de Título

Permite al Jefe de Carrera:

- Consultar las propuestas registradas.
- Identificar propuestas pendientes y aprobadas.
- Consultar el contenido de una propuesta.
- Revisar las anotaciones realizadas por el Profesor TT1.
- Aprobar una propuesta pendiente.

### HU-09 - Registrar información del Examen de Título

Permite a Secretaria:

- Consultar los antecedentes de un Trabajo de Título y su hito de examen.
- Visualizar las oportunidades de examen registradas.
- Registrar la fecha y sala de la primera o segunda oportunidad de defensa.
- Consultar posteriormente las fechas y salas registradas.
- Actualizar la fecha y sala de una oportunidad existente.
- Mantener un máximo de dos oportunidades de examen por Trabajo de Título.
- Impedir el registro de una segunda oportunidad si no existe la primera.
- Validar que la segunda oportunidad tenga una fecha posterior a la primera.
- Impedir reprogramaciones que alteren el orden cronológico de las oportunidades.

**Dependencias pendientes:** La autorización académica para continuar
hacia el Examen de Título depende de la aprobación del Guía (HU-07).
La habilitación de una segunda oportunidad depende del resultado
de la primera defensa (HU-08). Estas validaciones todavía no están
integradas en el backend de HU-09.

### HU-10 - Consultar anotaciones de una versión del Trabajo de Título

Permite al Memorista:

- Consultar las versiones registradas de su Trabajo de Título.
- Seleccionar una versión específica.
- Revisar el contenido de la versión seleccionada.
- Consultar las anotaciones realizadas por el Guía.
- Visualizar el autor y la fecha de cada anotación.
- Recibir un aviso cuando una versión no posee anotaciones registradas.

### HU-11 - Registrar nueva versión del Trabajo de Título

Permite al Memorista:

- Registrar el contenido de una nueva versión.
- Generar automáticamente un número de versión correlativo.
- Registrar automáticamente su fecha de entrega.
- Mantener las versiones anteriores en el historial.
- Impedir entregas con contenido vacío.
- Impedir nuevas entregas cuando el Trabajo de Título se encuentra completado.

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

API destinada a las operaciones relacionadas con la tramitación de las propuestas de Trabajo de Título.

Actualmente contiene las funcionalidades correspondientes principalmente a **HU-04**.

Puerto:

```text
8080
```

## API_VALIDACIONES

API utilizada para las funcionalidades asociadas al seguimiento, versiones, anotaciones y gestión de los Exámenes de Título.

Actualmente contiene las funcionalidades correspondientes a:

- HU-01
- HU-02
- HU-09
- HU-10
- HU-11

Puerto:

```text
8081
```

## FRONTEND

Contiene las interfaces utilizadas para interactuar con las funcionalidades implementadas.

La funcionalidad HU-09 utiliza los siguientes archivos:

- `FRONTEND/registrar-examen.html`: interfaz para consultar los antecedentes del Trabajo de Título y registrar o actualizar la fecha y sala de las oportunidades de examen.
- `FRONTEND/registrar-examen.js`: lógica de consulta, registro y actualización de exámenes mediante los servicios de API_VALIDACIONES.

## database

Contiene el archivo:

```text
database/init.sql
```

Este archivo crea las bases de datos y los datos iniciales utilizados por el sistema.


### Tabla examen_titulo (HU-09)

La tabla `examen_titulo`, perteneciente a `BD06_VALIDACIONES`, almacena la información de las oportunidades de Examen de Título.

Sus campos principales son:

- `id`: identificador del examen.
- `trabajo_id`: identificador del Trabajo de Título asociado.
- `numero_intento`: primera o segunda oportunidad de examen.
- `fecha`: fecha programada para la defensa.
- `sala`: sala asignada para la defensa.

Cada Trabajo de Título puede tener un máximo de dos oportunidades de examen, identificadas mediante `numero_intento` (1 o 2).

La combinación de `trabajo_id` y `numero_intento` es única, evitando duplicar una misma oportunidad.

Además, el sistema valida que exista la primera oportunidad antes de registrar la segunda y que las fechas mantengan un orden cronológico correcto.

La autorización académica para rendir el examen depende de HU-07 y HU-08, cuya integración se encuentra pendiente.
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

Las dos API utilizan las siguientes dependencias:

- `cors`: permite solicitudes entre el frontend y las API ejecutadas en distintos puertos.
- `dotenv`: permite cargar las variables definidas en los archivos `.env`.
- `express`: framework utilizado para implementar las API REST.
- `morgan`: registra las solicitudes HTTP recibidas.
- `mysql2`: permite realizar la conexión entre Node.js y MySQL.

---

# Bases de datos

El archivo `database/init.sql` crea dos bases de datos.

## BD06_VALIDACIONES

Contiene información relacionada con:

- Trabajos de Título.
- Hitos.
- Acciones pendientes.
- Versiones.
- Anotaciones sobre versiones.

## BD06_TRAMITACION

Contiene información relacionada con:

- Propuestas de Trabajo de Título.
- Anotaciones realizadas sobre las propuestas.
- Estado de aprobación de las propuestas.

---

# Variables de configuración

Cada API requiere un archivo `.env` local para definir su puerto y los parámetros de conexión a MySQL.

Por razones de configuración y seguridad, los archivos `.env` **no se versionan en el repositorio**.

En su lugar, cada API incluye un archivo:

```text
.env.example
```

que contiene la configuración necesaria para ejecutar el proyecto en el entorno local.

## API_TRAMITACION

El archivo:

```text
API_TRAMITACION/.env.example
```

contiene:

```env
PORT_API=8080
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="BD06_TRAMITACION"
DB_PORT=3306
DB_HOST="host.docker.internal"
```

Antes de levantar la API se debe crear una copia de `.env.example` con el nombre:

```text
.env
```

La estructura esperada es:

```text
API_TRAMITACION/
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── ...
```

## API_VALIDACIONES

El archivo:

```text
API_VALIDACIONES/.env.example
```

contiene:

```env
PORT_API=8081
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="BD06_VALIDACIONES"
DB_PORT=3306
DB_HOST="host.docker.internal"
```

Antes de levantar la API se debe crear una copia de `.env.example` con el nombre:

```text
.env
```

La estructura esperada es:

```text
API_VALIDACIONES/
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── ...
```

Por razones de configuración y seguridad, los archivos `.env` no se versionan en el repositorio. En su lugar, cada API incluye un archivo `.env.example` con la configuración necesaria para ejecutar el proyecto en el entorno local.

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

## 3. Levantar MySQL

Desde la carpeta raíz del proyecto:

```bash
docker compose up -d
```

Esto inicia MySQL en:

```text
localhost:3306
```

Al crearse por primera vez el volumen de MySQL, el archivo:

```text
database/init.sql
```

creará automáticamente las bases de datos `BD06_VALIDACIONES` y `BD06_TRAMITACION` junto con los datos iniciales.

Se puede verificar el contenedor ejecutando:

```bash
docker ps
```

## 4. Levantar API_TRAMITACION

Desde la raíz:

```bash
cd API_TRAMITACION
docker compose up --build -d
```

La API estará disponible en:

```text
http://localhost:8080
```

## 5. Levantar API_VALIDACIONES

Desde `API_TRAMITACION`:

```bash
cd ../API_VALIDACIONES
docker compose up --build -d
```

La API estará disponible en:

```text
http://localhost:8081
```

## 6. Levantar el frontend

Desde `API_VALIDACIONES`:

```bash
cd ../FRONTEND
python3 -m http.server 5500
```

En sistemas donde el comando sea `python` en lugar de `python3` se puede utilizar:

```bash
python -m http.server 5500
```

El servidor debe permanecer ejecutándose mientras se utiliza el frontend.

---

# Pantallas disponibles

| Funcionalidad                             | URL                                                  |
| ----------------------------------------- | ---------------------------------------------------- |
| Seguimiento del Trabajo de Título - HU-01 | `http://localhost:5500/seguimiento.html`             |
| Registrar anotaciones - HU-02             | `http://localhost:5500/anotacion.html`               |
| Aprobar propuesta - HU-04                 | `http://localhost:5500/propuestas.html`              |
| Registrar examen - HU-09                  | `http://localhost:5500/registrar-examen.html`      |
| Consultar anotaciones - HU-10             | `http://localhost:5500/consultar-anotaciones.html`   |
| Registrar nueva versión - HU-11           | `http://localhost:5500/nueva-version.html`           |

---

# Endpoints principales

## API_VALIDACIONES

### Consultar seguimiento de un Trabajo de Título

```text
GET /api/trabajos/:id/seguimiento
```

### Consultar versiones de un Trabajo de Título

```text
GET /api/trabajos/:id/versiones
```

### Consultar una versión específica

```text
GET /api/versiones/:id
```

### Registrar una anotación sobre una versión

```text
POST /api/versiones/:id/anotaciones
```

### Registrar una nueva versión

```text
POST /api/trabajos/:id/versiones
```
### Consultar los exámenes de un Trabajo de Título (HU-09)

```text
GET /api/trabajos/:id/examen
```

Permite consultar los antecedentes del Trabajo de Título y las oportunidades de examen registradas, incluyendo el número de intento, la fecha y la sala de cada defensa.

### Registrar o actualizar un Examen de Título (HU-09)

```text
PUT /api/trabajos/:id/examen
```

Permite registrar o actualizar la fecha y sala de una oportunidad de examen.

El cuerpo de la solicitud debe contener:

```json
{
  "numero_intento": 1,
  "fecha": "2026-12-15",
  "sala": "Sala A-101"
}
```

El número de intento puede ser `1` o `2`. El sistema exige que exista la primera oportunidad antes de registrar la segunda y valida que las fechas de ambas defensas mantengan un orden cronológico correcto.

**Limitación actual:** La autorización académica del examen y la habilitación de una segunda oportunidad están pendientes de integración con HU-07 y HU-08.


## API_TRAMITACION

### Consultar propuestas

```text
GET /api/propuestas
```

También es posible filtrar por estado:

```text
GET /api/propuestas?estado=pendiente
GET /api/propuestas?estado=aprobada
```

### Consultar detalle de una propuesta

```text
GET /api/propuestas/:id
```

### Aprobar una propuesta

```text
PUT /api/propuestas/:id/aprobar
```

---

# Verificar los servicios

Para revisar los contenedores Docker activos:

```bash
docker ps
```

Los servicios principales utilizan los siguientes puertos:

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