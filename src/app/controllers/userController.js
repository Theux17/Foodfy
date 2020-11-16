const crypto = require('crypto')
const { hash }= require('bcryptjs')
const { unlinkSync } = require('fs')

const mailer = require('../../lib/mailer')
const User = require('../models/User')
const Recipe = require('../models/Recipe')

module.exports = {
    async list(req, res) {
        try {
            const users = await User.findAll()

            return res.render("admin/user/list", { users })

        } catch (error) {
            return res.render("not-found", { error: "Erro inesperado ao listar os usuários!" })
        }
    },
    create(req, res) {
        return res.render("admin/user/create")
    },

    async post(req, res) {
        try {
            let { name, email, password, reset_token, reset_token_expires, is_admin } = req.body

            password = crypto.randomBytes(5).toString("hex")
            
            is_admin = is_admin || false
            reset_token = ""
            reset_token_expires = ""

            const userId = await User.create({ 
                name, 
                email, 
                password: await hash(password, 8), 
                reset_token, 
                reset_token_expires, 
                is_admin 
            })
            
            const createdUser = await User.findOne({ where: { id: userId } })

            await mailer.sendMail({
                to: createdUser.email,
                from: 'foodfy.com.br',
                subject: 'Acesse a plataforma',
                html: `
                    <h2>Acesse a plataforma</h2>
                    <p>Seja Bem vindo ${createdUser.name}! Para ter acesso a plataforma disponibilizamos a seguinte senha de acesso: <strong>${password}</strong></p>
                    <br>
                    <p>
                        <a href="http://localhost:3000/admin/login">
                            Entre na página para fazer o login clicando aqui! 
                        </a>
                    </p>
                `
            })

            const message = "Usuário cadastrado com sucesso! Entre no email cadastrado para obter a senha de acesso."

            return res.render("admin/user/succes", {message, location: "/admin/users"})

        } catch (err) {
            return res.render("admin/user/create", {
                user: req.body,
                error: "Erro inesperado ao criar um novo usuário"
            })
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params
            const user = await User.findOne({ where: { id } })
            
            return res.render("admin/user/edit", { user })
            
        } catch (error) {
            return res.render("not-found", { error: "Erro inesperado ao entrar na página de editar o usuário!" })
        }
    },
    async put(req, res) {
        try {
            const { name, email, is_admin, id } = req.body

            await User.update(id, {
                name,
                email,
                is_admin: is_admin || false
            })

            return res.render("admin/user/succes", { message:  "Atualizado com sucesso!" })

        } catch (err) {
            return res.render("admin/user/edit", {
                error: "Erro inesperado ao atualizar o usuário",
                user: req.body
            })
        }
    },

    async delete(req, res) {
        try {
            
            let recipes = await Recipe.findAll({ where: {user_id: req.body.id} })
            const allFilesPromise = recipes.map( recipe => Recipe.files('recipe_files', 'recipe_id', recipe.id))
            
            await User.delete(req.body.id)
            
            let promiseResults = await Promise.all(allFilesPromise)
            promiseResults.map(results => {
                results.rows.map(file => unlinkSync(file.path))
            })
            
            return res.redirect("/admin/users")
        } catch (err) {
            return res.render("admin/user/list", {
                error: "Erro inesperado ao deletar o usuário!"
            })
        }
    }
}