const db = require('../../config/db')
const { date } = require("../../lib/utils")

module.exports = {
    async all() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id `)

    },
    async create(name, fileId) {


        const query = `
            INSERT INTO chefs(
                name,
                file_id,
                created_at
            ) VALUES($1, $2, $3)
            RETURNING id 
            `

        const values = [
            name,
            fileId,
            date(Date.now()).iso
        ]

        return db.query(query, values)

    },
    async find(id) {

        return db.query(`
        SELECT chefs. *, count(recipes) AS total_recipes 
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1 
        GROUP BY chefs.id `, [id])
    },

    async recipesAll(id) {

        return db.query(`
        SELECT *
        FROM recipes
        WHERE recipes.chef_id = $1
        ORDER BY created_at DESC
        `, [id])
    },

    async update({name, fileId, id}) {

        const query = ` 
        UPDATE chefs SET 
            name=($1),
            file_id=($2)
            WHERE id = $3
        `
        const values = [
            name,
            fileId,
            id
        ]
        
        return db.query(query, values)

    },

    searchByTotalRecipes(total_recipes, callback) {
        db.query(`
        SELECT chefs. *, count(recipes) AS total_recipes 
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.total_recipes = $1
        GROUP BY chefs.id `, [total_recipes], function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    async delete(id) {

        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])

    },

    async files(id) {
        return db.query(`
            SELECT *
            FROM chefs
            LEFT JOIN files ON (files.id = chefs.file_id)
            WHERE chefs.id = $1  
        `, [id])
    },
}