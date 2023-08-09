const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Users = require('../Models/Users');

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const Request = async (req) => {
    try {
        // Check for Headers
        if (!req.is("application/json") || !req.body || !req.body.mobile || !req.body.password) {
            const Error = { status: 400, message: "Invalid Headers/Input" };
            return Error;
        }

        const findAdmin = await Users.findOne({mobile: req.body.mobile});

        const compare = bcrypt.compareSync(req.body.password, findAdmin.password);

        if (!compare) {
            const Error = { status: 400, message: "Invalid Credentials" };
            return Error;
        }

        const token = jwt.sign({ id: findAdmin._id, mobile: findAdmin.mobile, firstName: findAdmin.firstName, lastName: findAdmin.lastName, verified: findAdmin.verified }, process.env.USERTOKEN);
        return { status: 200, message: 'OK', token: token };
    } catch {
        return {  status: 400, message: "Invalid Credentials/Access"  }
    }
};

router.post('/', async (req, res) => {
    const data = await Request(req);
    res.status(data.status).json(data);
});

module.exports = router;