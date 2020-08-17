const express = require('express')
const routes =  express.Router()

const searchController = require('../app/controllers/searchController')

const homePageRoutes = require('./homePages')
const recipesAdminRoutes = require('./recipesAdmin')
const chefsRoutes = require('./chefs')
//const profileRoutes = require('./profile')
const usersRoutes = require('./users')

routes.use('/', homePageRoutes)
routes.use('/admin', recipesAdminRoutes)
routes.use('/admin', chefsRoutes)
//routes.use('/admin', profileRoutes)
routes.use('/admin', usersRoutes)

routes.get("/search", searchController.filter)

module.exports = routes