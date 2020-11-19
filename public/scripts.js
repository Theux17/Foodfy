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

function removeIngredient(event) {
    const fieldContainer = document.querySelectorAll("#ingredients input")
    
    while(fieldContainer.length <= 1 ) {
        return false
    }

    event.target.parentNode.remove()
    
}

function addPreparation() {
    const fieldContainer = document.querySelectorAll(".preparation")

    // Realiza um clone da última preparação adicionada
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    preparations.appendChild(newField)
}

function removePreparation(event) {
    const fieldContainer = document.querySelectorAll("#preparations input")
    
    while(fieldContainer.length <= 1 ) {
        return false
    }

    event.target.parentNode.remove()
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


// Verifica se o chef tem receita
function checksTheTotalRecipes(totalRecipes) {
    const deleteChefButton = document.querySelector(".form-delete.chef button")
    if (totalRecipes >= 1) {
        deleteChefButton.addEventListener("click", () => {
            return event.preventDefault(alert("O chef não pode ser deletado pois ainda possui receitas cadastrada. Delete as receitas antes de deletar o chef."))
        })
    } else {
        deleteChefButton.addEventListener("click", () => {
            return message("Deletado com sucesso!", "succes")
        })
    }
}

const chef = document.querySelector("#chef")
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


function message(messageToTheUser, type) {
    let message = document.createElement('div')
    message.classList.add('message')
    message.classList.add(`${type}`)
    message.style.position = "fixed"
    document.querySelector("body").append(message)
    message.innerHTML = `${messageToTheUser}`
    return setTimeout(() => {
        message.remove()
    }, 6000);
}
const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error) {
            input.style.border = '1px solid #FF3131'
            Validate.displayError(input, results.error)
        } else { input.style.border = '1px solid #DDDDDD' }

    },

    displayError(input, error) {
        const div = document.createElement("div")
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()

    },

    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")

        return errorDiv ? errorDiv.remove() : false
    },

    isEmail(value) {
        let error = null

        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(emailFormat)) error = "Email inválido"

        return {
            error,
            value
        }
    },
    allFieldsRecipes(event) {
        const photo = document.querySelector('#photos-preview .photo img')
        const items = document.querySelectorAll('.item input[type="text"]')
        const select = document.querySelector('.item select')
        const option = select.options[select.selectedIndex].value

        if (photo == null) {
            message("Por favor, coloque uma imagem!", "error")

            return event.preventDefault()
        }

        for (item of items) {
            if (item.value == "" || option == "") {
                message("Por favor, preencha todos os campos!", "error")

                return event.preventDefault()
            }
        }


        return message("Operação realizada com sucesso!", "succes")
    },
    allFieldsChefs(event) {
        const file = document.querySelector('input#avatar-input')
        const name = document.querySelector('input[type="text"]')

        if (name.value == "") {
            message("Por favor, insira o nome do chef.", "error")
            return event.preventDefault()
        }

        if (file.value == "") {
            message("Por favor, coloque o avatar do chef.", "error")

            return event.preventDefault()
        }

        return message("Operação realizada com sucesso!", "succes")
    },
    allFieldsUser(event) {
        const name = document.querySelector('input[name="name"')
        const email = document.querySelector(' input[name="email"]')
        const password = document.querySelector(' input[name="password"]')

        if (email && password) {

            if (email.value == "" || password.value == "") {
                message("Por favor, preencha os campos que faltam.", "error")
                return event.preventDefault()
            }
        }

        if (name.value == "" || email.value == "") {
            message("Por favor, preencha os campos que faltam.", "error")
            return event.preventDefault()
        }
    },
    allResetPasswordFields(event){
        const email = document.querySelector(' input[type="email"]')
        const password = document.querySelector(' input[type="password"]')
        const passwordRepeat = document.querySelector('input[name="passwordRepeat"]')

        if(email.value == ""){
            message("Por favor, coloque o seu email.", "error")
            return event.preventDefault()
        }

        if(email.value == "" || password.value == "" || passwordRepeat.value == ""){
            message("Por favor, preencha os campos que faltam.", "error")
            return event.preventDefault()
        }

        if(password.value != passwordRepeat.value){
            message("A senha e a repetição da senha não são iguais.", "error")
            return event.preventDefault()
        }
    }
}

function deleteSomething(event) {
    const forms = document.querySelectorAll("form")

    const confirmation = confirm("Deseja deletar ?")
    if (!confirmation) return event.preventDefault()

    for (form of forms) {
        if (form.action.includes("DELETE") && confirmation) {

            return message("Deletado com sucesso!", "error")
        }
    }
}

