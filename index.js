const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path')
const router = require('./routes/index.js')
require('dotenv').config({ path: 'variables.env' })

const app = express()

// Habilitar handlebars como view
app.engine('handlebars',
    exphbs.engine({
        defaultLayout: 'layout'
    })
)
app.set('view engine', 'handlebars')

// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router())

app.listen(process.env.PUERTO)