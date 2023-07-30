require('dotenv').config()
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const JWT_SECRET = process.env.JWT_SECRET_KEY
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const createStudent = async (req, res) => {
    try {
        const { name, pass, email } = req.body;
        const alreadyExist = await Student.findOne({ email: email })
        if (alreadyExist) {
            return res.json({
                succcess: false,
                message: 'E-Mail already taken.',
            })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(pass, salt);
        // console.log(typeof uuid.v4)
        const newstudent = await Student.create({
            stu_id: uuid.v4(),
            email: email,
            name: name,
            pass: secPass,
        })

        if (!newstudent) {
            return res.json({
                success: false,
                message: 'Error creating acount',
            })
        }
        res.json({ success: true, message: 'Account created successfuly.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Internal Server Error Occured' })
    }
}

const loginStudent = async (req, res) => {
    try {
        const { stu_id, pass } = req.body
        const student = await Student.findOne({ stu_id: stu_id })
        if (!student) {
            return res.json({ success: false, message: 'Account does not exist.' })
        }
        const matchPass = await bcrypt.compare(pass, student.pass)
        if (!matchPass) {
            return res.json({
                success: false,
                message: 'Password does not match.',
            })
        }
        const data = {
            student: {
                stu_id: student.stu_id,
            },
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({
            success: true,
            message: 'Logged in Successfully',
            token: authToken,
        })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Internal Server Error Occured' })
    }
}

const getStudent = async (req, res) => {
    try {
        const stu_id = req.student.stu_id
        const student = await Student.findOne({ stu_id: stu_id }).select(
            '-pass'
        )
        if (!student) {
            return res.json({ success: false, message: 'No student found.' })
        }
        res.json({
            success: true,
            message: 'Student details found',
            data: student,
        })
    } catch (error) {
        res.json({ success: false, message: 'Internal server error occurred.' })
    }
}

module.exports = { createStudent, loginStudent, getStudent }
