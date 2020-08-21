const User = require('../models/User')
async function update(req, res, next) {
    const { password } = req.body
    
    const user = await User.findOne({where: { password } })
    if(password == "") return res.render("admin/profile/index", {
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