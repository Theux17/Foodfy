const { compare } = require('bcryptjs')

const User = require('../models/User')

async function update(req, res, next) {
    const { id, password } = req.body
    
    const user = await User.findOne({where: { id } })

    if(password == "") return res.render("admin/profile/index", {
        user: req.body,
        error: "Insira a senha!"
    })

    if(!user){
        return res.render("admin/profile/index", {
            user: req.body,
            error: "Usuário não cadastrado!"
        })
    }

    const passed = await compare(password, user.password)

    if(!passed) return res.render("admin/profile/index", {
        user: req.body,
        error: "Senha incorreta!"
    })

    next()
}

module.exports = {
    update
}