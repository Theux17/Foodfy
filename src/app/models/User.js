
const db = require('../../config/db')
const Base = require('../models/Base')

Base.init({ table: 'users' })

module.exports = {
 
    ...Base,
    
    async userRecipes(userId, params){
        const { limit, offset } = params

        let query = ""

        query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN users ON (users.id = recipes.user_id)
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE users.id = $1
            ORDER BY created_at ASC
            LIMIT $2 OFFSET $3
        `

        return db.query(query, [ userId, limit, offset ])

        
    },
    totalRecipes(userId) {
        return db.query(`
            SELECT users.*, count (recipes) AS total
            FROM users
            LEFT JOIN recipes ON (users.id = recipes.user_id)
            WHERE users.id = $1
            GROUP BY users.id
        `, [userId])
    }
}