const Recipe = require('../models/Recipe')

module.exports = {
    async filter(req, res) {
        try {
            let { filter } = req.query

            if (filter) {
                let results = await Recipe.findBy(filter)
                const recipes = results.rows

                const filesPromise = recipes.map(recipe => Recipe.files('recipe_files', 'recipe_id', recipe.id))
                results = await Promise.all(filesPromise)

                let recipesImage = results.map(result => result.rows[0])
                recipesImage = recipesImage.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

                }))

                return res.render("search/filter-page", { filter, recipes, recipesImage })

            } else {

                return res.redirect("/")
            }

        } catch (error) {
            console.error(error)
        }
    }

} 