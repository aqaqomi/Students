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
    console.log(data);
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 برنامه جدید\n🔸 یک برنامه جدید با نام ${data.name} ایجاد شد\\.\n\nپایه: ${data.paye}\n\nرشته: ${data.reshte}\n\nمدت: ${data.durationDays}\n\nطرح: ${data.level}\n\nقیمت: ${data.price}\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
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
    if (!req.body.name || !req.body.paye || !req.body.reshte || !req.body.durationDays || !req.body.level || !req.body.fileName || !req.body.price) {
        const Error = { status: 400, message: "Invalid input content!" };
        return Error;
    }

    // Find Dups
    const findDups = await Plans.findOne({name: req.body.name});
    if (findDups) {
        const Error = { status: 400, message: "A plan with this name exists!" };
        return Error;
    } else {
        const data = new Plans({
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
        });
        const newData = await data.save();
        sendToTelegram(newData);
        return { status: 201, data: newData };
    }
};

router.post('/', async (req, res) => {
    const data = await AddNewPlan(req);
    res.status(data.status).json(data);
});

module.exports = router;