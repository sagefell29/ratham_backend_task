const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema(
    {
        stu_id: { type: String },
        dean_id: { type: String, required: true },
        start_time: { type: Date, required: true },
        end_time: { type: Date, required: true },
        alloted: { type: Boolean, required: true },
    },
    { timestamps: true }
)

const Session = mongoose.model('session', sessionSchema)
Session.createIndexes()
module.exports = Session;
// export default Session
