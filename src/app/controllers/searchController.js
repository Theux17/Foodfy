const Recipe = require('../models/Recipe')

const LoadImages = require('../services/LoadImages')

module.exports = {
    async filter(req, res) {
        try {
            let { filter } = req.query

            if (filter) {
                let results = await Recipe.findBy(filter)
                const recipes = results.rows
                
                const recipesImage = await LoadImages.getAllImages(Recipe, 'recipe_files', 'recipe_id', recipes)

                return res.render("search/filter-page", { filter, recipes, recipesImage })

            } else {

                return res.redirect("/")
            }

        } catch (error) {
            return res.render("not-found", { error: "Erro inesperado ao buscar a receita!" })            
        }
    }

} 