// Rutas.
// Conectan cada URL con su funcion del controlador.
// Aqui no hay logica, solo el "quien atiende que".

const express = require('express');

const router = express.Router();

const tareasController = require('../controllers/tareasController');

// El formulario de index.html manda aqui la tarea nueva
router.post('/tarea', tareasController.registrarTarea);

// El script.js pide aqui la lista para pintar la tabla
router.get('/tareas', tareasController.listarTareas);

// El selector de estado de cada fila manda aqui el cambio
router.post('/tarea/actualizar', tareasController.actualizarEstado);

module.exports = router;
