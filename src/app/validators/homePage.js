const Recipe = require('../models/Recipe')

async function checkIfThereIsNoRecipe(req, res, next) {
    let result = await Recipe.find(req.params.id)

    const recipe = result.rows[0]
    if (!recipe) return res.render('admin/recipes/recipe-not-found')

    req.recipe = recipe
    next()
}

module.exports = { checkIfThereIsNoRecipe }