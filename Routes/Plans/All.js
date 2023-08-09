const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();

const Plans = require('../../Models/Plans');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const Request = async (req) => {
    try {
        const Data = await Plans.find({});
        return { status: 200, data: Data };
    } catch {
        return {  status: 400, message: "Plans Error! Something's not right!"  }
    }
};

router.get('/', async (req, res) => {
    const data = await Request(req);
    res.status(data.status).json(data);
});

module.exports = router;