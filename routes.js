const express = require('express')
const recipes = require("./controllers/recipes")
const recipesAdmin = require("./controllers/recipesAdmin")
const routes =  express.Router()

routes.get("/", recipes.home) // rota principal
routes.get("/about", recipes.about) // rota sobre
routes.get("/revenues", recipes.revenues) // rota de todas as receitas
routes.get("/recipe/:index", recipes.index) // rota de mostrar a receita


routes.get("/admin/recipes", recipesAdmin.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:index", recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:index/edit", recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipesAdmin.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipesAdmin.put); // Editar uma receita
routes.delete("/admin/recipes", recipesAdmin.delete); // Deletar uma receita


module.exports = routes