const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")


module.exports = {
    home(req, res){
        Recipe.all(function (recipes) {
            return res.render("recipes/home", { recipes } )
        })
    },
    
    filter(req, res){
        let { filter } = req.query

        if(filter){
            Recipe.findBy(filter, function(recipes){
                return res.render("recipes/filter", { filter, recipes })
            })
        } else {
            return res.redirect("/")   
        }
    },

    about(req, res){
        const about = {
            foodfyTitle: "Sobre o Foodfy",
            foodfyParagraph1: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.", 
            foodfyParagraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod.",
            subtitle1: "Como tudo começou…",
            subtitleParagraph1: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
            subtitleParagraph2: " Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod.",
            subtitle2: "Nossas receitas",
            subheadingParagraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod."
        }
    
        return res.render("recipes/about", {about})
    },
    
    revenues(req, res){
        Recipe.all(function (recipes) {
          
            return res.render("recipes/recipes", { recipes })
        })
    },
    
    recipes(req, res){
        
        Recipe.find(req.params.id, function (recipe) {

            if (!recipe) return res.send("Recipe is not found!")
            
            return res.render("recipes/information", {recipes: recipe })
        })
 
    },
    
    chefs(req, res){
        Chef.all(function(chefs){
            return res.render("recipes/chefs", { chefs })
        })
    }
}