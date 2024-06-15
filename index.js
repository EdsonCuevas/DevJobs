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

app.listen(process.env.PUERTO)