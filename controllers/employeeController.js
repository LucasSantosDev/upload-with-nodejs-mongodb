const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Employee = mongoose.model('Employee')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'views/employee/logs/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage })

router.get('/create', (req, res) => {
    res.render('employee/addOrEdit', {
        viewTitle: 'Insert Employee'
    })
})

router.post('/store-update', upload.single('logs'), (req, res) => {
    if (req.body._id == '') {
        insertRecord(req, res)
    } else {
        updateRecord(req, res)
    }
})

router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render('employee/list', {
                list: docs
            })
        } else {
            console.log('Error in retrieving employee list: ', err)
        }
    })
})

router.get('/edit/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('employee/addOrEdit', {
                viewTitle: 'Update Employee',
                employee: doc
            })
        } else {
            console.log('Error in retrieving employee: ', err)
        }
    })
})

router.get('/delete/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('employee/delete', {
                viewTitle: 'Delete Employee',
                employee: doc
            })
        } else {
            console.log('Error in retrieving employee: ', err)
        }
    })
})

router.post('/delete', (req, res) => {
    Employee.deleteOne({ _id: req.body._id}, (err, doc) => {
        if (!err) {
            res.redirect('list')
        } else {
            console.log('Error in delete employee: ', err)
        }
    })
})

function insertRecord(req, res) {
    let employee = new Employee()
    employee.fullName = req.body.fullName
    employee.email = req.body.email
    employee.mobile = req.body.mobile
    employee.city = req.body.city
    employee.save((err, doc) => {
        if (!err) {
            res.redirect('list')
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body)
                res.render('employee/addOrEdit', {
                    viewTitle: 'Insert Employee',
                    employee: req.body
                })
            } else {
                console.log('Error during record inserction: ', err)
            }
        }
    })
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('list')
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body)
                res.render('employee/addOrEdit', {
                    viewTitle: 'Update Employee',
                    employee: req.body
                })
            } else {
                console.log('Error during record update: ', err)
            }
        }
    })
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message
            case 'email':
                body['emailError'] = err.errors[field].message
            default:
                break
        }
    }
}

module.exports = router