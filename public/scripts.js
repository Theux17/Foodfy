const currentMenuPage = location.pathname

function addClassToTheMenuItem() {

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

if (currentMenuPage) {
    addClassToTheMenuItem()
}

// Direciona para a receita selecionada
function leadstoTheSelectedRecipe() {

    for (let recipe of recipes) {
        recipe.addEventListener("click", function () {
            const id = recipe.getAttribute("id")
            window.location.href = `/recipe/${id}`
        })
    }
}

const recipes = document.querySelectorAll(".recipe")

if (recipes) {
    leadstoTheSelectedRecipe()
}


// Mostrar/Esconder informações da receita
const ingredient = document.querySelector(".ingredients ul")
const preparation = document.querySelector(".preparation ul")
const information = document.querySelector(".text")

function ShowAndHide(button1, button2, button3) {

    button1.addEventListener("click", function () {
        const removeIngredient = ingredient.classList.toggle('remove')
        if (removeIngredient) {
            return button1.innerHTML = 'MOSTRAR'
        }

        if (!removeIngredient) return button1.innerHTML = 'ESCONDER'

    })

    button2.addEventListener("click", function () {
        const removePreparation = preparation.classList.toggle('add')

        if (removePreparation) return button2.innerHTML = 'ESCONDER'
        if (!removePreparation) return button2.innerHTML = 'MOSTRAR'
    })

    button3.addEventListener("click", function () {
        const removeInformation = information.classList.toggle('remove')

        if (removeInformation) return button3.innerHTML = 'MOSTRAR'
        if (!removeInformation) return button3.innerHTML = 'ESCONDER'

    })

}

const button1 = document.querySelector(".button1")
const button2 = document.querySelector(".button2")
const button3 = document.querySelector(".button3")

if (button1 && button2 && button3) {
    ShowAndHide(button1, button2, button3)
}


//add ingredient/preparation

function addIngredient() {
    const fieldContainer = document.querySelectorAll(".ingredient")

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}


function addPreparation() {
    const fieldContainer = document.querySelectorAll(".preparation")

    // Realiza um clone doa última preparação adicionada
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    preparations.appendChild(newField)
}


const ingredients = document.querySelector("#ingredients")
const preparations = document.querySelector("#preparations")

if (ingredients && preparations) {

    document
        .querySelector(".add-ingredient")
        .addEventListener("click", addIngredient)


    document
        .querySelector(".add-preparation")
        .addEventListener("click", addPreparation)

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

function checksTheTotalRecipes(totalRecipes) {
    if (totalRecipes >= 1) {
        formDelete.addEventListener("submit", function () {
            return event.preventDefault(alert("O chef não pode ser deletado pois ainda possui receitas cadastradas! Delete as receitas antes de deletar o chef."))
        })
    }
}


if (chef) {
    const totalRecipes = +chef.dataset.total_recipes
    checksTheTotalRecipes(totalRecipes)
}


// Upload de imagens
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) {
            PhotosUpload.UpdateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)

            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.UpdateInputFiles()

    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos!`)
            event.preventDefault()
            return true
        }

        const photosDiv = []

        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)

            }

        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert(`Você só pode enviar no máximo ${uploadLimit} fotos.`)
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode

        const newFiles = Array.from(PhotosUpload.preview.children).filter(file => {
            if (file.classList.contains('photo') && !file.getAttribute('id')) return true
        })
        const index = newFiles.indexOf(photoDiv)
        PhotosUpload.files.splice(index, 1)

        PhotosUpload.UpdateInputFiles()

        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    },

    UpdateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    checkThatThereIsNoImage() {

    }
}

// Galeria de imagens
const ImageGallery = {
    highlight: document.querySelector(".highlight img"),
    previews: document.querySelectorAll(".gallery-preview img"),
    setImage(event) {
        const { target } = event

        ImageGallery.previews.forEach(preview => preview.classList.remove("active"))
        target.classList.add("active")
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
},

Lightbox = {
    target: document.querySelector(".lightbox-target"),
    image: document.querySelector(".lightbox-target img"),
    closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },

    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"

    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error) {
            input.style.border = '1px solid #FF3131'
            Validate.displayError(input, results.error)
        } else { input.style.border = '1px solid #DDDDDD' }

    },

    displayError(input, error){
        const div = document.createElement("div")
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()

    },

    clearErrors(input){
        const errorDiv = input.parentNode.querySelector(".error")

        return errorDiv ? errorDiv.remove() : false
    },

    isEmail(value){
        let error = null

        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(emailFormat)) error = "Email inválido" 

        return {
            error, 
            value
        }
    }
}
