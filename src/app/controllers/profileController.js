const User = require('../models/User')
module.exports = {
    async index(req, res) {
        try {

            const id = req.session.userId
            const user = await User.findOne({ where: { id } })

            return res.render("admin/profile/index", { user })
        } catch (error) {
            return res.render("not-found", { error: "Erro inesperado ao mostrar os dados do usuário!" })
        }
    },
    async put(req, res) {
        try {

            const { id, email, name } = req.body
            await User.update(id, {
                email,
                name
            })

            return res.render("admin/user/succes", { message: "Atualizado com sucesso!" })
        } catch (error) {
            return res.render("not-found", { error: "Erro inesperado ao atualizar os dados do usuário!" })
        }
    }
}