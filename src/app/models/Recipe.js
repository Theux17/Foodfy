const db = require('../../config/db')
const { date } = require("../../lib/utils")

module.exports = {
    async all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC `)

    },
    async create(data) {
        const query = `
            INSERT INTO recipes(
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id 
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    async find(id){
        return db.query(`
        SELECT recipes. *, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id )
        WHERE recipes.id = $1`, [ id ] )
    },
    chefsAll(id, callback){

        db.query(`
        SELECT chefs.name AS chef_name
        FROM chefs
        WHERE id = $1`, [ id ] ,function(err, results){
            if (err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
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

    async update(data){
        const query = ` 
            UPDATE recipes SET 
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
            WHERE id = $6
        `
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values )
    },
    async delete(id){
        return db.query(`DELETE FROM recipes WHERE id = $1`, [ id ])

    },
    async chefsSelectOptions (){
        return db.query(`SELECT name, id FROM chefs`)
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

    async files(id) {
        return db.query(`
        SELECT * 
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
    `, [id])},

    async deleteDataToRecipeFiles(id){
        return db.query(`
            DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id])
    },

    async deleteAllOfRecipeFiles(id){
        return db.query(`
            DELETE FROM recipe_files WHERE recipe_files.recipe_id = $1`, [id])
    }
  
    
}