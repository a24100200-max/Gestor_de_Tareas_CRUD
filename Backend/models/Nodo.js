// Un nodo es cada eslabon de la lista enlazada.
// Guarda los datos de UNA tarea y la referencia al SIGUIENTE nodo.

class Nodo {
    constructor(id, nombre, descripcion, estado) {
        // Los datos de la tarea
        this.id          = id;           // numero unico, sirve para saber cual actualizar
        this.nombre      = nombre;
        this.descripcion = descripcion;
        this.estado      = estado;

        // Lo que lo convierte en lista enlazada.
        // El nodo NO sabe en que posicion esta; solo sabe quien va despues.
        // Si es el ultimo de la lista, siguiente vale null.
        // Esta es la diferencia con un arreglo: ahi los elementos se
        // encuentran por indice, aqui hay que seguir la cadena nodo por nodo.
        this.siguiente = null;
    }
}

module.exports = Nodo;
