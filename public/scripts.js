const currentMenuPage = location.pathname

function addClassToTheMenuItem (){

    const menuItemsHome = document.querySelectorAll("header .links a")
    const menuItemsAdmin = document.querySelectorAll("header .admin a")

    for (item of menuItemsHome) {
        if (currentMenuPage.includes(item.getAttribute("href"))) {
            item.classList.add("bold-home")
        }
    }

    for (item of menuItemsAdmin) {
        if (currentMenuPage.includes(item.getAttribute("href"))) {
            item.classList.add("bold-admin") 
        }
    }
}

if (currentMenuPage){
    addClassToTheMenuItem()
}

// Direciona para a receita selecionada

function leadstoTheSelectedRecipe(){
    
    for (let recipe of recipes) {
        recipe.addEventListener("click", function () {
            const id = recipe.getAttribute("id")
            window.location.href = `/recipe/${id}`
        })
    }
}

const recipes = document.querySelectorAll(".recipe")

if(recipes){
    leadstoTheSelectedRecipe()
}

    
// Mostrar/Esconder informações da receita
const ingredient = document.querySelector(".ingredients ul")
const preparation = document.querySelector(".preparation ul")
const information = document.querySelector(".text")

function ShowAndHide(button1, button2, button3) {

    button1.addEventListener("click", function () {
        const removeIngredient = ingredient.classList.toggle('remove')

        if(removeIngredient) return button1.innerHTML = 'MOSTRAR'
        if(!removeIngredient) return button1.innerHTML = 'ESCONDER'
        
    })

    button2.addEventListener("click", function () {
        const removePreparation = preparation.classList.toggle('add')

        if(removePreparation) return button2.innerHTML = 'ESCONDER'
        if(!removePreparation) return button2.innerHTML = 'MOSTRAR'
    })

    button3.addEventListener("click", function () {
        const removeInformation = information.classList.toggle('remove')

        if(removeInformation) return button3.innerHTML = 'MOSTRAR'
        if(!removeInformation) return button3.innerHTML = 'ESCONDER'
        
    })

}

const button1 = document.querySelector(".button1")
const button2 = document.querySelector(".button2")
const button3 = document.querySelector(".button3")

if (button1 && button2 && button3) {
    ShowAndHide(button1, button2, button3)
}


//Pagination
function paginate(selectPage, totalPages) {

    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)
            oldPage = currentPage
        }


    }
    return pages
}

function createPagination(pagination) {

    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {

        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            elements += `<a href="?page=${page}">${page}</a>`
        }
    }

    pagination.innerHTML = elements

}

const pagination = document.querySelector(".pagination")
if (pagination) {
    createPagination(pagination)
}

//Confirma se quer deletar o chef e a receita

const formDelete = document.querySelector(".form-delete")

function checkBeforeDeletingTheRecipe(event) {
    const confirmation = confirm("Deseja deletar a receita criada ?")
    if (!confirmation) return event.preventDefault()
}

if (formDelete) {
    formDelete.addEventListener("submit", checkBeforeDeletingTheRecipe)
}


// Verifica se o chef tem receita
const chef = document.querySelector("#chef")

function checksTheTotalRecipes (totalRecipes){ 
    if (totalRecipes >= 1) {
        formDelete.addEventListener("submit", function () {
            return event.preventDefault(alert("O chef não pode ser deletado pois ainda possui receitas cadastradas! Delete as receitas antes de deletar o chef."))
        })
    }
}

const totalRecipes = +chef.dataset.total_recipes

if (totalRecipes){
    checksTheTotalRecipes()
}