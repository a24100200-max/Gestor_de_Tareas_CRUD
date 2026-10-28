// Llena la tabla con las tareas que tiene el servidor.
// El servidor las saca recorriendo la lista enlazada.

// Los tres estados validos, los mismos que acepta el servidor
const ESTADOS = ['Pendiente', 'En proceso', 'Terminada'];

async function cargarTareas() {

    // Le pedimos las tareas al servidor (ruta GET /tareas)
    const respuesta = await fetch('/tareas');
    const tareas    = await respuesta.json();

    const cuerpo = document.getElementById('cuerpoTabla');
    cuerpo.innerHTML = '';

    // Si no hay nada, lo decimos y salimos
    if (tareas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="5">Todavia no hay actividades registradas.</td></tr>';
        document.getElementById('total').textContent = '';
        return;
    }

    // Una fila por tarea
    for (const tarea of tareas) {

        // Armamos el selector de estado dejando marcado el actual
        const opciones = ESTADOS.map(estado => {
            const marcado = (estado === tarea.estado) ? ' selected' : '';
            return `<option value="${estado}"${marcado}>${estado}</option>`;
        }).join('');

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${tarea.id}</td>
            <td>${tarea.nombre}</td>
            <td>${tarea.descripcion}</td>
            <td>${tarea.estado}</td>
            <td>
                <form action="/tarea/actualizar" method="POST">
                    <input type="hidden" name="id" value="${tarea.id}">
                    <select name="estado">${opciones}</select>
                    <button type="submit">Guardar</button>
                </form>
            </td>
        `;
        cuerpo.appendChild(fila);
    }

    document.getElementById('total').textContent = `Total: ${tareas.length} actividades`;
}

// Se ejecuta al abrir la pagina
cargarTareas();
