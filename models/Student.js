const mongoose = require('mongoose')

const studentSchema = mongoose.Schema(
    {
        stu_id: { type: String, required: true },
        name: { type: String, required: true },
        pass: { type: String, required: true },
        email: { type: String, required: true },
    },
    { timestamps: true }
)

const Student = mongoose.model('student', studentSchema)
Student.createIndexes()
module.exports = Student
// export default Student;
