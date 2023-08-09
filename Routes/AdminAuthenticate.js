const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Admins = require('../Models/Admins');

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const Request = async (req) => {
    try {
        // Check for Headers
        if (!req.is("application/json") || !req.body || !req.body.username || !req.body.password) {
            const Error = { status: 400, message: "Invalid Headers/Input" };
            return Error;
        }

        const findAdmin = await Admins.findOne({username: req.body.username});

        const compare = bcrypt.compareSync(req.body.password, findAdmin.password);

        if (!compare) {
            const Error = { status: 400, message: "Invalid Credentials" };
            return Error;
        }

        const token = jwt.sign({ id: findAdmin._id, username: findAdmin.username, firstName: findAdmin.firstName, lastName: findAdmin.lastName }, process.env.ADMINTOKEN);
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