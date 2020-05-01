const recipes = document.querySelectorAll(".recipe")

for(let recipe of recipes) {
    recipe.addEventListener("click", function(){
        const index = recipe.getAttribute("id")
        window.location.href = `/recipe/${index}`
    })
}


// Mostrar/Esconder informações da receita
const ingredient = document.querySelector("ul")
const preparations = document.querySelector(".remove")
const information = document.querySelector(".text")

const button1 = document.querySelector(".button1")
const button2 = document.querySelector(".button2")
const button3 = document.querySelector(".button3")

button1.addEventListener("click", function(){
    const removeIngredient = ingredient.classList.toggle("remove")
    if(removeIngredient) return button1.innerHTML = "MOSTRAR"
    if(!removeIngredient) return button1.innerHTML = "ESCONDER"
})

button2.addEventListener("click", function(){
    const removePreparation = preparations.classList.toggle("remove")
    if(!removePreparation) return button2.innerHTML = "ESCONDER"
    if(removePreparation) return button2.innerHTML = "MOSTRAR"
})


button3.addEventListener("click", function(){
    const removeInformation = information.classList.toggle("remove")
    if(removeInformation) return button3.innerHTML = "MOSTRAR"
    if(!removeInformation) return button3.innerHTML = "ESCONDER"
})

