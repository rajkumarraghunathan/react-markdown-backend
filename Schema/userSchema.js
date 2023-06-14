const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true
    },
    hashPassword: {
        type: String,
        require: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
})

module.exports = mongoose.model('User', userSchema)