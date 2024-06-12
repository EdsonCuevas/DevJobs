document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos')

    if (skills) {
        skills.addEventListener('click', agregarSkills)
    }
})

const skills = new Set()

const agregarSkills = (e) => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            //Quitarlo del set y la class activo
            skills.delete(e.target.textContent)
            e.target.classList.remove('activo')
        } else {
            // agregarlo al set y la class activo
            skills.add(e.target.textContent)
            e.target.classList.add('activo')
        }
    }
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray
}