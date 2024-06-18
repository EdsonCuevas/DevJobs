const passport = require('passport')
const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

// Revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
    // Revisar el usuario
    if (req.isAuthenticated()) {
        return next() // estan autenticado
    }

    // no estan autenticados
    res.redirect('/iniciar-sesion')
}

exports.mostrarPanel = async (req, res) => {

    //consultar el usuario autenticado

    const vacantes = await Vacante.find({ autor: req.user._id }).lean()

    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y Administra tus vacantes desde aquí',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout(function () {
        req.flash('correcto', 'Cerraste Sesión Correctamente')
        res.redirect('/iniciar-sesion');
    });
}