// conn.js
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

(async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/registration_form", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connection Successful`);
    } catch (error) {
        console.error(`MongoDB Connection Failed`, error);
    }
})();


