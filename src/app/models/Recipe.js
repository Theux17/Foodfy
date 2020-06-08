const db = require('../../config/db')
const { date } = require("../../lib/utils")

module.exports = {
    all(callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY title ASC `, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })

    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes(
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id 
        `

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])

        })
    },
    find(id, callback){
        db.query(`
        SELECT recipes. *, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id )
        WHERE recipes.id = $1`, [ id ], function(err, results){
            if (err) throw `Database Error! ${err}`
            
            callback(results.rows[0])
        })
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
    findBy(filter, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%'
        `, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    update(data, callback){
        const query = ` 
            UPDATE recipes SET 
            chef_id=($1),
            image=($2),
            title=($3),
            ingredients=($4),
            preparation=($5),
            information=($6)
            WHERE id = $7
        `
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results){
            if (err) throw `Database Error! ${err}`
            
            callback(results.rows)            
        })

    },
    delete(id, callback){
        db.query(`DELETE FROM recipes WHERE id = $1`, [ id ], function(err, results){
            if (err) throw `Database Error! ${err}`
            callback()            
        })

    },
    chefsSelectOptions (callback){
        db.query(`SELECT name, id FROM chefs`, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    paginate(params){
        const { limit, offset, callback } = params

        let query = "",
        totalQuery = "(SELECT count(*) FROM recipes) AS total"

        query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY title ASC 
        LIMIT $1 OFFSET $2
        `
        
        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}