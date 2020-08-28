const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        const chefsPromise = chefs.map(chef => Chef.files(chef.id))
        results = await Promise.all(chefsPromise)

        let chefsAvatar = results.map(result => result.rows[0])

        chefsAvatar = chefsAvatar.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/index", { chefs, chefsAvatar })
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    },

    async post(req, res) {

        const { filename, path } = req.files[0]

        const file = await File.create({ filename, path })
        const fileId = file.rows[0].id

        const { id, name } = req.body

        let result = await Chef.create({ name, fileId, id })
        const chefId = result.rows[0].id

        return res.render("admin/chefs/create", { 
            chef: req.body,
            chefId,
            succes: "Chef cadastrado com sucesso!"
         })

    },

    async show(req, res) {
        const { chef } = req

        results = await Chef.files(chef.id)
        let chefAvatar = results.rows

        chefAvatar = chefAvatar.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await Chef.recipesAll(chef.id)
        const recipes = results.rows

        const filesPromise = recipes.map(recipe => Recipe.files(recipe.id))
        results = await Promise.all(filesPromise)

        // Pega os dados do arquvivo da receita e transforma em um array
        let recipeImage = results.map(result => result.rows[0])

        recipeImage = recipeImage.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/details", { chef, recipes, chefAvatar, recipeImage })
    },

    async edit(req, res) {
        
        const { chef } = req
        
        results = await Chef.files(chef.id)

        let chefsData = results.rows

        chefsData = chefsData.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/edit", { chef, chefsData })
    },


    async put(req, res) {
        const avatarId = req.files.id
        await Chef.update({ ...req.body, fileId: avatarId })
        
        let results = await Chef.find(req.body.id)
        const chef = results.rows[0]

        results = await Chef.files(chef.id)
        
        let chefsData = results.rows

        chefsData = chefsData.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('admin/chefs/edit', {
            chef: req.body,
            chefsData,
            succes: "Chef atualizado com sucesso!"
        })
    },

    async delete(req, res) {
        let result = await Chef.files(req.body.id)
        const fileId = result.rows[0].id

        await Chef.delete(req.body.id)

        await File.delete(fileId)

        return res.render('admin/chefs/edit', {
            succes: "Chef deletado com sucesso!"
        })

    }
}