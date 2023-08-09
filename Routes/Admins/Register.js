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
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 ادمین جدید ${username}\n🔸 یک ادمین جدید به نام ${firstName} ${lastName} ایجاد شد\\.\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};

const AddNewAdmin = async (req, body) => {
    // Check for Headers
    if (!req.is("application/json")) {
        const Error = { status: 400, message: "Invalid Headers" };
        return Error;
    }

    // Check Body for required fields.
    if (!body.username || !body.password) {
        const Error = { status: 400, message: "Invalid Username/Password" };
        return Error;
    }

    // Find Dups
    const findDups = await Admins.findOne({username: body.username});
    if (findDups) {
        const Error = { status: 400, message: "An admin with this username Exists!" };
        return Error;
    } else {
        const data = new Admins({
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            password: bcrypt.hashSync(body.password, Number(process.env.SALT))
        });
        const newData = await data.save();
        sendToTelegram(newData.username, newData.firstName, newData.lastName);
        return { status: 201, data: newData };
    }
};

router.post('/', async (req, res) => {
    const data = await AddNewAdmin(req, req.body);
    res.status(data.status).json(data);
});

module.exports = router;