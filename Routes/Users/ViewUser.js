const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();

const Users = require('../../Models/Users');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const GetUser = async (req) => {
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
        const AnAdmin = await Users.findOne({mobile: req.body.mobile});
        return { status: 200, data: AnAdmin };
    } catch {
        return {  status: 400, message: "Users Error! Something's not right!"  }
    }
};

router.post('/', async (req, res) => {
    const data = await GetUser(req);
    res.status(data.status).json(data);
});

module.exports = router;
