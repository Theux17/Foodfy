const User = require('../models/User')

function checksIfTheChefsFieldsAreEmpty(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Por favor, preencha todos os campos!"
            }
        }
    }
}

function checksIfUserAlreadyExists(user, body) {
    if (user) return {
        user: body,
        error: "Usuário já cadastrado!"
    }
}

async function checksIfTheUserIsAnAdmin(req, res, next) {
    const id = req.params.id
    const loggedUserId = req.session.userId
    
    const user = await User.findOne({ where: { id } })
   
    if(!user) return res.redirect('/admin/users') 

    if (user.id == loggedUserId && user.is_admin == true ) return res.redirect('/admin/profile')
    
    if(req.session.is_admin !== true && !user ) return res.redirect('/admin/users')
    console.log(req.session.adminUser)
    if(!req.session.is_admin === true) return res.redirect('/admin/users')
    next()
}

async function createUsers(req, res, next) {
    try {
        const fillAllFields = checksIfTheChefsFieldsAreEmpty(req.body)
        if (fillAllFields) return res.render('admin/user/create', fillAllFields)

        const { email } = req.body
        const user = await User.findOne({ where: { email } })
        
        if(req.session.is_admin !== true) return res.redirect('/admin/users')

        const userAlreadyExists = checksIfUserAlreadyExists(user, req.body)
        if (userAlreadyExists) return res.render("admin/user/create", userAlreadyExists)

        const users = await User.allUsers()

        users.rows.map(user => {
            if (user.email == email) return res.render("admin/user/create", {
                createdUser: user,
                user: req.body,
                error: "Usuário já cadastrado!"
            })
            if (!user) return res.render("admin/user/create", {
                user: req.body,
                succes: "Usuário cadastrado com sucesso! Entre no email cadastrado para obter a senha de acesso."
            })
        })

        next()

    } catch (err) {
        console.error(err)
    }
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
    checksIfTheUserIsAnAdmin,
    createUsers,
    updateUser
}