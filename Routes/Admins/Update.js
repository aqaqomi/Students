const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {Telegraf} = require('telegraf');
dotenv.config();
const bot = new Telegraf(process.env.BOTTOKEN);
const moment = require('jalali-moment');

const Admins = require('../../Models/Admins');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function unixTimestamp () {  
    return Math.floor(Date.now())
}

const sendToTelegram = async (username, firstName, lastName) => {
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 بروزرسانی ادمین\n🔸 ادمین با نام کاربری ${username}، نام و نام خانوادگی خود را بروزرسانی نمود\\.\n\nنام: ${firstName}\nنام خانوادگی: ${lastName}\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};

const UpdateAdmin = async (req, body) => {
    // Check for Headers
    if (!req.is("application/json")) {
        const Error = { status: 400, message: "Invalid Headers" };
        return Error;
    }

    // Check Body for required fields.
    if (!body.username || !body.firstName || !body.lastName) {
        const Error = { status: 400, message: "Invalid Input" };
        return Error;
    }
    try {
        const User = await Admins.findOneAndUpdate({username: body.username}, {firstName: body.firstName, lastName: body.lastName},{returnOriginal: false})
        sendToTelegram(User.username, User.firstName, User.lastName);
        return { status: 200, data: User };
    } catch {
        return {  status: 400, message: "No Updates! Something's not right!"  }
    }
};

router.put('/', async (req, res) => {
    const data = await UpdateAdmin(req, req.body);
    res.status(data.status).json(data);
});

module.exports = router;