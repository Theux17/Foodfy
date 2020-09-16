const Recipe = require('../models/Recipe')

async function checkIfThereIsNoRecipe(req, res, next) {
    let recipe = await Recipe.findOne({where: {id: req.params.id}})

    if (!recipe) return res.render('admin/recipes/recipe-not-found')

    req.recipe = recipe
    next()
}

module.exports = { checkIfThereIsNoRecipe }