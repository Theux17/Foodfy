const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipesAdminController = require('../app/controllers/recipesAdminController')
const { checksIfTheRecipeFieldsAreEmpty, checkIfFilesAreRemovedAndUpdate, recipeDoesNotExist, userRecipes, checksIfRecipesIsUser } = require('../app/validators/recipesAdmin')

const { onlyUsers } = require('../app/middlewares/session')

routes.get("/recipes", onlyUsers, userRecipes, recipesAdminController.index)

routes.get("/recipes/create", onlyUsers, recipesAdminController.create)
routes.get("/recipes/:id", onlyUsers, recipeDoesNotExist, checksIfRecipesIsUser, recipesAdminController.show)
routes.get("/recipes/:id/edit", onlyUsers, recipeDoesNotExist, checksIfRecipesIsUser, recipesAdminController.edit)

routes.post("/recipes", onlyUsers, multer.array("photos", 5), checksIfTheRecipeFieldsAreEmpty, recipesAdminController.post)
routes.put("/recipes/:id", onlyUsers, multer.array("photos", 5), checkIfFilesAreRemovedAndUpdate, recipesAdminController.put)
routes.delete("/recipes", onlyUsers, recipesAdminController.delete); 

module.exports = routes