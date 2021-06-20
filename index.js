const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const routerUser = require('./routers/users.js')
const routerTodo = require('./routers/todos.js')
const auth = require('./middleware/auth.js')
const app = express()

const corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use('/todo', auth, routerTodo)
app.use('/user', routerUser)

app.listen(3000, () => {
    console.log('Server working on port 3000')
})