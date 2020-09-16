const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,

    async all() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id `)
    },

    async find(id) {

        return db.query(`
        SELECT chefs. *, count(recipes) AS total_recipes 
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1 
        GROUP BY chefs.id `, [id])
    },
    
}