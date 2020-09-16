const { unlinkSync } = require('fs')

const Recipe = require("../models/Recipe")
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 4

            const params = {
                page,
                limit
            }

            const recipes = req.recipes
            const pagination = req.pagination

            const filesPromise = recipes.map(recipe => Recipe.files('recipe_files', 'recipe_id', recipe.id))
            results = await Promise.all(filesPromise)

            let recipesImage = results.map(file => file.rows[0])
            recipesImage = recipesImage.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/index", { recipes, pagination, params, recipesImage })

        } catch (error) {
            console.error(error)
        }
    },

    async create(req, res) {

        try {
            let results = await Recipe.chefsSelectOptions()
            const chefsOptions = results.rows

            return res.render("admin/recipes/create", { chefsOptions })

        } catch (error) {
            console.error(error)
        }
    },

    async post(req, res) {
        try {

            let { chef, title, ingredients, preparation, information, user_id } = req.body

            user_id = req.session.userId

            const recipeId = await Recipe.create({
                chef_id: chef,
                title,
                ingredients: `{${ingredients}}`,
                preparation: `{${preparation}}`,
                information,
                user_id
            })

            const createFiles = req.files.map(file => File.create({ name: file.filename, path: file.path }))
            let filesId = await Promise.all(createFiles)

            await filesId.map(id => Recipe.sendDataToRecipeFiles({ recipeId, fileId: id }))

            results = await Recipe.files('recipe_files', 'recipe_id', recipeId)

            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/create", {
                recipe: req.body,
                files,
                recipeId,
                succes: "Receita cadastrada com sucesso"
            })

        } catch (err) {
            const chefsOptions = await Recipe.chefsSelectOptions()
            return res.render("admin/recipes/create", {
                recipe: req.body,
                chefsOptions: chefsOptions.rows,
                error: "Por favor, selecione uma imagem!"
            })
        }
    },

    async show(req, res) {
        try {
            const recipe = req.recipe

            results = await Recipe.files('recipe_files', 'recipe_id', recipe.id)

            let recipeImage = results.rows

            recipeImage = recipeImage.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/show", { recipe, recipeImage })
        } catch (error) {
            console.error(error)
        }

    },

    async edit(req, res) {
        try {
            const recipe = req.recipe
            
            let results = await Recipe.chefsSelectOptions()
            const chefsOptions = results.rows
            
            results = await Recipe.files('recipe_files', 'recipe_id', recipe.id)
            
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            
            return res.render("admin/recipes/edit", { recipe, chefsOptions, files })
            
        } catch (error) {
            console.error(error);
        }
    },

    async put(req, res) {
        try {

            const createFiles = req.files.map(file => File.create({ name: file.filename, path: file.path }))
            const filesId = await Promise.all(createFiles)

            await filesId.map(id => Recipe.sendDataToRecipeFiles({ recipeId: req.body.id, fileId: id }))


            await Recipe.update(req.body.id, {
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information,
                user_id: req.body.user_id
            })

            let results = await Recipe.chefsSelectOptions()
            const chefsOptions = results.rows

            results = await Recipe.files('recipe_files', 'recipe_id', req.params.id)

            files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/edit", {
                recipe: req.body,
                files,
                chefsOptions,
                succes: "Atualizada com sucesso"
            })

        } catch (error) {
            console.error(error);

        }
    },

    async delete(req, res) {

        try {
            const files = await Recipe.files('recipe_files', 'recipe_id', req.body.id)

            for (file of files.rows) {
                await Recipe.deleteAllOfRecipeFiles(req.body.id)
                await File.delete(file.id)
                await Recipe.delete(req.body.id)

                unlinkSync(file.path)

            }

            return res.render("admin/recipes/edit", {
                succes: "Deletado com sucesso!"
            })

        } catch (error) {

        }

    }
}