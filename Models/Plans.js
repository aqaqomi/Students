const mongoose = require('mongoose');
const unixTimestamp = require('mongoose-unix-timestamp');

const PlansSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    paye: {type: Number, require: true},
    reshte: {type: String, require: true},
    durationDays: {type: Number, require: true},
    attendedToClasses: {type: Boolean, require: true, default: false},
    level: {type: String, require: true},
    fileName: {type: String, require: true},
    needInterview: {type: Boolean, require: true, default: false},
    interviewQuestion: {type: Array},
    price: {type: Number, require: true}
});

PlansSchema.plugin(unixTimestamp);
const Plans = mongoose.model('Plans', PlansSchema);
module.exports = Plans;