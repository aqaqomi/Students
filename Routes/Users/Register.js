const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {Telegraf} = require('telegraf');
dotenv.config();
const bot = new Telegraf(process.env.BOTTOKEN);
const moment = require('jalali-moment');

const Users = require('../../Models/Users');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function unixTimestamp () {  
    return Math.floor(Date.now())
}

const sendToTelegram = async (mobile) => {
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 کاربر جدید\n🔸 یک کاربر جدید با شماره‌ی ${mobile} ثبت نام کرد\\.\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};

const AddNewUser = async (req, body) => {
    // Check for Headers
    if (!req.is("application/json")) {
        const Error = { status: 400, message: "Invalid Headers" };
        return Error;
    }

    // Check Body for required fields.
    if (!body.mobile || !body.password) {
        const Error = { status: 400, message: "Invalid Mobile/Password" };
        return Error;
    }

    // Find Dups
    const findDups = await Users.findOne({mobile: body.mobile});
    if (findDups) {
        const Error = { status: 400, message: "A user with this number exists!" };
        return Error;
    } else {
        const data = new Users({
            mobile: body.mobile,
            password: bcrypt.hashSync(body.password, Number(process.env.SALT))
        });
        const newData = await data.save();
        sendToTelegram(newData.mobile);
        return { status: 201, data: newData };
    }
};

router.post('/', async (req, res) => {
    const data = await AddNewUser(req, req.body);
    res.status(data.status).json(data);
});

module.exports = router;