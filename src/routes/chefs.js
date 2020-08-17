const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const chefsController = require("../app/controllers/chefsController")


const { checksIfTheChefsFieldsAreEmpty, checksIfTheChefExists, checkForNewFilesAndUpdateFiles } = require('../app/validators/chefs')
const onlyUsers = require('../app/middlewares/session')

routes.get("/chefs", onlyUsers, chefsController.index)
routes.get("/chefs/create", onlyUsers, chefsController.create)
routes.get("/chefs/details/:id", onlyUsers, checksIfTheChefExists, chefsController.show);
routes.get("/chefs/edit/:id",  onlyUsers, checksIfTheChefExists, chefsController.edit);

routes.post("/chefs", multer.array("avatar", 1), onlyUsers, checksIfTheChefsFieldsAreEmpty, chefsController.post);
routes.put("/chefs", multer.array("avatar", 1), onlyUsers, checksIfTheChefsFieldsAreEmpty, checkForNewFilesAndUpdateFiles, chefsController.put);
routes.delete("/chefs", chefsController.delete);

module.exports = routes