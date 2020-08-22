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

async function login(req, res, next) {
    const fillAllFields = checksIfTheChefsFieldsAreEmpty(req.body)

    if(fillAllFields) return res.render("session/login", fillAllFields)

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user || password != user.password) return res.render("session/login", {
        user: req.body,
        error: "Usuário não cadastrado"
    })

    req.user = user

    if (user.password == password) return next()
}

module.exports = { login }