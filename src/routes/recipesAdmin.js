const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipesAdminController = require('../app/controllers/recipesAdminController')
const { checksIfTheRecipeFieldsAreEmpty, checkIfFilesAreRemovedAndUpdate } = require('../app/validators/recipesAdmin')

routes.get("/recipes", recipesAdminController.index)

routes.get("/recipes/create", recipesAdminController.create)
routes.get("/recipes/:id", recipesAdminController.show)
routes.get("/recipes/:id/edit", recipesAdminController.edit)

routes.post("/recipes", multer.array("photos", 5), checksIfTheRecipeFieldsAreEmpty, recipesAdminController.post)
routes.put("/recipes", multer.array("photos", 5), checkIfFilesAreRemovedAndUpdate, recipesAdminController.put)
routes.delete("/recipes", recipesAdminController.delete); 

module.exports = routes