/**
 * Normaliza los errores producidos por mongoose. Devuelve un array de { title, message}
 * @param {*} errors 
 */
function normalizeErrors(errors) {
    let normalizeErrors = []
    for (let property in errors) {
        if (errors.hasOwnProperty(property)) {
            normalizeErrors.push({ title: property, message: errors[property].message })
        }
    }
    return normalizeErrors
}



module.exports = {
    normalizeErrors
}