const mongoose = require('mongoose')
const Usuarios = mongoose.model('Usuarios')

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {
    // Sanitizar
    req.sanitizeBody('nombre').escape()
    req.sanitizeBody('email').escape()
    req.sanitizeBody('password').escape()
    req.sanitizeBody('confirmar').escape()

    // Validar
    req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty()
    req.checkBody('email', 'El Email debe ser valido').isEmail()
    req.checkBody('password', 'La contraseña no puede ir vacio').notEmpty()
    req.checkBody('confirmar', 'Confirmar contraseña no puede ir vacio').notEmpty()
    req.checkBody('confirmar', 'Las contraseña deben ser iguales').equals(req.body.password)

    const errores = req.validationErrors()

    if (errores) {
        // Si hay errores
        req.flash('error', errores.map(error => error.msg))

        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        })
        return
    }
    // Si no hay errores pasar al siguiente middleware
    next()
}

exports.crearUsuario = async (req, res) => {
    // Crear usuario
    const usuario = new Usuarios(req.body)

    const nuevoUsuario = await usuario.save()

    if (!nuevoUsuario) return next()

    res.redirect('/iniciar-sesion')
}