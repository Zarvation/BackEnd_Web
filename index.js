const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const app = express()

const corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_dev'
})

app.use(cors(corsOptions))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

conn.connect(function (err) {
    if (err)
        throw err
})
app.get('/', function (req, res) {
    res.send(`
        <form method="post" action="/todo">
            <input name="name"/>
            <input type="submit" value="Insert"/>
        </form>
    `)
})
app.post('/todo', function (req, res) {
    const sql = `INSERT INTO items (name) VALUES (\'${req.body.name}\')`
    conn.query(sql, function (err) {
        if (err)
            throw err
        console.log('Data Inserted')
    })
    res.end()
})

app.get('/todo', function (req, res) {
    const sql = 'SELECT * FROM items'
    conn.query(sql, function (err, result) {
        if (err)
            throw err
        res.send(result)
        console.log(result)
    })
})

app.delete('/todo/:name', function (req, res) {
    const query = `DELETE FROM items WHERE name=\'${req.params.name}\'`
    conn.query(query, function (err, result) {
        if (err)
            throw err
        res.send("Data Deleted")
    })
})

app.listen(3000, () => {
    console.log('Server working on port 3000')
})