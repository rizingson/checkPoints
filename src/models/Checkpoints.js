const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkPointSchema = new Schema({
    amount: {
        type: Number
    },
    postedStops: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Checkpoints', checkPointSchema);