const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('../src/routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)
server.use(async (req, res, next) => {
    res.locals.session = req.session
    res.locals.adminUser = req.session.is_admin
    next()
})
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.set("view engine", "njk")
server.use(methodOverride('_method'))
server.use(routes)

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.use( (req, res) => res.status(404).render("not-found") )

server.listen(5000, function(req, res){    
    console.log("Server is running")
})


