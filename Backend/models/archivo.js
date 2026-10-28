// Aqui vive todo lo que toca data/tareas.txt.
// La lista enlazada es la copia de trabajo (se pierde al apagar
// el servidor); este archivo es la copia permanente.

const fs   = require('fs');     // modulo de Node para leer y escribir archivos
const path = require('path');

const RUTA_ARCHIVO = path.join(__dirname, '..', 'data', 'tareas.txt');

// Separamos los campos con | y no con coma, porque una descripcion
// casi siempre lleva comas y nos romperia las lineas al leerlas.
const SEPARADOR = '|';

// Cargar: del archivo hacia la lista enlazada.
// Se ejecuta UNA sola vez, cuando arranca el servidor.
function cargarEnLista(lista) {

    // Si el archivo no existe todavia (primera vez que se corre),
    // lo creamos vacio y terminamos.
    if (!fs.existsSync(RUTA_ARCHIVO)) {
        fs.writeFileSync(RUTA_ARCHIVO, '', 'utf8');
        return 0;
    }

    const contenido = fs.readFileSync(RUTA_ARCHIVO, 'utf8');

    // Partimos el texto en lineas y quitamos las vacias
    const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');

    let cargadas = 0;

    for (const linea of lineas) {
        // Cada linea se ve asi:  1|Revisar inventario|Contar el material|Pendiente
        const partes = linea.split(SEPARADOR);

        // Si una linea viene incompleta la saltamos en vez de tronar
        if (partes.length !== 4) {
            continue;
        }

        const id          = Number(partes[0]);
        const nombre      = partes[1];
        const descripcion = partes[2];
        const estado      = partes[3].trim();

        // Le pasamos el id que ya traia para no reasignarlo
        lista.agregar(nombre, descripcion, estado, id);
        cargadas++;
    }

    return cargadas;
}

// Guardar: de la lista enlazada hacia el archivo.
// Se ejecuta cada vez que se registra o se actualiza una tarea.
function guardarDesdeLista(lista) {

    // Recorremos la lista y armamos una linea por cada nodo
    const lineas = lista.recorrer().map(tarea =>
        [tarea.id, tarea.nombre, tarea.descripcion, tarea.estado].join(SEPARADOR)
    );

    // Reescribimos el archivo completo.
    // Es mas sencillo que buscar y modificar una sola linea, y con
    // pocas tareas no se nota la diferencia.
    fs.writeFileSync(RUTA_ARCHIVO, lineas.join('\n') + '\n', 'utf8');
}

// Limpiar texto.
// El | y los saltos de linea romperian el formato del archivo,
// asi que los quitamos antes de guardar lo que escribio el usuario.
function limpiarTexto(texto) {
    return String(texto)
        .replace(/[\r\n]+/g, ' ')      // saltos de linea -> espacio
        .replace(/\|/g, '-')           // el separador -> guion
        .trim();
}

module.exports = { cargarEnLista, guardarDesdeLista, limpiarTexto, RUTA_ARCHIVO };
