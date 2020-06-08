//const recipe = require('../data')
const Recipe = require("../models/Recipe")
//const data = require('../../../data.json')

module.exports = {
    index(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 4
        let offset =  limit * (page - 1)

        const params = {
            page, 
            limit, 
            offset, 
            callback(recipes){
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
                return res.render("recipesAdmin/index", { recipes, pagination, params })
            
            }
        }

        Recipe.paginate(params)
 
    },

    create(req, res) {
        Recipe.chefsSelectOptions(function(options){  
            return res.render("recipesAdmin/create", { chefsOptions: options })
        })
    },

    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please fill in all fields! ")
        }

        Recipe.create(req.body, function (recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)

        })


    },

    show(req, res) {

        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Recipe is not found!")

            return res.render("recipesAdmin/show", { recipe })
        })

    },

    edit(req, res) {
        Recipe.find(req.params.id, function (recipe) {

            if (!recipe) return res.send("Recipe is not found!")
        
            Recipe.chefsSelectOptions(function(options){  
                return res.render("recipesAdmin/edit", {recipe, chefsOptions: options })
            })
        })
    },


    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please fill in all fields! ")
        }

        Recipe.update(req.body, function () {

            return res.redirect(`/admin/recipes/${req.body.id}`)
        })

    },

    delete(req, res) {
        Recipe.delete(req.body.id, function () {

            return res.redirect("/admin/recipes")
        })

    }
}