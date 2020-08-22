const User = require('../models/User')

module.exports = {
    loginForm(req, res){
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id
        req.session.is_admin = req.user.is_admin

        return res.redirect("/admin/profile")
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect("/admin/login")
    }
}