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
        "currency": "CNY",
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

    // 3DS related
    "browserInfo": {
        "userAgent": "Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/70.0.3538.110 Safari\/537.36",
        "acceptHeader": "text\/html,application\/xhtml+xml,application\/xml;q=0.9,image\/webp,image\/apng,*\/*;q=0.8",
        "language": "nl-NL",
        "colorDepth": 24,
        "screenHeight": 723,
        "screenWidth": 1536,
        "timeZoneOffset": 0,
        "javaEnabled": true
    },
    "authenticationData": {
        "attemptAuthentication": "always",
        "threeDSRequestData": {
            "nativeThreeDS": "preferred"
        }
    },
    "reference": "asdadassd",
    "channel": "web",
    "amount": {
        "currency": "HKD",
        "value": 100000
        // "value": req.body.amount
    },
    "returnUrl": req.body.returnUrl,
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


router.post('/paymentMethods', (req, res) => {
  var data = {
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "countryCode": "HK",
    "shopperLocale": "zh_HK",
    "amount": {
        "currency": "CNY",
        "value": 1800
    },
    "reference": "abc",
    "shopperReference": "victortangPostmanUser",
    "channel": "Web"
  }

  console.log(data)

  var config = {
    method: 'post',
    url: urlEndpoint + 'paymentMethods',
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


router.post('/payments/details', (req, res) => {
  var data = {
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "details": req.body.details
  }

  console.log(data
  )
  var config = {
    method: 'post',
    url: urlEndpoint + 'payments/details',
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
