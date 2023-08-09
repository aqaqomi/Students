const mongoose = require('mongoose');
const unixTimestamp = require('mongoose-unix-timestamp');

const OrdersSchema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    plan: {type: mongoose.Schema.Types.ObjectId, ref: 'Plans'},
    invoice: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoices'},
});

OrdersSchema.plugin(unixTimestamp);
const Orders = mongoose.model('Orders', OrdersSchema);
module.exports = Orders;