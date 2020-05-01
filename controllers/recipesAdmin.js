const recipe = require('../data')
const fs = require('fs')
const data = require('../data.json')

exports.index = function(req, res){
    return res.render("recipesAdmin/index", { recipes: data.recipes })
}

exports.create = function(req, res){
    return res.render("recipesAdmin/create")
}

exports.post = function(req, res){
    const keys = Object.keys(req.body)

    for(key of keys ){
        if(req.body[key] == "")
        return res.send("Please fill in all fields! ")
    }

    let {img_recipe, title, author, ingredients, preparations, information } = req.body

    let index = 0

    const lastRecipe = data.recipes[data.recipes.length - 1]

    if(lastRecipe) {
        index = lastRecipe.index + 1 
    }    
    data.recipes.push({
        index,
        img_recipe,  
        title,
        author,      
        ingredients, 
        preparations, 
        information
    })
    
    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")
        
        return res.redirect("/admin/recipes/")
    })
    
}

exports.show = function(req, res){
    const { index } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.index == index 
    })

    if(!foundRecipe) return res.send("Recipe is not found")

    const recipes = {
        ...foundRecipe
    }

    return res.render("recipesAdmin/show", {recipes } )
}

exports.edit = function(req, res){
    const { index } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.index == index 
    })

    if(!foundRecipe) return res.send("Recipe is not found")

    const recipe = {
        ...foundRecipe
    }

    return res.render("recipesAdmin/edit", {recipes: recipe})
}


exports.put = function(req, res){
    const { index } = req.body
    let id = 0

    const foundRecipe = data.recipes.find(function(recipe, foundIndex){
        if(recipe.index == index){
            id = foundIndex
            return true
        }
    })

    if(!foundRecipe) return res.send("Recipe is not found")

    const recipe = {
        ...foundRecipe,
        ...req.body,
        index: Number(req.body.index)
    }
    
    data.recipes[id] = recipe
    
    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")
        
        return res.redirect(`/admin/recipes/${index}`)
    })
}

exports.delete = function(req, res){
    const { index } = req.body

    const filteredRecipe = data.recipes.filter(function(recipe){
        return recipe.index != index

    })

    data.recipes = filteredRecipe

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")
        
        return res.redirect(`/admin/recipes/`)
    })

}