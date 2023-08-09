const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {Telegraf} = require('telegraf');
dotenv.config();
const bot = new Telegraf(process.env.BOTTOKEN);
const moment = require('jalali-moment');

const Plans = require('../../Models/Plans');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function unixTimestamp () {  
    return Math.floor(Date.now())
}

const sendToTelegram = async (data) => {
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 بروزرسانی برنامه \n🔸 برنامه ${data.name} بروزرسانی شد\\.\n\nپایه: ${data.paye}\n\nرشته: ${data.reshte}\n\nمدت: ${data.durationDays}\n\nطرح: ${data.level}\n\nقیمت: ${data.price}\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};

const AddNewPlan = async (req) => {
    // Check for Headers
    if (!req.is("application/json")) {
        const Error = { status: 400, message: "Invalid Headers" };
        return Error;
    }
    
    // Check Body for required fields.
    if (!req.body.currentName || !req.body.name || !req.body.paye || !req.body.reshte || !req.body.durationDays || !req.body.level || !req.body.fileName || !req.body.price) {
        const Error = { status: 400, message: "Invalid input content!" };
        return Error;
    }

    const update = await Plans.findOneAndUpdate({name: req.body.currentName},{
            name: req.body.name,
            description: req.body.description,
            paye: req.body.paye,
            reshte: req.body.reshte,
            durationDays: req.body.durationDays,
            attendedToClasses: req.body.attendedToClasses,
            level: req.body.level,
            fileName: req.body.fileName,
            needInterview: req.body.needInterview,
            price: req.body.price,
    },{returnOriginal: false});
    if (update) {
        sendToTelegram(update);
        return { status: 201, data: update };
    } else {
        const Error = { status: 404, message: "No Plans Found with this name!" };
        return Error;
    }
};

router.put('/', async (req, res) => {
    const data = await AddNewPlan(req);
    res.status(data.status).json(data);
});

module.exports = router;