const { unlinkSync } = require('fs')

const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")
const LoadImages = require("../services/LoadImages")

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        const chefsAvatar = await LoadImages.getAllImages(Recipe, 'chefs', 'id', chefs)

        return res.render("admin/chefs/index", { chefs, chefsAvatar })
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    },

    async post(req, res) {
        try {

            const { filename, path } = req.files[0]

            const fileId = await File.create({ name: filename, path })

            let { name, file_id } = req.body

            file_id = fileId

            const chefId = await Chef.create({ name, file_id })

            return res.redirect(`/admin/chefs/details/${chefId}`)

        } catch (err) {
            console.error(err)
        }
    },

    async show(req, res) {
        try {
            const { chef } = req

            const chefAvatar = await LoadImages.getSomeImages(Chef, 'chefs', 'id', chef.id)

            const recipes = await Recipe.findAll({ where: { chef_id: chef.id } })

            const recipeImage = await LoadImages.getAllImages(Recipe, 'recipe_files', 'recipe_id', recipes)

            return res.render("admin/chefs/details", { chef, recipes, chefAvatar, recipeImage })
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {

        try {
            const { chef } = req

            const chefsData = await LoadImages.getSomeImages(Chef, 'chefs', 'id', chef.id)

            return res.render("admin/chefs/edit", { chef, chefsData })
        } catch (error) {
            console.error(error)
        }

    },

    async put(req, res) {
        try {
            const avatarId = req.files.id

            const { name, id } = req.body
            await Chef.update(id, { name, file_id: avatarId })

            let chef = await Chef.findOne({ where: { id } })

            return res.redirect(`/admin/chefs/details/${chef.id}`)

        } catch (error) {
            console.error(error)
        }
    },

    async delete(req, res) {
        const files = await Chef.files('chefs', 'id', req.body.id)
        await Chef.delete(req.body.id)

        files.rows.map(file => {
            try {
                unlinkSync(file.path)
            } catch (error) {
                console.error(error)
            }
        })

        return res.redirect('/admin/chefs')
    }
}