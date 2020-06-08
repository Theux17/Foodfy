//const recipe = require('../data')
const Chef = require("../models/Chef")
//const data = require('../../../data.json')

module.exports = {
    index(req, res) {
        Chef.all(function (chefs) {
            return res.render("chefs/index", { chefs })
        })
    },

    create(req, res) {
        return res.render("chefs/create")
    },

    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please fill in all fields! ")
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`/chefs/details/${chef.id}`)

        })


    },

    show(req, res) {

        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send("Chef is not found!")

            Chef.recipesAll(chef.id, function (recipes) {

                return res.render("chefs/details", { chef, recipes })
            })
            
        })

    },

    edit(req, res) {

        Chef.find(req.params.id, function (chef) {

            if (!chef) return res.send("Chef is not found!")

            return res.render("chefs/edit", { chef })
        })
    },


    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please fill in all fields! ")
        }

        Chef.update(req.body, function () {

            return res.redirect(`/chefs/details/${req.body.id}`)
        })

    },

    delete(req, res) {


        Chef.delete(req.body.id, function () {
            return res.redirect("/chefs")
        })


    }
}