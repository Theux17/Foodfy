const Recipe = require('../models/Recipe')
const User = require('../models/User')

function checksFieldsAreEmpty(body, res) {
    const keys = Object.keys(body)

    for (key of keys) {


        if (body[key] == "" && key != "removed_files" && key != "information" )
            return res.send("Por favor, preencha todos os campos!")

    }
}

async function checksIfTheRecipeFieldsAreEmpty(req, res, next) {
    const fillAllFields = checksFieldsAreEmpty(req.body, res)
    if (fillAllFields) return fillAllFields

    if(req.body.chef == undefined) return res.send("Por favor, selecione um chef!")

    if (req.files.length == 0 && !req.files.fieldname) return res.send("Por favor, coloque uma imagem!")

    next()
}

async function recipeDoesNotExist(req, res, next) {
    let recipe = await Recipe.findOne({ where: { id: req.params.id } })

    if (!recipe) return res.render("admin/recipes/recipe-not-found")

    next()
}

async function checksIfRecipesIsUser(req, res, next) {
    let recipe = await Recipe.findOne({ where: { id: req.params.id } })

    if (recipe.user_id != req.session.userId && req.session.is_admin != true) return res.redirect("/admin/recipes")

    req.recipe = recipe

    return next()
}

async function userRecipes(req, res, next) {
    const userId = req.session.userId

    let { page, limit } = req.query

    page = page || 1
    limit = limit || 4
    let offset = limit * (page - 1)

    const params = {
        page,
        limit,
        offset,
    }

    if (req.session.is_admin != true) {

        const userRecipes = await User.userRecipes(userId, params)

        if (userRecipes.rows.length == 0) return res.render('admin/recipes/index', {
            error: "Nenhuma receita cadastrada por aqui!"
        })

        const results = await User.totalRecipes(req.session.userId)
        const totalRecipes = results.rows[0].total

        const pagination = {
            total: Math.ceil(totalRecipes / limit),
            page
        }

        req.totalRecipes = totalRecipes
        req.recipes = userRecipes.rows
        req.pagination = pagination

        return next()

    }

    const results = await Recipe.paginate(params)
    const recipes = results.rows

    if (req.session.is_admin == true && recipes.length != 0) {

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        req.recipes = recipes
        req.pagination = pagination

        return next()
    }

    if (recipes.length == 0) {

        if (recipes.length == 0) return res.render('admin/recipes/index', {
            error: "Nenhuma receita cadastrada por aqui!"
        })

        const pagination = {
            total: Math.ceil(0 / limit),
            page
        }

        req.recipes = recipes
        req.pagination = pagination

        return next()
    }

}

async function checkIfFilesAreRemovedAndUpdate(req, res, next) {
    try {
        const fillAllFields = checksFieldsAreEmpty(req.body, res)
        if (fillAllFields) return fillAllFields

        const removedFiles = req.body.removed_files.split(",")
        const oldFiles = await Recipe.files('recipe_files', 'recipe_id', req.body.id)
        let files = oldFiles.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        const checkThatThereIsNoImage = removedFiles.length > files.length && req.files.length == 0
        if (checkThatThereIsNoImage) return res.send("Por favor, coloque uma imagem!")

        if (req.files.length != 0 || removedFiles.length != 0 && files.length != 0) {

            // verifica se não existem 5 imagens no total
            const totalFiles = files.length + req.files.length

            if (totalFiles <= 5) {
                return next()
            }
        }


        next()

    } catch (error) {
        console.error(error)
    }

}

module.exports = {
    checksIfTheRecipeFieldsAreEmpty,
    checkIfFilesAreRemovedAndUpdate,
    recipeDoesNotExist,
    userRecipes,
    checksIfRecipesIsUser
}