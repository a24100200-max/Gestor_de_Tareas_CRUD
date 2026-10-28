// Servidor principal.
// Gestor de actividades, trabajo final del 2do parcial.

const express = require('express');
const path    = require('path');

const tareasRoutes = require('./routes/tareasRoutes');

const app = express();

// Para poder leer los datos que mandan los formularios (POST)
app.use(express.urlencoded({ extended: true }));

// Publicamos la carpeta Frontend como archivos estaticos.
// Frontend esta un nivel arriba de Backend, de ahi el '..'
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Nuestras rutas
app.use(tareasRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
