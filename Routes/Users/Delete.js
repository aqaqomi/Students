const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();
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

const sendToTelegram = async (username) => {
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 حذف کاربر\n🔸 نام کاربری ${username} از سیستم حذف شد\\.\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};


const DeleteUser = async (req) => {
    try {
        // Check for Headers
        if (!req.is("application/json")) {
            const Error = { status: 400, message: "Invalid Headers or Input" };
            return Error;
        }

        // Check Body for required fields.
        if (!req.body || !req.body.mobile) {
            const Error = { status: 400, message: "Invalid Headers or Input" };
            return Error;
        }
        const AnAdmin = await Users.findOneAndRemove({mobile: req.body.mobile});
        sendToTelegram(AnAdmin.mobile);
        return { status: 200, data: AnAdmin };
    } catch {
        return {  status: 400, message: "Users Error! Something's not right!"  }
    }
};

router.post('/', async (req, res) => {
    const data = await DeleteUser(req);
    res.status(data.status).json(data);
});

module.exports = router;
