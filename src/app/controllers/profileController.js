const User = require('../models/User')
module.exports = {
    async index(req, res){
        const id = req.session.userId
        const user = await User.findOne({where: {id}})
        return res.render("admin/profile/index", {user})
    },
    async put(req, res) {
        const { id, email, name } = req.body
        await User.update(id, {
            email,
            name
        })

        return res.render("admin/profile/index", {
            user: req.body,
            succes: "Atualizado com sucesso!"
        })
    }
}