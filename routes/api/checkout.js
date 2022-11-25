const express = require('express');
const axios = require('axios');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const https = require('https');
const { Console } = require('console');

var myXAPIKey = process.env.XAPIKEY;

var urlEndpoint = 'https://checkout-test.adyen.com/v69/'

router.get('/', (req, res) => {
  res.json("I'm good");
});

router.post('/sessions', (req, res) => {

  var data = {
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "countryCode": "HK",
    "shopperLocale": "zh_HK",
    "amount": {
        "currency": "HKD",
        "value": 1800
    },
    "reference": "abc",
    "returnUrl": "http://localhost:5000/",
    "shopperReference": "victortangPostmanUser",
    "channel": "Web"
  }

  var config = {
    method: 'post',
    url: urlEndpoint + 'sessions',
    headers: {
      'x-api-key': myXAPIKey,
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      res.status(200).json({
        'success': true,
        'apiRequest': data,
        'apiResponse': response.data
      });
    })
    .catch(function (error) {
      console.log(error);
      // console.log('return')
      res.status(404).json({ 'success': false })
    });
});

router.post('/payments', (req, res) => {
  console.log(req.body)


  var data = {
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "reference": "asdadassd",
    "amount": {
        "currency": "HKD",
        "value": req.body.amount
    },
    "returnUrl": "http://localhost:5000/component",
    "paymentMethod": req.body.paymentMethod
  }

  var config = {
    method: 'post',
    url: urlEndpoint + 'payments',
    headers: {
      'x-api-key': myXAPIKey,
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      res.status(200).json({
        'success': true,
        'apiRequest': data,
        'apiResponse': response.data
      });
    })
    .catch(function (error) {
      console.log(error);
      // console.log('return')
      res.status(404).json({ 'success': false })
    });
});


module.exports = router;
