require('dotenv').config()
const Session = require('../models/Session')
// const bcrypt = require('bcryptjs')
// const JWT_SECRET = process.env.JWT_SECRET_KEY
// const jwt = require('jsonwebtoken')

const addSession = async (req, res) => {
    try {
        const { dean_id, startTime, endTime } = req.body
        const check = Session.findOne({
            dean_id: dean_id,
            start_time: startTime,
        })
        if (check.n == 1) {
            return res.json({
                success: false,
                message: 'Cannot add two slots for same dean at same time.',
            })
        }
        const session = await Session.create({
            dean_id: dean_id,
            start_time: startTime,
            end_time: endTime,
            alloted: false,
            // stu_id: ""
        })
        if (!session) {
            return res.json({
                success: false,
                message: 'Error adding session.',
            })
        }
        res.json({ success: true, message: 'Session added successfully.' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Internal server error occurred.' })
    }
}

const getSessionDean = async (req, res) => {
    try {
        const { dean_id } = req.body
        const sessions = await Session.find({ dean_id: dean_id, alloted: true })
        if (!sessions) {
            return res.json({
                success: false,
                message: 'No alloted sessions found.',
            })
        }
        res.json({
            sucess: true,
            message: 'Session found successfully.',
            data: sessions,
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, messaeg: 'Internal server error occurred.' })
    }
}

const getSessionStudent = async (req, res) => {
    // const {stu_id} = req.body;
    try {
        const sessions = await Session.find({ alloted: false })
        if (!sessions) {
            return res.json({
                success: false,
                message: 'No free sessions.',
            })
        }
        res.json({
            success: true,
            message: 'Sessions found successfully.',
            data: sessions,
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Internal server error occurred.' })
    }
}

const bookSession = async (req, res) => {
    try {
        const { stu_id, dean_id, startTime, endTime } = req.body
        const session = await Session.findOne({
            dean_id: dean_id,
            start_time: startTime,
            end_time: endTime,
            alloted: false,
        })
        if (!session) {
            return res.json({
                success: false,
                message: 'No matching free slots found.',
            })
        }
        await Session.updateOne(
            {
                dean_id: dean_id,
                start_time: startTime,
                end_time: endTime,
                alloted: false,
            },
            { $set: { alloted: true, stu_id: stu_id } }
        )
        const up = await Session.findOne({
            dean_id: dean_id,
            start_time: startTime,
            end_time: endTime,
            alloted: true,
            stu_id: stu_id,
        })
        if (up) {
            return res.json({
                success: true,
                message: 'Row updated successfully.',
            })
        }
        return res.json({ success: false, message: 'Failed to update row.' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Internal server error occurred.' })
    }
}

module.exports = { addSession, getSessionDean, getSessionStudent, bookSession }
