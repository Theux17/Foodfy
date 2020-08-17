const db = require('../../config/db')

module.exports = {
    create(data) {
        const query =
        ` INSERT INTO users (
            name,
            email,
            password,
            reset_token,
            reset_token_expires,
            is_admin,
            created_at
        ) VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.name,
            data.email,
            data.password,
            data.reset_token,
            data.reset_token_expires,
            data.is_admin || false,
            date(Date.now())
        ]

        return db.query(query, values)
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
    }
}