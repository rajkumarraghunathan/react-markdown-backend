const mongoose = require('mongoose')

const content = new mongoose.Schema({
    content: {
        type: String
    },
    userEmail: {
        type: String
    }

})

module.exports = mongoose.model('Content', content)