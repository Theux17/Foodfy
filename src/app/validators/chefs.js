const Chef = require('../models/Chef')
const File = require('../models/File')

function checksIfTheChefsFieldsAreEmpty(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "")
        return res.send("Please fill in all fields! ")
    }

    if (req.files == 0) return res.send("Please, send at least one image")

    next()
}

async function checksIfTheChefExists( req, res, next){
    let results = await Chef.find(req.params.id)
    const chef = results.rows[0]
    if (!chef) return res.send("Chef is not found!")

    req.chef = chef
    next()
}

async function checkForNewFilesAndUpdateFiles(req, res, next){
    let result = await Chef.files(req.body.id)
    const avatarId = result.rows[0].id

    if (req.files[0]) {
        const { filename, path } = req.files[0]
        await File.update({ filename, path, id: avatarId })
    }

    req.files.id = avatarId

    next()
}

module.exports = {
    checksIfTheChefsFieldsAreEmpty,
    checksIfTheChefExists,
    checkForNewFilesAndUpdateFiles
}