const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

const LoadImages = require('../services/LoadImages')

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

            const recipesImage = await LoadImages.getAllImages(Recipe ,'recipe_files', 'recipe_id', recipes)

            return res.render("home-pages/home", { recipes: lastRecipes, recipesImage })

        } catch (error) {
            return res.render("not-found", { error: "Erro ao listar as receitas de destaque!" })
        }
    },

    about(req, res) {
        return res.render("home-pages/about")
    },

    async recipesAll(req, res) {
        try {

            let results = await Recipe.aldasl()
            const recipes = results.rows

            const recipesImage = await LoadImages.getAllImages(Recipe ,'recipe_files', 'recipe_id', recipes)

            return res.render("home-pages/recipes", { recipes, recipesImage })

        } catch (error) {
            return res.render("not-found", { error: "Erro ao listar todas as receitas!" })
        }
    },

    async recipes(req, res) {
        try {
            const { recipe } = req

            const recipeImages = await LoadImages.getSomeImages(Recipe ,'recipe_files', 'recipe_id', recipe.id)

            return res.render("home-pages/information", { recipe, recipeImages })

        } catch (error) {
            return res.render("not-found", { error: "Erro ao listar todas as receitas!" })
        }

    },

    async chefs(req, res) {
        try {
            let results = await Chef.all()
            const chefs = results.rows

            const chefsAvatar = await LoadImages.getAllImages(Chef, 'chefs', 'id', chefs)
           
            return res.render("home-pages/chefs", { chefs, chefsAvatar })
        } catch (error) {
            return res.render("not-found", { error: "Erro ao listar os chefs!" })
        }
    }
}