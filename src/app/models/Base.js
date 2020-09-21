const db = require('../../config/db')

async function find(filters, table) {
    let query = `SELECT * FROM ${table}`

    if (filters) {

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `
            Object.keys(filters[key]).map(field => {
                query = `${query}  ${field} = '${filters[key][field]}'`
            })
        })
    }

    return db.query(query)
}



const Base = {
    init({ table }) {
        try {
            if (!table) throw Error('Inavalid params')

            this.table = table
            return this

        } catch (error) {
            console.error(error)
        }
    },
    async findAll(filters) {
        const results = await find(filters, this.table)
        return results.rows

    },

    async findOne(filters) {

        const results = await find(filters, this.table)
        return results.rows[0]
    },

    async create(fields) {
        try {
            let keys = [],
                values = []

            Object.keys(fields).map(key => {
                keys.push(key)
                values.push(`'${fields[key]}'`)
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
            VALUES(${values.join(',')})
            RETURNING id
            `

            const results = await db.query(query)
            return results.rows[0].id

        } catch (error) {
            console.error(error)
        }
    },

    async update(id, fields) {
        try {

            let update = []

            Object.keys(fields).map(key => {
                const line = `${key} = '${fields[key]}'`
                update.push(line)
            })

            let query = `UPDATE ${this.table} SET 
                ${update.join(',')} WHERE id = ${id}
            `

            return db.query(query)
        } catch (error) {
            console.error(error)
        }
    },

    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
    },

    async files(table, column, id, ) {
        try {
            const query = `
            SELECT * 
            FROM ${table}
            LEFT JOIN files ON (${table}.file_id = files.id)
            WHERE ${table}.${column} = ${id}
            `
         
            return db.query(query)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Base