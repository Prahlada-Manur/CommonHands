const mongoose = require('mongoose');
async function configDb() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Database is Connected');

    } catch (err) {
        console.log('Error connecting the databse', err.message);
    }
}
module.exports = configDb