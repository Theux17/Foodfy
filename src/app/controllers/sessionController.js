const User = require('../models/User')

module.exports = {
    loginForm(req, res){
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect("/admin/users/create")
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect("/admin/login")
    }
}