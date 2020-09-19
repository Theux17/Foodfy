const Chef = require('../models/Chef')
const File = require('../models/File')

function checksIfTheChefsFieldsAreEmpty(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") return res.send("Por favor, preencha todos os campos.")

        if (req.files == 0) return res.send("Por favor, insira uma imagem.")
    }

    next()
}

async function checksIfTheChefExists(req, res, next) {
    const { id } = req.params
    let result = await Chef.find(id)

    const chef = result.rows[0]

    if (!chef) return res.render('admin/chefs/chef-not-found')

    req.chef = chef
    next()
}

async function checkForNewFilesAndUpdateFiles(req, res, next) {
    let result = await Chef.files('chefs', 'id', req.body.id)
    const avatarId = result.rows[0].id

    if (req.files[0]) {
        const { filename, path } = req.files[0]
        await File.update(avatarId, { name: filename, path })
    }

    req.files.id = avatarId

    next()
}

module.exports = {
    checksIfTheChefsFieldsAreEmpty,
    checksIfTheChefExists,
    checkForNewFilesAndUpdateFiles
}