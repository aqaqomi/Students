const dotenv = require('dotenv');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();
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
    await bot.telegram.sendMessage(process.env.CHANNELID, `📢 پیام سیستمی: \n\n🔹 حذف برنامه\n🔸 برنامه ${data} از سیستم حذف شد\\.\n\n\n🗓 زمان ارسال: ${moment(unixTimestamp()).locale('fa').format('YYYY/M/D HH:m')}\n\nاتمام پیام`, { parse_mode: 'MarkdownV2' })
    .then(response => console.log("Message Sent To Telegram!"))
    .catch(err => console.log('Error Sending Message to Telegram!'));
};


const Request = async (req) => {
    try {
        // Check for Headers
        if (!req.is("application/json")) {
            const Error = { status: 400, message: "Invalid Headers or Input" };
            return Error;
        }

        // Check Body for required fields.
        if (!req.body || !req.body.name) {
            const Error = { status: 400, message: "Invalid Headers or Input" };
            return Error;
        }
        const findPlanFile = await Plans.findOne({name: req.body.name});
        console.log(findPlanFile)
        if (findPlanFile.fileName && fs.existsSync(findPlanFile.fileName)) {
            fs.unlinkSync(findPlanFile.fileName);
        } 

        const PlanToDelete = await Plans.findOneAndRemove({name: req.body.name});
        sendToTelegram(PlanToDelete.name);
        return { status: 200, data: PlanToDelete };
    } catch {
        return {  status: 400, message: "Plans Error! Something's not right!"  }
    }
};

router.post('/', async (req, res) => {
    const data = await Request(req);
    res.status(data.status).json(data);
});

module.exports = router;