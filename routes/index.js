const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController.js')
const vacantesController = require('../controllers/vacantesController.js')
const usuariosController = require('../controllers/usuariosController.js')
const authController = require('../controllers/authController.js')

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos)

    // Crear Vacantes
    router.get('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante)
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.agregarVacante)

    // Mostrar Vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante)

    // Editar Vacante
    router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante)
    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.editarVacante)

    // Crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta',
        usuariosController.validarRegistro,
        usuariosController.crearUsuario)

    // Autenticar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    // Panel de administracion
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel)

    return router
}