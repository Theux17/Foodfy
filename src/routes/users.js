const express = require('express')
const routes = express.Router()

const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')

const SessionValidator = require('../app/validators/session')

const onlyUsers = require('../app/middlewares/session')

// login/logout
routes.get('/login', sessionController.loginForm)
routes.post('/login', SessionValidator.login, sessionController.login)
routes.post('/logout', sessionController.logout)

// Rotas de perfil de um usuário logado
// routes.get('/profile', ProfileController.index)
// routes.put('/profile', ProfileController.put)

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/users', UserController.list)  
routes.get('/users/create', onlyUsers, userController.create) 
// routes.post('/users', userController.post)
// routes.get('/users/edit/:id', UserController.edit)
// routes.put('/users', userController.put) 
// routes.delete('/users', UserController.delete) 

module.exports = routes