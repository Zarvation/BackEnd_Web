const express = require('express')
var mysql = require('mysql')
const router = express.Router()

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

//router.get('/', function (req, res) {
//    res.send(`
//        <form method="post" action="/todo">
//            <input name="name"/>
//            <input type="submit" value="Insert"/>
//        </form>
//    `)
//})
router.post('/', function (req, res) {
    const sql = `INSERT INTO items (name) VALUES (\'${req.body.name}\')`
    conn.query(sql, function (err) {
        if (err)
            throw err
        console.log('Data Inserted')
    })
    res.end()
})

router.get('/', function (req, res) {
    const sql = 'SELECT * FROM items'
    conn.query(sql, function (err, result) {
        if (err)
            throw err
        res.send(result)
        console.log(result)
    })
})

router.delete('/:name', function (req, res) {
    const query = `DELETE FROM items WHERE name=\'${req.params.name}\'`
    conn.query(query, function (err, result) {
        if (err)
            throw err
        res.send("Data Deleted")
    })
})

module.exports = router