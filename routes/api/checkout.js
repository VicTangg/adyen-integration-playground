const express = require('express');
const axios = require('axios');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const https = require('https');
const { Console } = require('console');
const base64Url = require('base64url')

var myXAPIKey = process.env.XAPIKEY;

var checkoutUrlEndpoint = 'https://checkout-test.adyen.com/v69/'
var palUrlEndpoint = 'https://pal-test.adyen.com/pal/servlet/'


router.get('/', (req, res) => {
  res.json("I'm good");
});


router.post('/sessions', (req, res) => {

  var data = {
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "countryCode": "US",
    "shopperLocale": "zh-TW",
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
    url: checkoutUrlEndpoint + 'sessions',
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
  console.log(Object.keys(req.body.data))
  // console.log(req.body.data)

  // Drop in pass in these values
  // 'riskData',
  // 'checkoutAttemptId',
  // 'paymentMethod',
  // 'billingAddress',
  // 'storePaymentMethod',
  // 'browserInfo',
  // 'origin',
  // 'clientStateDataIndicator'

  var data = req.body.data

  data["merchantAccount"] = "AdyenTechSupport_VictorTang_TEST"
  data["shopperReference"] = req.body.shopperReference
  data["authenticationData"] = {
    "attemptAuthentication": "always",
    "threeDSRequestData": {
      "nativeThreeDS": "preferred"
    }
  }
  data['reference'] = "asddadsa"
  data["returnUrl"] = req.body.returnUrl
  data["captureDelayHours"] = 0
  // data["storePaymentMethod"] = true
  data["amount"] = {
    "currency": req.body.currency,
    "value": req.body.amount + '00'
  }
  data["channel"] = "Web"


  var config = {
    method: 'post',
    url: checkoutUrlEndpoint + 'payments',
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
  console.log(req.body.data)

  var data = {
    // "blockedPaymentMethods": ['scheme', 'alipay'],
    // "splitCardFundingSources": true,
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "countryCode": "HK",
    "shopperLocale": "en_US",
    "amount": {
      "currency": "HKD",
      "value": 1800
    },
    "reference": "abc",
    "shopperReference": "victortangPostmanUser",
    "channel": "Web"
  }

  console.log(data)

  var config = {
    method: 'post',
    url: checkoutUrlEndpoint + 'paymentMethods',
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
  var data = req.body.data

  data['merchantAccount'] = 'AdyenTechSupport_VictorTang_TEST'

  console.log(data)

  var config = {
    method: 'post',
    url: checkoutUrlEndpoint + 'payments/details',
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


router.post('/disableStoredPaymentMethod', (req, res) => {
  var data = {
    // "blockedPaymentMethods": ['scheme', 'alipay'],
    "merchantAccount": "AdyenTechSupport_VictorTang_TEST",
    "shopperReference": "victortangPostmanUser",
    "recurringDetailReference": req.body.storedPaymentMethodId,
    "channel": "Web"
  }

  console.log(data)

  var config = {
    method: 'post',
    url: palUrlEndpoint + 'Recurring/v68/disable',
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


router.post('/identifyShopperFingerprinting', (req, res) => {
  var threeDSServerTransID = req.body.threeDSServerTransID
  var fingerprintToken = req.body.fingerprintToken

  var decodedFingerprintToken = JSON.parse(base64Url.decode(fingerprintToken))

  console.log(decodedFingerprintToken)
  const dataObj =
    { threeDSServerTransID: threeDSServerTransID, 
      threeDSMethodNotificationURL: req.body.YOUR_3DS_METHOD_NOTIFICATION_URL
  };

  console.log(dataObj)

  const stringifiedDataObject = JSON.stringify(dataObj);
  const encodedJSON = base64Url.encode(stringifiedDataObject);

  res.status(200).json({
    'success': true,
    'encodedJSONforIframe': encodedJSON,
    'threeDSMethodUrl': decodedFingerprintToken.threeDSMethodUrl
  });

});


module.exports = router;
