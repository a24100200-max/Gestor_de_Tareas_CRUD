// Lista enlazada de tareas.
// Es la copia de trabajo: vive en la memoria del servidor.
// La copia permanente esta en data/tareas.txt (ver archivo.js).

const Nodo = require('./Nodo');

// Estados validos.
// Es una lista CERRADA a proposito: el usuario escoge de estas tres
// y no puede escribir lo que quiera. Asi el estado siempre significa
// lo mismo y se puede identificar en que parte del proceso va la tarea:
//   Pendiente  -> todavia no se empieza
//   En proceso -> alguien ya esta trabajando en ella
//   Terminada  -> ya se acabo
const ESTADOS_VALIDOS = ['Pendiente', 'En proceso', 'Terminada'];

class ListaTareas {

    constructor() {
        // La cabeza es el primer nodo de la lista.
        // Si vale null, la lista esta vacia.
        this.cabeza = null;

        // Guardamos el ultimo id usado para no repetirlos.
        this.ultimoId = 0;
    }

    // Agregar: engancha un nodo nuevo al FINAL de la lista.
    // El parametro idExistente solo se usa al cargar el archivo,
    // para respetar los ids que ya estaban guardados.
    agregar(nombre, descripcion, estado, idExistente = null) {

        const id = idExistente !== null ? idExistente : this.ultimoId + 1;

        // Si el id que llega del archivo es mas grande que el contador,
        // adelantamos el contador para que el siguiente no se repita.
        if (id > this.ultimoId) {
            this.ultimoId = id;
        }

        const nuevo = new Nodo(id, nombre, descripcion, estado);

        // Caso 1: la lista esta vacia, el nuevo nodo es la cabeza
        if (this.cabeza === null) {
            this.cabeza = nuevo;
            return nuevo;
        }

        // Caso 2: hay nodos, recorremos hasta el ultimo.
        // Sabemos que llegamos al final cuando siguiente vale null.
        let actual = this.cabeza;
        while (actual.siguiente !== null) {
            actual = actual.siguiente;
        }

        // Y ahi enganchamos el nuevo nodo
        actual.siguiente = nuevo;

        return nuevo;
    }

    // Buscar por id: recorre la cadena hasta encontrarlo
    buscarPorId(id) {
        let actual = this.cabeza;

        while (actual !== null) {
            if (actual.id === id) {
                return actual;               // lo encontramos
            }
            actual = actual.siguiente;       // pasamos al siguiente eslabon
        }

        return null;                         // se acabo la lista y no estaba
    }

    // Actualizar estado: es lo unico que se puede modificar
    actualizarEstado(id, estadoNuevo) {
        const nodo = this.buscarPorId(id);

        if (nodo === null) {
            return false;                    // no existe esa tarea
        }

        nodo.estado = estadoNuevo;
        return true;
    }

    // Recorrer: convierte la lista en un arreglo normal.
    // Se usa para mandar las tareas al navegador y para escribir
    // el archivo. Nota que NO devolvemos los nodos completos:
    // el campo "siguiente" no le sirve a nadie fuera de aqui.
    recorrer() {
        const tareas = [];
        let actual = this.cabeza;

        while (actual !== null) {
            tareas.push({
                id:          actual.id,
                nombre:      actual.nombre,
                descripcion: actual.descripcion,
                estado:      actual.estado
            });
            actual = actual.siguiente;
        }

        return tareas;
    }

    // Contar: cuantas tareas hay
    contar() {
        let total  = 0;
        let actual = this.cabeza;

        while (actual !== null) {
            total++;
            actual = actual.siguiente;
        }

        return total;
    }
}

module.exports = { ListaTareas, ESTADOS_VALIDOS };
