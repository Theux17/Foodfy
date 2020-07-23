const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")


module.exports = {
    async home(req, res) {

        let results = await Recipe.all()
        const recipes = results.rows

        let lastRecipes = []

        for(recipe of recipes ){
            if(lastRecipes.length < 6){
                lastRecipes.push(recipe)
            }
        }    
        
        const filesPromise = recipes.map(recipe => Recipe.files(recipe.id))
        results = await Promise.all(filesPromise)

        let recipesImage = results.map(result => result.rows[0])
        recipesImage = recipesImage.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

        }))

        return res.render("recipes/home", { recipes: lastRecipes, recipesImage })
    },

    async filter(req, res) {
        let { filter } = req.query

        if (filter) {
            let results = await Recipe.findBy(filter)
            const recipes = results.rows

            const filesPromise = recipes.map(recipe => Recipe.files(recipe.id))
            results = await Promise.all(filesPromise)

            let recipesImage = results.map(result => result.rows[0])
            recipesImage = recipesImage.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

            }))

            return res.render("recipes/filter", { filter, recipes, recipesImage })

        } else {

            return res.redirect("/")
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

        return res.render("recipes/about", { about })
    },

    async recipesAll(req, res) {

        let results = await Recipe.all()
        const recipes = results.rows

        const filesPromise = recipes.map(recipe => Recipe.files(recipe.id))
        results = await Promise.all(filesPromise)

        let recipesImage = results.map(result => result.rows[0])
        recipesImage = recipesImage.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

        }))

        return res.render("recipes/recipes", { recipes, recipesImage })
    },

    async recipes(req, res) {

        let result = await Recipe.find(req.params.id)
        
        const recipe = result.rows[0]
        if (!recipe) return res.send("Recipe is not found!")

        result = await Recipe.files(recipe.id)
        
        let recipeImages = result.rows
        recipeImages = recipeImages.map(file => ({
            ...file, 
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        

        return res.render("recipes/information", { recipe, recipeImages })

    },

    async chefs(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        const chefsPromise = chefs.map(chef => Chef.files(chef.id))
        results = await Promise.all(chefsPromise)

        let chefsAvatar = results.map(result => result.rows[0])
        
        chefsAvatar = chefsAvatar.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`            
        }))

        return res.render("recipes/chefs", { chefs, chefsAvatar })
    }
}