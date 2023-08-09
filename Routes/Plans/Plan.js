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
        const ThePlan = await Plans.findOne({name: req.body.name});
        return { status: 200, data: ThePlan };
    } catch {
        return {  status: 400, message: "Plan Error! Something's not right!"  }
    }
};

router.post('/', async (req, res) => {
    const data = await Request(req);
    res.status(data.status).json(data);
});

module.exports = router;
