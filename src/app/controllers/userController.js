const User = require('../models/User')
const mailer = require('../../lib/mailer')

module.exports = {
    async list(req, res) {
        const results = await User.allUsers()
        const users = results.rows

        return res.render("admin/user/list", { users })
    },
    create(req, res) {
        return res.render("admin/user/create")
    },

    async post(req, res) {
        try {
            const id = await User.create(req.body)
            const createdUser = await User.findOne({ where: { id } })

            await mailer.sendMail({
                to: createdUser.email,
                from: 'foodfy.com.br',
                subject: 'Acesse a plataforma',
                html: `
                    <h2>Acesse a plataforma</h2>
                    <p>Para ter acesso a plataforma, disponibilizamos a seguinte senha de acesso: ${createdUser.password}</p>
                    <br>
                    <p>
                        <a href="http://localhost:3000/admin/login">
                            Entre na página para fazer o login clicando aqui! 
                        </a>
                    </p>
                `
            })

            return res.render("admin/user/create", {
                createdUser,
                user: req.body,
                succes: "Usuário cadastrado com sucesso! Entre no email cadastrado para obter a senha de acesso."
            })

        } catch (err) {
            console.error(err)
            return res.render("admin/user/create", {
                user: req.body,
                error: "Aconteceu algum erro!"
            })
        }
    },
    async edit(req, res) {
        const { id } = req.params
        const user = await User.findOne({ where: { id } })

        return res.render("admin/user/edit", { user })
    },
    async put(req, res) {
        try {
            const { name, email, is_admin, id } = req.body

            await User.update(id, {
                name,
                email,
                is_admin: is_admin || false
            })

            return res.render("admin/user/edit", {
                succes: "Usuário atualizado com sucesso!",
                user: req.body
            })

        } catch (err) {
            console.error(err)
            return res.render("admin/user/edit", {
                error: "Algum erro aconteceu!",
                user: req.body
            })
        }
    },

    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            const results = await User.allUsers()
            const users = results.rows

            return res.render("admin/user/list", {
                users,
                succes: "Usuário deletado com sucesso!"
            })
        } catch (err) {
            console.error(err)
            return res.render("admin/user/list", {
                error: "Algum erro aconteceu!"
            })
        }
    }
}