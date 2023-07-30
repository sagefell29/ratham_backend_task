const express = require('express')
const router = express.Router()
const StudentController = require('../controllers/studentController')
const getStudent = require('../middlewares/getStudent')

router.post('/registration', StudentController.createStudent)
router.post('/login', StudentController.loginStudent)
router.get('/get', getStudent, StudentController.getStudent)

module.exports = router;
