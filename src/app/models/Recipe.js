const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    
    async all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC `)

    },

    async findBy(filter){
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY updated_at DESC
        `)
    },

    async chefsSelectOptions(){
        return db.query(` SELECT name, id FROM chefs`)
    },

    async paginate(params){
        const { limit, offset } = params

        let query = "",
        totalQuery = "(SELECT count(*) FROM recipes) AS total"

        query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        `
        
        return db.query(query, [limit, offset])
    },

    async sendDataToRecipeFiles({ recipeId, fileId }) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) 
            VALUES($1, $2)
            RETURNING id`
        
            const value = [
            recipeId,
            fileId
        ]

        return db.query(query, value)
    },

    async deleteDataToRecipeFiles(id){
        return db.query(`
            DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id])
    },

    async deleteAllOfRecipeFiles(id){
        return db.query(`
            DELETE FROM recipe_files WHERE recipe_files.recipe_id = $1`, [id])
    }

    
}