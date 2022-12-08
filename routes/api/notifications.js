const express = require('express');
const axios = require('axios');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const https = require('https');
const { Console } = require('console');

var myXAPIKey = process.env.XAPIKEY;

var checkoutUrlEndpoint = 'https://checkout-test.adyen.com/v69/'
var palUrlEndpoint = 'https://pal-test.adyen.com/pal/servlet/'


router.post('/pos', (req, res) => {
  console.log(req.body['notificationItems'][0]['NotificationRequestItem'])

  res.json("accepted");
});

router.post('/ecom', (req, res) => {
  console.log(req.body)
  res.json("accepted");
});


module.exports = router;
