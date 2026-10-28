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

API utilizada para las funcionalidades asociadas al seguimiento, versiones y anotaciones de los Trabajos de Título.

Actualmente contiene las funcionalidades correspondientes a:

- HU-01
- HU-02
- HU-11

Puerto:

```text
8081
```

## FRONTEND

Contiene las interfaces utilizadas para interactuar con las funcionalidades implementadas.

## database

Contiene el archivo:

```text
database/init.sql
```

Este archivo crea las bases de datos y los datos iniciales utilizados por el sistema.

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

Cada API utiliza un archivo `.env` para configurar su puerto y conexión a MySQL.

Las variables utilizadas son:

```text
PORT_API
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
DB_HOST
```

## API_TRAMITACION

Configuración:

```env
PORT_API=8080
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="BD06_TRAMITACION"
DB_PORT=3306
DB_HOST="host.docker.internal"
```

## API_VALIDACIONES

Configuración:

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

| Funcionalidad | URL |
|---|---|
| Seguimiento del Trabajo de Título - HU-01 | `http://localhost:5500/seguimiento.html` |
| Registrar anotaciones - HU-02 | `http://localhost:5500/anotacion.html` |
| Aprobar propuesta - HU-04 | `http://localhost:5500/propuestas.html` |
| Registrar nueva versión - HU-11 | `http://localhost:5500/nueva-version.html` |

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