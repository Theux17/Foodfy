const { unlinkSync } = require('fs')

const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        const chefsPromise = chefs.map(chef => Chef.files('chefs', 'id', chef.id))
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
        try {

            const { filename, path } = req.files[0]

            const fileId = await File.create({ name: filename, path })

            let { name, file_id } = req.body

            file_id = fileId

            const chefId = await Chef.create({ name, file_id })

            return res.render("admin/chefs/create", {
                chef: req.body,
                chefId,
                succes: "Chef cadastrado com sucesso!"
            })

        } catch (err) {
            console.error(err)
        }
    },

    async show(req, res) {
        try {
            const { chef } = req

            let results = await Chef.files('chefs','id', chef.id)
            let chefAvatar = results.rows

            chefAvatar = chefAvatar.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            const recipes = await Recipe.findAll({ where: { chef_id: chef.id } })

            const filesPromise = recipes.map(recipe => Recipe.files('recipe_files', 'recipe_id', recipe.id))
            results = await Promise.all(filesPromise)

            // Pega os dados do arquvivo da receita e transforma em um array
            let recipeImage = results.map(result => result.rows[0])

            recipeImage = recipeImage.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/chefs/details", { chef, recipes, chefAvatar, recipeImage })
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {

        try {
            const { chef } = req

            results = await Chef.files('chefs', 'id', chef.id)

            let chefsData = results.rows
            chefsData = chefsData.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

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
            
            let chef = await Chef.findOne({where: { id } })
            
            results = await Chef.files('chefs', 'id', chef.id)

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

        return res.render('admin/chefs/edit', {
            succes: "Chef deletado com sucesso!"
        })

    }
}