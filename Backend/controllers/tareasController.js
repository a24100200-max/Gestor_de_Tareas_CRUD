// Controlador.
// Recibe lo que manda el navegador, lo valida, usa el modelo
// y decide que responder. Aqui NO se toca el archivo directamente
// ni se recorren nodos: de eso se encargan ListaTareas.js y archivo.js.

const { ListaTareas, ESTADOS_VALIDOS } = require('../models/ListaTareas');
const archivo = require('../models/archivo');

// La lista vive aqui, en memoria, mientras el servidor este encendido.
const lista = new ListaTareas();

// Al arrancar, llenamos la lista con lo que haya en el .txt
const cargadas = archivo.cargarEnLista(lista);
console.log(`Tareas cargadas desde el archivo: ${cargadas}`);

// Registrar una tarea nueva
function registrarTarea(req, res) {
    try {
        // 1) Leemos lo que llego del formulario y le quitamos
        //    los caracteres que romperian el archivo
        const nombre      = archivo.limpiarTexto(req.body.nombre      || '');
        const descripcion = archivo.limpiarTexto(req.body.descripcion || '');
        const estado      = String(req.body.estado || '').trim();

        // 2) Validamos del lado del servidor.
        //    No confiamos en el "required" del HTML porque cualquiera
        //    puede mandar datos sin pasar por el formulario.
        const errores = [];
        if (!nombre)      errores.push('El nombre de la actividad es obligatorio');
        if (!descripcion) errores.push('La descripcion es obligatoria');
        if (!ESTADOS_VALIDOS.includes(estado)) {
            errores.push('El estado debe ser: ' + ESTADOS_VALIDOS.join(', '));
        }

        if (errores.length > 0) {
            return res.status(400).send('Datos invalidos: ' + errores.join(', '));
        }

        // 3) Lo agregamos a la lista enlazada (queda al final)
        const nodo = lista.agregar(nombre, descripcion, estado);

        // 4) Y reescribimos el archivo para que no se pierda
        archivo.guardarDesdeLista(lista);

        console.log(`Tarea registrada: #${nodo.id} ${nodo.nombre}`);

        // 5) Regresamos al usuario a la pagina
        res.redirect('/index.html');

    } catch (error) {
        console.error('Error al registrar la tarea:', error);
        res.status(500).send('Error al registrar la tarea');
    }
}

// Consultar todas las tareas.
// Responde en JSON; el script.js del Frontend lo usa para pintar la tabla.
function listarTareas(req, res) {
    try {
        // recorrer() es el que pasa por cada nodo de la cadena
        res.json(lista.recorrer());
    } catch (error) {
        console.error('Error al consultar las tareas:', error);
        res.status(500).json({ error: 'Error al consultar las tareas' });
    }
}

// Actualizar el estado de una tarea
function actualizarEstado(req, res) {
    try {
        const id     = Number(req.body.id);
        const estado = String(req.body.estado || '').trim();

        const errores = [];
        if (!Number.isInteger(id) || id < 1) errores.push('El id no es valido');
        if (!ESTADOS_VALIDOS.includes(estado)) {
            errores.push('El estado debe ser: ' + ESTADOS_VALIDOS.join(', '));
        }

        if (errores.length > 0) {
            return res.status(400).send('Datos invalidos: ' + errores.join(', '));
        }

        // Busca el nodo recorriendo la lista y le cambia el estado
        const seActualizo = lista.actualizarEstado(id, estado);

        if (!seActualizo) {
            return res.status(404).send('No existe una tarea con el id ' + id);
        }

        // Igual que al registrar: primero la lista, luego el archivo
        archivo.guardarDesdeLista(lista);

        console.log(`Tarea #${id} actualizada a: ${estado}`);

        res.redirect('/index.html');

    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).send('Error al actualizar la tarea');
    }
}

module.exports = { registrarTarea, listarTareas, actualizarEstado };
