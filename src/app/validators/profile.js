const User = require('../models/User')
async function update(req, res, next) {
    const { email, password } = req.body
    
    const user = await User.findOne({where: { email } })
    if(user.password !== password) return res.render("admin/profile/index", {
        user: req.body,
        error: "Senha incorreta"
    })


    if(password == "") return res.render("admin/profile/index", {
        user: req.body,
        error: "Insira a senha!"
    })

    if(!user){
        return res.render("admin/profile/index", {
            user: req.body,
            error: "Senha incorreta"
        })
    }

    next()
}

module.exports = {
    update
}