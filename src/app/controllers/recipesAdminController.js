const Recipe = require("../models/Recipe")
const File = require('../models/File')


module.exports = {
    async index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 4
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset,
        }

        let results = await Recipe.paginate(params)
        const recipes = results.rows

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        const filesPromise = recipes.map(recipe => Recipe.files(recipe.id))
        results = await Promise.all(filesPromise)

        let recipesImage = results.map(result => result.rows[0])

        recipesImage = recipesImage.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes/index", { recipes, pagination, params, recipesImage })
    },

    async create(req, res) {

        let results = await Recipe.chefsSelectOptions()
        const chefsOptions = results.rows

        return res.render("admin/recipes/create", { chefsOptions })
    },

    async post(req, res) {
        
        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, recipeId }))
        results = await Promise.all(filesPromise)

        //pega o id dos arquivos
        const filesId = results.map(file => Recipe.sendDataToRecipeFiles({ recipeId, fileId: file.rows[0].id }))
        await Promise.all(filesId)

        return res.redirect(`/admin/recipes/${recipeId}`)
    },

    async show(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        results = await Recipe.files(recipe.id)

        let recipeImage = results.rows

        recipeImage = recipeImage.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes//show", { recipe, recipeImage })
    },

    async edit(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        // envia os chefs para a edição
        results = await Recipe.chefsSelectOptions()
        const chefsOptions = results.rows

        results = await Recipe.files(recipe.id)

        let files = results.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes/edit", { recipe, chefsOptions, files })
    },

    async put(req, res) {

        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },

    async delete(req, res) {

        const files = await Recipe.files(req.body.id)

        for (file of files.rows) {
            await Recipe.deleteAllOfRecipeFiles(req.body.id)
            await File.delete(file.id)
            await Recipe.delete(req.body.id)
        }

        return res.redirect("/admin/recipes")

    }
}