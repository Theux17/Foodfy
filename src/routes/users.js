const express = require('express')
const routes = express.Router()

const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')
const profileController = require('../app/controllers/profileController')

const SessionValidator = require('../app/validators/session')
const profileValidator = require('../app/validators/profile')
const { createUsers, updateUser } = require('../app/validators/users')


const { onlyUsers, isLoggedRedirectToUsers, isAdmin } = require('../app/middlewares/session')

// login/logout
routes.get('/login', isLoggedRedirectToUsers, sessionController.loginForm)
routes.post('/login', isLoggedRedirectToUsers, SessionValidator.login, sessionController.login)
routes.post('/logout', sessionController.logout)

// reset password / forgot
routes.get('/forgot-password', sessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgotPassword, sessionController.forgot)
routes.get('/password-reset', sessionController.resetForm)
routes.post('/password-reset', SessionValidator.resetPassword, sessionController.reset)

// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, profileController.index)
routes.put('/profile', onlyUsers, profileValidator.update, profileController.put)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyUsers, userController.list)  
routes.get('/users/create', onlyUsers, isAdmin, createUsers, userController.create) 
routes.post('/users', createUsers, userController.post)
routes.get('/users/edit/:id', onlyUsers, isAdmin, userController.edit)
routes.put('/users', updateUser, userController.put) 
routes.delete('/users', userController.delete) 

module.exports = routes