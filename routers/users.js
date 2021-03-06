const express = require('express')
var mysql = require('mysql')
const router = express.Router()
const auth = require('../middleware/auth.js')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.use(express.json())
router.use(express.urlencoded())

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

router.get('/', (req, res, next) => {
    const query = `SELECT * FROM users`
    conn.query(query, (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        if (table.length > 0) {
            auth(req, res, next)
        }
        else {
            next()
        }
    })
}, function (req, res) {
    res.send(`
        <html>
            <form action="/user" method="POST">
                <label>Username</label>
                <input name = "username"></input>
                <label>Password</label>
                <input name = "password" type = "password"></input>
                <button>Submit</button>
            </form>
        </html>
    `)
})

router.post('/', (req, res, next) => {
    const query = `SELECT * FROM users`
    conn.query(query, (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        if (table.length > 0) {
            auth(req, res, next)
        }
        else {
            next()
        }
    })
}, (req, res, next) => {
    const query = `SELECT * FROM users WHERE username=\'${req.body.username}\'`
    conn.query(query, (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        if (table.length > 0) {
            res.sendStatus(401)
        }
        else {
            next()
        }
    })
}, async (req, res) => {
    const hash = await bcrypt.hashSync(req.body.password, saltRounds)
    console.log('Got body:', req.body)
    conn.query(`INSERT INTO users (username, password) VALUES (\'${req.body.username}\', \'${hash}\')`, function (err, rows, fields) {
        if (err) throw err

        console.log('Data insert successful')
    })

    res.sendStatus(200)
})

router.get('/users', auth, function (req, res) {
    const query = 'SELECT * FROM users'
    conn.query(query, (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        for (let row of table) {
            console.log(row.id)
        }

        res.json(table)
    })
})

router.delete('/:id', auth, (req, res, next) => {
    const query = `SELECT * FROM users`
    conn.query(query, (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        if (table.length > 1) {
            next()
        }
        else {
            res.sendStatus(401)
        }
    })
}, function (req, res) {
    const query = `DELETE FROM users WHERE id=\'${req.params.id}\'`
    conn.query(query, (err, table) => {
        if (err) {
            console.error(err)
            return
        }
        res.send("Berhasil dihapus")
    })
})

module.exports = router