const express = require('express')
const routes = express.Router()

const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')
const profileController = require('../app/controllers/profileController')

const SessionValidator = require('../app/validators/session')
const profileValidator = require('../app/validators/profile')
const { createUsers, updateUser, checksIfTheUserIsAnAdmin } = require('../app/validators/users')


const onlyUsers = require('../app/middlewares/session')

// login/logout
routes.get('/login',  sessionController.loginForm)
routes.post('/login', SessionValidator.login, sessionController.login)
routes.post('/logout', sessionController.logout)

// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, profileController.index)
routes.put('/profile', onlyUsers, profileValidator.update, profileController.put)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyUsers, userController.list)  
routes.get('/users/create', onlyUsers, createUsers, userController.create) 
routes.post('/users', createUsers, userController.post)
routes.get('/users/edit/:id', onlyUsers, checksIfTheUserIsAnAdmin, userController.edit)
routes.put('/users', updateUser, userController.put) 
routes.delete('/users', userController.delete) 

module.exports = routes