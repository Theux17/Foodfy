const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const chefsController = require("../app/controllers/chefsController")

const { checksIfTheChefsFieldsAreEmpty, checksIfTheChefExists, checkForNewFilesAndUpdateFiles } = require('../app/validators/chefs')

routes.get("/chefs", chefsController.index)
routes.get("/chefs/create", chefsController.create)
routes.get("/chefs/details/:id", checksIfTheChefExists, chefsController.show);
routes.get("/chefs/edit/:id", checksIfTheChefExists, chefsController.edit);

routes.post("/chefs", multer.array("avatar", 1), checksIfTheChefsFieldsAreEmpty, chefsController.post);
routes.put("/chefs", multer.array("avatar", 1), checksIfTheChefsFieldsAreEmpty, checkForNewFilesAndUpdateFiles, chefsController.put);
routes.delete("/chefs", chefsController.delete);

module.exports = routes