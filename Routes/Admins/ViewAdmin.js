const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();

const Admins = require('../../Models/Admins');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const GetAdmin = async (req) => {
    try {
        // Check for Headers
        if (!req.is("application/json")) {
            const Error = { status: 400, message: "Invalid Headers or Input" };
            return Error;
        }

        // Check Body for required fields.
        if (!req.body || !req.body.username) {
            const Error = { status: 400, message: "Invalid Headers or Input" };
            return Error;
        }
        const AnAdmin = await Admins.findOne({username: req.body.username});
        return { status: 200, data: AnAdmin };
    } catch {
        return {  status: 400, message: "Admins Error! Something's not right!"  }
    }
};

router.post('/', async (req, res) => {
    const data = await GetAdmin(req);
    res.status(data.status).json(data);
});

module.exports = router;
