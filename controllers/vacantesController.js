const mongoose = require("mongoose")

const Vacante = mongoose.model('Vacante')

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}

// Agrega las vacantes a la bd
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body)

    // Crear arreglo de skills
    vacante.skills = req.body.skills.split()

    // Almacenarlo en la db
    const nuevaVacante = await vacante.save()

    // Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`)

}