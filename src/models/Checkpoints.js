//mongo schema for stored data in db. the amount of entries and the name of entries will be compared
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postedStopSchema = new Schema({
    county: {
        type: String
    },
    city: {
        type: String
    },
    location: {
        type: String
    },
    date: {
        type: String
    }
});

const checkPointSchema = new Schema({
    amount: {
        type: Number
    },
    postedStops: {
        type: [postedStopSchema],
        required: true
    }
});

module.exports = mongoose.model('Checkpoints', checkPointSchema);
