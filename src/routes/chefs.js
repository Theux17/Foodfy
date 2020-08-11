const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const chefsController = require("../app/controllers/chefsController")

const { checksIfTheChefsFieldsAreEmpty, checksIfTheChefExists, checkForNewFilesAndUpdateFiles } = require('../app/validators/chefs')

routes.get("/", chefsController.index)
routes.get("/create", chefsController.create)
routes.get("/details/:id", checksIfTheChefExists, chefsController.show);
routes.get("/edit/:id", checksIfTheChefExists, chefsController.edit);

routes.post("/", multer.array("avatar", 1), checksIfTheChefsFieldsAreEmpty, chefsController.post);
routes.put("/", multer.array("avatar", 1), checksIfTheChefsFieldsAreEmpty, checkForNewFilesAndUpdateFiles, chefsController.put);
routes.delete("/", chefsController.delete);

module.exports = routes