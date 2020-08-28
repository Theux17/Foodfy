const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const chefsController = require("../app/controllers/chefsController")

const { checksIfTheChefsFieldsAreEmpty, checksIfTheChefExists, checkForNewFilesAndUpdateFiles } = require('../app/validators/chefs')
// const {} = require('../app/validators/users')

const { onlyUsers, isAdmin } = require('../app/middlewares/session')

routes.get("/chefs", onlyUsers, chefsController.index)
routes.get("/chefs/create", onlyUsers, isAdmin, chefsController.create)
routes.get("/chefs/details/:id", onlyUsers, isAdmin, checksIfTheChefExists, chefsController.show);
routes.get("/chefs/edit/:id",  onlyUsers, isAdmin, checksIfTheChefExists, chefsController.edit);

routes.post("/chefs", multer.array("avatar", 1), checksIfTheChefsFieldsAreEmpty, chefsController.post);
routes.put("/chefs", multer.array("avatar", 1), checkForNewFilesAndUpdateFiles, chefsController.put);
routes.delete("/chefs", chefsController.delete);

module.exports = routes