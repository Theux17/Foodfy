const User = require('../models/User')

function checksIfTheChefsFieldsAreEmpty(body, res) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") 
            return res.send("Por favor, preencha todos os campos!")
    }
}

function checksIfUserAlreadyExists(user, body) {
    if (user) return {
        user: body,
        error: "Usuário já cadastrado!"
    }
}

async function createUsers(req, res, next) {
    try {
        const fillAllFields = checksIfTheChefsFieldsAreEmpty(req.body, res)
        if (fillAllFields) return res.render('admin/user/create', fillAllFields)

        const { email } = req.body
        const user = await User.findOne({ where: { email } })

        const userAlreadyExists = checksIfUserAlreadyExists(user, req.body)
        if (userAlreadyExists) return res.render("admin/user/create", userAlreadyExists)

        const users = await User.findAll()

        users.map(user => {
            if (user.email == email) return res.render("admin/user/create", {
                createdUser: user,
                user: req.body,
                error: "Usuário já cadastrado!"
            })
       
        })

        next()

    } catch (err) {
        console.error(err)
    }
}

function checksIfTheUserIdIsTheSameAsTheSession(req, res, next){
    const { id } = req.params
    if(id == req.session.userId) return res.redirect('/admin/profile')

    next()
}

async function userDoesNotExist(req, res, next) {
    const user = await User.findOne({ where: {id: req.params.id} })

    if (!user) return res.render("admin/user/user-not-found")

    next()
}

async function updateUser(req, res, next) {
    const { email, id } = req.body
    const user = await User.findOne({ where: { email } })

    const userAlreadyExists = checksIfUserAlreadyExists(user, req.body)
    if (userAlreadyExists && user.id != id) return res.render("admin/user/edit", userAlreadyExists)

    req.user = user

    next()
}

module.exports = {
    createUsers,
    updateUser,
    checksIfTheUserIdIsTheSameAsTheSession,
    userDoesNotExist
}