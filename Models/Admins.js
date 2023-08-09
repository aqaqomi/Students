const mongoose = require('mongoose');
const unixTimestamp = require('mongoose-unix-timestamp');

const AdminsSchema = new mongoose.Schema({
    firstName: {type: String, required: true, default: 'مدیر'},
    lastName: {type: String, required: true, default: 'سیستم'},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

AdminsSchema.plugin(unixTimestamp);
const Admins = mongoose.model('Admins', AdminsSchema);
module.exports = Admins;