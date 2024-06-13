module.exports = {
    seleccionarSkills: (seleccionadas = [], opciones) => {
        const skills = ['HTML5', 'CSS3', 'JS', 'NodeJS', 'Angular', 'ReactJS', 'Vue', 'Python', 'PHP', 'Laravel 11', 'TypeScript', 'Redux', 'SQL', 'Django', 'MVC']

        let html = ''
        skills.forEach(skill => {
            html += `
                <li ${seleccionadas.includes(skill) ? ' class="activo"' : ''}>${skill}</li>
            `
        })
        return opciones.fn().html = html
    },

    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$&selected="selected"'
        )
    }
}