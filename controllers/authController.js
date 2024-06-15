const passport = require('passport')

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

exports.mostrarPanel = (req, res) => {
    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y Administra tus vacantes desde aquí'
    })
}