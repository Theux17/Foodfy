const express = require('express')
const routes =  express.Router()

const searchController = require('../app/controllers/searchController')

const homePageRoutes = require('./homePages')
const recipesAdminRoutes = require('./recipesAdmin')
const chefsRoutes = require('./chefs')

routes.use('/', homePageRoutes)
routes.use('/admin', recipesAdminRoutes)
routes.use('/chefs', chefsRoutes)

routes.get("/search", searchController.filter)

module.exports = routes