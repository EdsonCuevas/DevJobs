const mongoose = require('mongoose')
require('./config/db.js')

const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path')
const router = require('./routes/index.js')
require('dotenv').config({ path: 'variables.env' })
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const createError = require('http-errors')
const passport = require('./config/passport.js')

const app = express()

// Habilitar bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Validacion de campos
app.use(expressValidator())

// Habilitar handlebars como view
app.engine('handlebars',
    exphbs.engine({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
)
app.set('view engine', 'handlebars')

// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser())
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE,
        mongooseConnection: mongoose.connection
    })
}));

// Inicializar passport
app.use(passport.initialize())
app.use(passport.session())

// Alertas y flash messages
app.use(flash())

// Crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash()
    next()
})


app.use('/', router())

// 404 Pagina no existente
app.use((req, res, next) => {
    next(createError(404, 'No Encontrado'))
})

// Administracion de los errores
app.use((error, req, res) => {
    res.locals.mensaje = error.message
    const status = error.status || 500
    res.locals.status = status
    res.status(status)

    res.render('error')
})

// Dejar que heroku asigne el puerto
const host = '0.0.0.0'
const port = process.env.PORT

app.listen(port, host, () => {
    console.log('El server esta corriendo')
})