const { Pool } = require('pg')

module.exports = new Pool ({
    user: "postgres",
    password: "puyolsilva17",
    host: "localhost",
    port: 5432,
    database: "foodfy"
})