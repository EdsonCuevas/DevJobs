const passport = require('passport')
const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante')
const Usuarios = mongoose.model('Usuarios')
const crypto = require('crypto')
const enviarEmail = require('../handlers/email')

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

//Formulario para restablecer password
exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer-password', {
        nombrePagina: 'Restablece tu Contraseña',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu contraseña, coloca tu email'
    })
}

// Genera el token la tabla del usuario
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ email: req.body.email })

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
        return res.redirect('/restablecer-password')
    }

    // el usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expira = Date.now() + 3600000

    // Guarda el usuario
    await usuario.save()
    const resetUrl = `http://${req.headers.host}/restablecer-password/${usuario.token}`

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })

    // Todo en orden
    req.flash('correcto', 'Revisa tu email para confirmar')
    res.redirect('/iniciar-sesion')
}

// Valida si el token es valido y el usuario existe, muestra la vista
exports.restablecerPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    })

    if (!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo')
        return res.redirect('/restablecer-password')
    }

    // pasa la validacion correctamente, ahora muestra el formulario de reseteo
    res.render('nuevo-password', {
        nombrePagina: 'Nueva Contraseña'
    })
}

// Almacena el nuevo password en la bd
exports.guardarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    })

    // no existe el usuario o el tolen ya es invalido
    if (!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo')
        return res.redirect('/restablecer-password')
    }

    // guardar en la base de datos y limpiar
    usuario.password = req.body.password
    usuario.token = undefined
    usuario.expira = undefined
    await usuario.save()

    // redirigir
    req.flash('correcto', 'Contraseña modificada correctamente')
    res.redirect('/iniciar-sesion')
}