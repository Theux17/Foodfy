const express = require('express')
const routes =  express.Router()

const recipes = require("./app/controllers/recipes")
const recipesAdmin = require("../src/app/controllers/recipesAdmin")
const chefs = require("./app/controllers/chefs")
const multer = require('./app/middlewares/multer')


routes.get("/", recipes.home) // rota principal
routes.get("/about", recipes.about) // rota sobre
routes.get("/recipes", recipes.recipesAll) // rota de todas as receitas
routes.get("/recipe/:id", recipes.recipes) // rota de mostrar a receita
routes.get("/listing/chefs", recipes.chefs) // rota de listagem de chefs

routes.get("/search/", recipes.filter)

routes.get("/admin/recipes", recipesAdmin.index); // Mostrar a lista de receitas

routes.get("/admin/recipes/create", recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", multer.array("photos", 5), recipesAdmin.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), recipesAdmin.put); // Editar uma receita
routes.delete("/admin/recipes", recipesAdmin.delete); // Deletar uma receita


routes.get("/chefs", chefs.index)
routes.get("/chefs/create", chefs.create)
routes.get("/chefs/details/:id", chefs.show);
routes.get("/chefs/edit/:id", chefs.edit);

routes.post("/chefs", multer.array("avatar", 1), chefs.post);
routes.put("/chefs", multer.array("avatar", 1), chefs.put);
routes.delete("/chefs", chefs.delete);

module.exports = routes