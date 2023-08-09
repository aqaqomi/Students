const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {Telegraf} = require('telegraf');
dotenv.config();
const bot = new Telegraf(process.env.BOTTOKEN);
const moment = require('jalali-moment');

const Orders = require('../../Models/Orders');
const Invoices = require('../../Models/Invoices');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function unixTimestamp () {  
    return Math.floor(Date.now())
}

const sendToTelegram = async (data) => {
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 سفارش جدید\n🔸 یک سفارش جدید با نام ${data.name} ایجاد شد\\.\n\nپایه: ${data.paye}\n\nرشته: ${data.reshte}\n\nمدت: ${data.durationDays}\n\nطرح: ${data.level}\n\nقیمت: ${data.price}\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};

const NewOrder = async (req,user) => {
    // Check for Headers
    if (!req.is("application/json")) {
        const Error = { status: 400, message: "Invalid Headers" };
        return Error;
    }
    
    // Check Body for required fields.
    if (!user.id || !req.body.plan) {
        const Error = { status: 400, message: "Invalid input content!" };
        return Error;
    }

    const data = new Orders({
        customer: user.id,
        plan: req.body.plan,
    });
    const newInvoice = new Invoices({
        customer: user.id,
        plan: req.body.plan,
        price: data.price,
    });
    const theOrder = await data.save();
    const invoice = await newInvoice.save();
    const Order = await Orders.findByIdAndUpdate(theOrder._id, { invoice: invoice._id } )
    sendToTelegram(Order);
    return { status: 201, data: {Order, invoice} };
};

router.post('/', async (req, res) => {
    const user = req.app.get('user');
    const data = await NewOrder(req, user);
    res.status(data.status).json(data);
});

module.exports = router;