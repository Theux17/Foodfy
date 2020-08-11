const Recipe = require('../models/Recipe')
const File = require('../models/File')

function checksIfTheRecipeFieldsAreEmpty(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Please fill in all fields! ")
        }
    }

    if (req.files.length == 0) return res.send("Please, send at least one image")

    next()
}

async function checkIfFilesAreRemovedAndUpdate(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            return res.send("Please fill in all fields! ")
        }
    }

    const removedFiles = req.body.removed_files.split(",")
    if (req.body.removed_files) {
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        // remove o id da foto da tabela recipe_files/files
        let removedFilesPromise = removedFiles.map(id => Recipe.deleteDataToRecipeFiles(id))
        removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
    }

    const oldFiles = await Recipe.files(req.body.id)

    const checkThatThereIsNoImage = removedFiles.length <= 5 && req.files.length == 0 && oldFiles.rows.length == 0
    if (checkThatThereIsNoImage) return res.send("Please, send at least one image")

    if (req.files.length || removedFiles.length && oldFiles.rows.length != 0) {

        // verifica se não existem 5 imagens no total
        const totalFiles = oldFiles.rows.length + req.files.length

        if (totalFiles <= 5) {
            const filesPromise = req.files.map(file => File.create({ ...file, recipeId: req.body.id }))
            const files = await Promise.all(filesPromise)

            // Pega o id dos files
            const filesId = files.map(file => Recipe.sendDataToRecipeFiles({ recipeId: req.body.id, fileId: file.rows[0].id }))
            await Promise.all(filesId)
        }
    }

    next()

}

module.exports = {
    checksIfTheRecipeFieldsAreEmpty,
    checkIfFilesAreRemovedAndUpdate
}