const mongoose = require("mongoose")



const authorSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        enum: ["Mrs", "Mr", "Miss"],
        required: true
    },
    email: {
        type: String,
        unique: true,
        match: /.+\@.+\..+/,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},

    { timestamps: true }
)

module.exports = mongoose.model('Author', authorSchema)