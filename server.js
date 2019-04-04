require('./models/db')

const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const bodyparser = require('body-parser')
const employeeController = require('./controllers/employeeController')
const genericRoutesController = require('./controllers/genericRoutesController')
const app = express()

app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(bodyparser.json())

app.set('views', path.join(__dirname, '/views/'))

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/'
}))

app.set('view engine', 'hbs')

app.listen(3000, () => {
    console.log('Express server started at port: 3000')
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', genericRoutesController)

app.use('/employee', employeeController)