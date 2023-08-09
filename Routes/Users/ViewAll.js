const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();

const Users = require('../../Models/Users');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const GetUsers = async (req) => {
    try {
        const AllUsers = await Users.find({});
        return { status: 200, data: AllUsers };
    } catch {
        return {  status: 400, message: "Users Error! Something's not right!"  }
    }
};

router.get('/', async (req, res) => {
    const data = await GetUsers(req);
    res.status(data.status).json(data);
});

module.exports = router;