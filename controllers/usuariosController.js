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

    try {
        await usuario.save()
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error)
        res.redirect('/crear-cuenta')
    }


}

exports.formIniciarSesion = async (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs'
    })
}

// Form editar perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        cerrarSesion: true,
        nombre: req.user.nombre,
        usuario: req.user
    })
}

// Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {

    const usuario = await Usuarios.findById(req.user._id)

    usuario.nombre = req.body.nombre
    usuario.email = req.body.email
    if (req.body.password) {
        usuario.password = req.body.password
    }
    await usuario.save()

    req.flash('correcto', 'Cambios Guardados Correctamente')

    //redirect
    res.redirect('/administracion')
}

// Sanitazar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    // Sanitizar
    req.sanitizeBody('nombre').escape()
    req.sanitizeBody('email').escape()
    if (req.body.password) {
        req.sanitizeBody('password').escape()
    }
    //Validar
    req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty()
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty()

    const errores = req.validationErrors()

    if (errores) {
        req.flash('error', errores.map(error => error.msg))
        return res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en devJobs',
            cerrarSesion: true,
            nombre: req.user.nombre,
            usuario: req.user,
            mensajes: req.flash()
        })
    }
    next()
}