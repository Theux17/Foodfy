const express = require('express')
const routes = express.Router()

const homePagesController = require("../app/controllers/homePagesController")
const HomePagesValidator = require('../app/validators/homePage')

routes.get("/", homePagesController.home) 
routes.get("/about", homePagesController.about) 
routes.get("/recipes", homePagesController.recipesAll)
routes.get("/recipe/:id", HomePagesValidator.checkIfThereIsNoRecipe, homePagesController.recipes)
routes.get("/listing/chefs", homePagesController.chefs)

module.exports = routes