const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

module.exports = {
    async home(req, res) {

        try {
            let results = await Recipe.all()
            const recipes = results.rows

            let lastRecipes = []

            for (recipe of recipes) {
                if (lastRecipes.length < 6) {
                    lastRecipes.push(recipe)
                }
            }

            const filesPromise = recipes.map(recipe => Recipe.files('recipe_files', 'recipe_id', recipe.id))
            results = await Promise.all(filesPromise)

            let recipesImage = results.map(result => result.rows[0])
            recipesImage = recipesImage.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

            }))

            return res.render("home-pages/home", { recipes: lastRecipes, recipesImage })

        } catch (error) {
            console.error(error)
        }
    },

    about(req, res) {
        const about = {
            foodfyTitle: "Sobre o Foodfy",
            foodfyParagraph1: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
            foodfyParagraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod.",
            subtitle1: "Como tudo começou…",
            subtitleParagraph1: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
            subtitleParagraph2: " Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod.",
            subtitle2: "Nossas receitas",
            subheadingParagraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod."
        }

        return res.render("home-pages/about", { about })
    },

    async recipesAll(req, res) {
        try {

            let results = await Recipe.all()
            const recipes = results.rows

            const filesPromise = recipes.map(recipe => Recipe.files('recipe_files', 'recipe_id', recipe.id))
            results = await Promise.all(filesPromise)

            let recipesImage = results.map(result => result.rows[0])
            recipesImage = recipesImage.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

            }))

            return res.render("home-pages/recipes", { recipes, recipesImage })

        } catch (error) {
            console.error(error)
        }
    },

    async recipes(req, res) {
        try {
            const { recipe } = req

            let result = await Recipe.files('recipe_files', 'recipe_id', recipe.id)

            let recipeImages = result.rows
            recipeImages = recipeImages.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("home-pages/information", { recipe, recipeImages })

        } catch (error) {
            console.error(error)
        }

    },

    async chefs(req, res) {
        try {
            let results = await Chef.all()
            const chefs = results.rows

            const chefsPromise = chefs.map(chef => Chef.files('chefs', 'id', chef.id))
            results = await Promise.all(chefsPromise)

            let chefsAvatar = results.map(result => result.rows[0])

            chefsAvatar = chefsAvatar.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("home-pages/chefs", { chefs, chefsAvatar })
        } catch (error) {
            console.error(error)
        }
    }
}