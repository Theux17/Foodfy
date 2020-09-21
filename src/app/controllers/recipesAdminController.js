const { unlinkSync } = require('fs')

const Recipe = require("../models/Recipe")
const File = require('../models/File')
const LoadImages = require('../services/LoadImages')

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

            const recipesImage = await LoadImages.getAllImages(Recipe, 'recipe_files', 'recipe_id', recipes)

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

            return res.redirect(`/admin/recipes/${recipeId}`)

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

            const recipeImage = await LoadImages.getSomeImages(Recipe, 'recipe_files', 'recipe_id', recipe.id)

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

            const files = await LoadImages.getSomeImages(Recipe, 'recipe_files', 'recipe_id', recipe.id) 

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

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                // remove o id da foto da tabela recipe_files/files
                let removedFilesPromise = removedFiles.map(id => Recipe.deleteDataToRecipeFiles(id))
                removedFilesPromise = removedFiles.map(id => File.delete(id))
    
                await Promise.all(removedFilesPromise)
            }  
            
            await Recipe.update(req.body.id, {
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information,
            })

            const recipe = await Recipe.findOne({ where: { id: req.params.id} })

            return res.redirect(`/admin/recipes/${recipe.id}`)

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

            return res.redirect('/admin/recipes')

        } catch (error) {

        }

    }
}