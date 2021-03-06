const crypto = require('crypto')
const { hash } = require('bcryptjs')

const User = require('../models/User')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
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
    },

    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },

    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now 
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `
                    <h2>Esqueceu a senha ?</h2>
                    <p> Não se preocupe, clique no link abaixo para recuperar a senha.</p>
                    <a href="http://localhost:3000/admin/password-reset?token=${token}" target="_blank">Recuperar a senha</a>
                `
            })

            return res.render("admin/user/succes", {message:"Verifque o seu email para resetar a senha.", location: "/admin/login" })

        }catch(err){
            return res.render('session/forgot-password', {
                user: req.body,
                error: "Algum erro aconteceu!"
            })
        }
    },
    resetForm(req, res) {
        return res.render("session/reset-password", { token: req.query.token } )
    },
    async reset(req, res) {
        try {
            const user = req.user 
            const { password } = req.body
            
            const newPassword = await hash(password, 8)
            
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })
            
            return res.render("admin/user/succes", {message: "Nova senha cadastrada com sucesso!", location:"/admin/login"})

        } catch (err) {
            return res.render('session/reset-password', {
                user: req.body,
                error: "Algum erro aconteceu!"
            }) 
        }
    }
}