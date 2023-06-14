require('dotenv').config();
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./Connect/db')
const routes = require('./Route/route')
const userRoutes = require('./Route/userRoutes')
const app = express()

app.use(cookieParser())
//Middleware
app.use(express.json());
app.use(cors({ credentials: true }))



//DB connection
db();

const port = 4000 || 8000


app.get('/', (req, res) => {
    res.send("Hello Brothers & Sisters")
})

app.use(routes)
app.use(userRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})