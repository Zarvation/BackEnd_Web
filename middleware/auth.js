var mysql = require('mysql')
const bcrypt = require('bcrypt')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_dev'
})

conn.connect(function (err) {
    if (err)
        throw err
})

module.exports = function (req, res, next) {
    const username = req.headers.username
    const password = req.headers.password

    const query = `SELECT * FROM users WHERE username =\'${username}\'`
    conn.query(query, async (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        if (table.length > 0) {
            const compResult = await bcrypt.compare(password, table[0].password)
            if (compResult) {
                next()
            }
            else {
                res.send(401)
            }
        }
        else {
            res.send(401)
        }
    })
}