const User = require('../models/User')

module.exports = {
    create(req, res) {
        
        return res.render("admin/user/create")
    },

    async post(req, res ){
        const results = await User.create(req.body)
        const user = results.rows[0]

        return res.render("user/create", {user})
    }
}