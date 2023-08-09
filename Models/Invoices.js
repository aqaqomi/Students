const mongoose = require('mongoose');
const unixTimestamp = require('mongoose-unix-timestamp');

const InvoicesSchema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    plan: {type: mongoose.Schema.Types.ObjectId, ref: 'Plans'},
    price: {type: Number},
    status: {type: Boolean, default: false},
});

InvoicesSchema.plugin(unixTimestamp);
const Invoices = mongoose.model('Invoices', InvoicesSchema);
module.exports = Invoices;