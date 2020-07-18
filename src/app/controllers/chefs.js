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

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please fill in all fields! ")
        }

        if (req.files == 0) return res.send("Please, send at least one image")

        const { filename, path } = req.files[0]

        const file = await File.create({ filename, path })
        const fileId = file.rows[0].id

        const { id, name } = req.body

        let result = await Chef.create({ name, fileId, id })
        const chefId = result.rows[0].id

        return res.redirect(`/chefs/details/${chefId}`)

    },

    async show(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        if (!chef) return res.send("Chef is not found!")

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

        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        if (!chef) return res.send("Chef is not found!")

        results = await Chef.files(chef.id)

        let chefsData = results.rows

        chefsData = chefsData.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/edit", { chef, chefsData })
    },


    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") return res.send("Please fill in all fields! ")
        }

        let result = await Chef.files(req.body.id)
        const avatarId = result.rows[0].id

        if (req.files[0]) {
            const { filename, path } = req.files[0]
            await File.update({ filename, path, id: avatarId })
        }

        await Chef.update({ ...req.body, fileId: avatarId })

        return res.redirect(`/chefs/details/${req.body.id}`)
    },

    async delete(req, res) {
        let result = await Chef.files(req.body.id)
        const fileId = result.rows[0].id

        await Chef.delete(req.body.id)

        await File.delete(fileId)


        return res.redirect("/chefs")

    }
}