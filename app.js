require('dotenv').config()

const express = require('express');
const app = express()
const cors = require('cors')
const port = 3000
const AuthController = require('./controllers/AuthController')
const verifyToken = require('./middlewares/verifyToken')

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', AuthController.register)

app.post('/login', AuthController.login)

app.get('/dashboard', verifyToken, AuthController.dashboard);

app.post('/logout', verifyToken, AuthController.logout)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})