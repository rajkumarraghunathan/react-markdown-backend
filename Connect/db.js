const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('DB connection established.')
    } catch (error) {
        console.log(`DB connectivity error=${error}`);
    }
}

module.exports = db;