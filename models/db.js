const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/EmployeeDB', { 
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log('Connected successfull.')
    } else {
        console.log('Error to connected > ', err)
    }
})

require('./employeeModel');