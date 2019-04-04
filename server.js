require('./models/db')

const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyparser = require('body-parser')
const employeeController = require('./controllers/employeeController')
const genericRoutesController = require('./controllers/genericRoutesController')
const app = express()

app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(bodyparser.json())

app.set('views', path.join(__dirname, '/views/'))

app.engine('ejs', exphbs({
    extname: 'ejs',
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname + '/views/layouts/'
}))

app.set('view engine', 'ejs')

app.listen(3000, () => {
    console.log('Express server started at port: 3000')
})

app.use('/', genericRoutesController)

app.use('/employee', employeeController)