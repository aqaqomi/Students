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

const sendToTelegram = async (username) => {
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 بروزرسانی ادمین\n🔸 ادمین با نام کاربری ${username}، رمز عبور خود را تغییر داد\\.\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
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
    if (!body.username || !body.password || !body.newPassword || !body.newPasswordRepeat) {
        const Error = { status: 400, message: "Invalid Input" };
        return Error;
    }
    try {
        const findUser = await Admins.findOne({ username: body.username });
        const compare = bcrypt.compareSync(body.password, findUser.password);
        if (!compare) {
            const Error = { status: 400, message: "Password not match!" };
            return Error;
        }
        if (body.newPassword !== body.newPasswordRepeat) {
            const Error = { status: 400, message: "Input passwords are not the same!" };
            return Error;
        }
        const User = await Admins.findOneAndUpdate({username: body.username}, {password: bcrypt.hashSync(body.newPassword, Number(process.env.SALT))},{returnOriginal: false})
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