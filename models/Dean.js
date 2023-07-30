const mongoose = require('mongoose')

const deanSchema = mongoose.Schema(
    {
        dean_id: { type: String, required: true },
        name: { type: String, required: true },
        pass: { type: String, required: true },
        email: { type: String, required: true },
    },
    { timestamps: true }
);

const Dean = mongoose.model("dean", deanSchema);
Dean.createIndexes();
module.exports = Dean;
// export default Dean;
