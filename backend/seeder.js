require('dotenv').config();
const mongoose = require('mongoose');
const College = require('./models/College');

const colleges = [
    { name: 'Indian Institute of Technology Bombay', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi' },
    { name: 'National Institute of Technology Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { name: 'Birla Institute of Technology and Science', city: 'Pilani', state: 'Rajasthan' },
    { name: 'Vellore Institute of Technology', city: 'Vellore', state: 'Tamil Nadu' }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-confession');
        await College.deleteMany();
        console.log('Colleges deleted');

        await College.insertMany(colleges);
        console.log('Colleges seeded successfully');

        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

seedData();
