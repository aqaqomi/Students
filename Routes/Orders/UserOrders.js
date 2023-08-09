const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();

const Orders = require('../../Models/Orders');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const Request = async (req) => {
    try {
        let paid = [];
        let unpaid = [];
        const user = req.app.get('user');
        const orders = await Orders.find({customer: user.id}).populate('plan').populate('customer', {password: 0}).populate('invoice');
        orders.forEach((order) => {
            if (!order.invoice.status) {
                order.plan.fileName = "";
                unpaid.push(order);
            } else {
                delete order;
                //order.plan.fileName = order.plan.fileName;
                //paid.push(order);
            }
            return order;
        });

        const orders2 = await Orders.find({customer: user.id}).populate('plan').populate('customer', {password: 0}).populate('invoice');
        orders2.forEach((order) => {
            if (order.invoice.status) {
                paid.push(order);
            } else {
                delete order;
            }
            return order;
        });
        return { status: 200, unpaid, paid };
    } catch {
        return {  status: 400, message: "Orders Error! Something's not right!"  }
    }
};

router.get('/', async (req, res) => {
    const data = await Request(req);
    res.status(data.status).json(data);
});

module.exports = router;