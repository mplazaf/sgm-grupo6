
const API = 'http://localhost:8081';

let trabajoSeleccionado = null;
let examenesRegistrados = [];

const formBuscar = document.getElementById('formBuscar');
const formExamen = document.getElementById('formExamen');
const selectorIntento = document.getElementById('numeroIntento');

const detalle = document.getElementById('detalle');
const registro = document.getElementById('registro');
const mensajeExito = document.getElementById('mensajeExito');
const mensajeError = document.getElementById('mensajeError');

function limpiarMensajes() {
  mensajeExito.textContent = '';
  mensajeError.textContent = '';
}

async function solicitarJSON(url, opciones = {}) {
  const respuesta = await fetch(url, opciones);
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error || 'Error al comunicarse con la API');
  }

  return datos;
}

// HU-09 CA1 y CA3: consultar el trabajo y sus exámenes.
async function consultarTrabajo(id) {
  limpiarMensajes();

  trabajoSeleccionado = null;
  examenesRegistrados = [];
  detalle.style.display = 'none';
  registro.style.display = 'none';

  try {
    const datos = await solicitarJSON(
      `${API}/api/trabajos/${id}/examen`
    );

    trabajoSeleccionado = datos.trabajo_id;
    examenesRegistrados = datos.examenes || [];

    document.getElementById('nombreTrabajo').textContent =
      datos.trabajo_nombre;

    document.getElementById('estadoTrabajo').textContent =
      datos.estado_trabajo;

    document.getElementById('estadoHito').textContent =
      datos.hito_examen_id === null
        ? 'No registrado'
        : datos.estado_hito_examen;

    mostrarExamenes();
    cargarDatosIntento();

    detalle.style.display = 'block';
    registro.style.display = 'block';

  } catch (error) {
    mensajeError.textContent = error.message;
  }
}

function mostrarExamenes() {
  const contenedor = document.getElementById('listaExamenes');
  contenedor.replaceChildren();

  if (examenesRegistrados.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No hay exámenes programados.';
    contenedor.appendChild(mensaje);
    return;
  }

  const tabla = document.createElement('table');

  const encabezado = document.createElement('tr');

  ['Oportunidad', 'Fecha', 'Sala'].forEach(texto => {
    const th = document.createElement('th');
    th.textContent = texto;
    encabezado.appendChild(th);
  });

  tabla.appendChild(encabezado);

  examenesRegistrados.forEach(examen => {
    const fila = document.createElement('tr');

    const valores = [
      examen.numero_intento === 1 ? 'Primera' : 'Segunda',
      examen.fecha,
      examen.sala
    ];

    valores.forEach(valor => {
      const celda = document.createElement('td');
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    tabla.appendChild(fila);
  });

  contenedor.appendChild(tabla);
}

// CA4: precargar fecha y sala si el intento ya existe.
function cargarDatosIntento() {
  const intento = Number(selectorIntento.value);

  const examen = examenesRegistrados.find(
    item => item.numero_intento === intento
  );

  document.getElementById('fechaDefensa').value =
    examen ? examen.fecha : '';

  document.getElementById('salaDefensa').value =
    examen ? examen.sala : '';
}

formBuscar.addEventListener('submit', async evento => {
  evento.preventDefault();

  const id = Number(document.getElementById('trabajoId').value);

  if (!Number.isInteger(id) || id <= 0) {
    limpiarMensajes();
    mensajeError.textContent = 'Ingrese un identificador válido.';
    return;
  }

  await consultarTrabajo(id);
});

selectorIntento.addEventListener('change', () => {
  cargarDatosIntento();
  limpiarMensajes();
});

// HU-09 CA2 y CA4: registrar o actualizar un intento.
formExamen.addEventListener('submit', async evento => {
  evento.preventDefault();
  limpiarMensajes();

  if (trabajoSeleccionado === null) {
    mensajeError.textContent = 'Primero debe consultar un trabajo.';
    return;
  }

  const intento = Number(selectorIntento.value);

  const datos = {
    numero_intento: intento,
    fecha: document.getElementById('fechaDefensa').value,
    sala: document.getElementById('salaDefensa').value.trim()
  };

  const boton = formExamen.querySelector('button[type="submit"]');
  boton.disabled = true;

  try {
    await solicitarJSON(
      `${API}/api/trabajos/${trabajoSeleccionado}/examen`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      }
    );

    const actualizados = await solicitarJSON(
      `${API}/api/trabajos/${trabajoSeleccionado}/examen`
    );

    examenesRegistrados = actualizados.examenes || [];

    mostrarExamenes();
    cargarDatosIntento();

    mensajeExito.textContent =
      `Antecedentes del intento ${intento} guardados correctamente.`;

  } catch (error) {
    mensajeError.textContent = error.message;

  } finally {
    boton.disabled = false;
  }
});
