const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
dotenv.config();

const Admins = require('../../Models/Admins');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const GetAdmins = async (req) => {
    try {
        const AllAdmins = await Admins.find({});
        return { status: 200, data: AllAdmins };
    } catch {
        return {  status: 400, message: "Admins Error! Something's not right!"  }
    }
};

router.get('/', async (req, res) => {
    const data = await GetAdmins(req);
    res.status(data.status).json(data);
});

module.exports = router;