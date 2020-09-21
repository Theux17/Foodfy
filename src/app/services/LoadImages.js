async function getAllImages(Model, table, column, array) {
    try {

        const filesPromise = array.map(result => Model.files(`${table}`, `${column}`, result.id))
        results = await Promise.all(filesPromise)

        let image = results.map(result => result.rows[0])
        image = image.map(file => ({
            ...file,
            src: `${file.path.replace("public", "")}`

        }))

        return image
    } catch (error) {
        console.log(error)
    }
}

async function getSomeImages(Model, table, column, id) {
    try {

        let recipesImages = await Model.files(`${table}`, `${column}`, id)
        recipesImages = recipesImages.rows
        recipesImages = recipesImages.map(file => ({
            ...file,
            src: `${file.path.replace("public", "")}`

        }))

        return recipesImages
    } catch (error) {
        console.log(error)
    }
}

module.exports = { getAllImages, getSomeImages } 