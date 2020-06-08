const express = require('express')
const recipes = require("./app/controllers/recipes")
const recipesAdmin = require("../src/app/controllers/recipesAdmin")
const chefs = require("./app/controllers/chefs")
const routes =  express.Router()

routes.get("/", recipes.home) // rota principal
routes.get("/about", recipes.about) // rota sobre
routes.get("/revenues", recipes.revenues) // rota de todas as receitas
routes.get("/recipe/:id", recipes.recipes) // rota de mostrar a receita
routes.get("/listing/chefs", recipes.chefs) // rota de listagem de chefs
routes.get("/home/filter", recipes.filter)

routes.get("/admin/recipes", recipesAdmin.index); // Mostrar a lista de receitas

routes.get("/admin/recipes/create", recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipesAdmin.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipesAdmin.put); // Editar uma receita
routes.delete("/admin/recipes", recipesAdmin.delete); // Deletar uma receita


routes.get("/chefs", chefs.index)
routes.get("/chefs/create", chefs.create)
routes.get("/chefs/details/:id", chefs.show);
routes.get("/chefs/edit/:id", chefs.edit);

routes.post("/chefs", chefs.post);
routes.put("/chefs", chefs.put);
routes.delete("/chefs", chefs.delete);

module.exports = routes