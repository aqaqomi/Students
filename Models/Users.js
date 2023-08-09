const mongoose = require('mongoose');
const unixTimestamp = require('mongoose-unix-timestamp');

const UsersSchema = new mongoose.Schema({
    mobile: {type: Number, unique: true, require: true},
    password: {type: String, require: true},
    firstName: {type: String},
    lastName: {type: String},
    verified: {type: Boolean, default: false}
});

UsersSchema.plugin(unixTimestamp);
const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;