require('dotenv').config()
const Dean = require('../models/Dean')
const bcrypt = require('bcryptjs')
const JWT_SECRET = process.env.JWT_SECRET_KEY
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const createDean = async (req, res) => {
    try {
        const { name, email, pass } = req.body
        const alreadyExist = await Dean.findOne({ name: name, email: email })
        if (alreadyExist) {
            return res.json({ success: false, message: 'E-Mail already taken' })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(pass, salt)
        const dean = await Dean.create({
            dean_id: uuid.v4(),
            name: name,
            email: email,
            pass: secPass,
        })
        if (!dean) {
            return res.json({
                success: false,
                message: 'Error creating account',
            })
        }
        res.json({ success: true, message: 'Account created successfully' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Internal Server Error Occured' })
    }
}

const loginDean = async (req, res) => {
    try {
        const { dean_id, pass } = req.body
        const dean = await Dean.findOne({ dean_id })
        if (!dean) {
            return res.json({ success: false, message: 'Account does not exist.' })
        }
        const matchpass = await bcrypt.compare(pass, dean.pass)
        if (!matchpass) {
            return res.json({ success: false, message: 'pass doesnot matches' })
        }
        const data = {
            dean: {
                dean_id: dean.dean_id,
            },
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({
            success: true,
            message: 'Login Successfully',
            token: authToken,
        })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Internal Server Error Occured' })
    }
}

const getDean = async (req, res) => {
    try {
        const id = req.dean.dean_id
        const dean = await Dean.findOne({ dean_id: id }).select('-pass')
        if (!dean) {
            return res.json({ success: false, message: 'No dean found' })
        }
        res.json({ success: true, message: 'Dean details found', data: dean })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Internal server error occurred.' })
    }
}
module.exports = { createDean, loginDean, getDean }
