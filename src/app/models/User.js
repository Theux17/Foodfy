const crypto = require('crypto')
const fs =  require('fs')

const db = require('../../config/db')
const Recipe =  require('./Recipe')

module.exports = {
    async create(data) {
        const query =
        ` INSERT INTO users (
            name,
            email,
            password,
            reset_token,
            reset_token_expires,
            is_admin
        ) VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const token = crypto.randomBytes(5).toString("hex")

        const values = [
            data.name,
            data.email,
            token,
            data.reset_token,
            data.reset_token_expires,
            data.is_admin || false
        ]

        const results = await db.query(query, values)
        return results.rows[0].id
    },
    allUsers(){
        return db.query('SELECT * FROM users ')
    },
    async findOne(filters){
        let query = "SELECT * FROM users"
        
        Object.keys(filters).map(key => { 
            query = `${query}
                ${key}
            `
            Object.keys(filters[key]).map(field => {
                query = `${query}  ${field} = '${ filters[key][field] }'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length){
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            }else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    },
    async delete(id){
        let results = await db.query("SELECT * FROM recipes WHERE user_id = $1", [id])

        const recipes = results.rows

        const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id ))

        await db.query("DELETE FROM users WHERE id = $1 RETURNING id", [id])

        let promiseResults = await Promise.all(allFilesPromise)
        promiseResults.map(results => {
            results.rows.map(file => fs.unlinkSync(file.path))
        })
    }
}