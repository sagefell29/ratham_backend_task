const express = require('express')
const router = express.Router()
const DeanController = require('../controllers/deanController')
const getDean = require('../middlewares/getDean')

router.post('/registration', DeanController.createDean)
router.post('/login', DeanController.loginDean)
router.get('/get', getDean, DeanController.getDean)

module.exports = router
