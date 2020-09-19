const { compare } = require('bcryptjs')
const User = require('../models/User')

function checksIfTheChefsFieldsAreEmpty(body, res) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return res.send("Por favor, preencha todos os campos!")
        }
    }
}

async function login(req, res, next) {
    const fillAllFields = checksIfTheChefsFieldsAreEmpty(req.body, res)
    if(fillAllFields) return fillAllFields

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/login", {
        user: req.body,
        error: "Usuário não cadastrado"
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render("session/login", {
        user: req.body,
        error: "Senha incorreta!"
    })

    req.user = user

    next()
}

async function forgotPassword(req, res, next){
    const fillAllFields = checksIfTheChefsFieldsAreEmpty(req.body, res)
    if(fillAllFields) return fillAllFields

    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if(!user){
        return res.render("session/forgot-password", {
            user: req.body,
            error: "Usuário não cadastrado! Verifique se o email está correto."
        })
    }

    req.user = user

    next()
}

async function resetPassword(req, res, next){
    const fillAllFields = checksIfTheChefsFieldsAreEmpty(req.body, res)
    if(fillAllFields) return fillAllFields

    const { email, password, passwordRepeat, token } = req.body
    
    const user =  await User.findOne({ where: { email } })

    if(!user) return res.render("session/reset-password", { 
        token,
        user: req.body,
        error: "Usuário não cadastrado! Verifique se o email está correto."
    })

    if (password !== passwordRepeat) return res.render("session/reset-password", {
        token,
        user: req.body,
        error: "A senha e a repetição da senha não são iguais!"
    })

    let now = new Date()
    now = now.setHours(now.getHours())

    if(token !== user.reset_token ) return res.render("session/reset-password", {
        token,
        user: req.body,
        error: "Token inválido! Por favor, solicite um novo pedido de senha."
    })

    if(now > user.reset_token_expires) return res.render("session/reset-password", {
        token,
        user: req.body,
        error: "O token expirou! Por favor, solicite um novo pedido de recuperação senha."
    })

    req.user = user

    next()
}

module.exports = { 
    login,
    forgotPassword,
    resetPassword
}