const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');
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

router.post('/', async (req, res) => {
    console.log(req.body.id);
    console.log(req.body.order_id);
    await axios.post('https://api.idpay.ir/v1.1/payment/verify', {id: req.body.id, order_id: req.body.order_id}, {headers: { 'Content-Type': 'application/json', 'X-API-KEY': process.env.IDPAYKEY, 'X-SANDBOX': 1 } })
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.log(err);
    });
    //const data = await Request(req);
    //res.status(data.status).json(data);
});

module.exports = router;