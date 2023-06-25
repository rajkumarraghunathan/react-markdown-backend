require('dotenv').config();
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./Connect/db')
const routes = require('./Route/route')
const userRoutes = require('./Route/userRoutes')
const app = express()


//Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'https://lighthearted-toffee-fb9353.netlify.app',
    credentials: true,
}))



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
});



//DB connection
db();

const port = process.env.port || 8000


app.get('/', (req, res) => {
    res.send("Hello Brothers & Sisters")
})

app.use(routes)
app.use(userRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})