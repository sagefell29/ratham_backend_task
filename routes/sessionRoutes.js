const express = require('express')
const router = express.Router();
const sessionController = require('../controllers/sessionController')
const getStudent = require('../middlewares/getStudent')
const getDean = require('../middlewares/getDean')


router.post('/add', getDean, sessionController.addSession)
router.post('/book', getStudent, sessionController.bookSession)
router.get('/getForDean', getDean, sessionController.getSessionDean)
router.get('/getForStudent', getStudent, sessionController.getSessionStudent)
module.exports = router;