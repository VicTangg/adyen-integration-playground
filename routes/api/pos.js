const express = require('express');
const axios = require('axios');
const router = express.Router();
const https = require('https');
const fs = require('fs');
var path = require('path');
const { Console } = require('console');

const {Client, Config, TerminalLocalAPI} = require('@adyen/api-library')

var checkoutUrlEndpoint = 'https://checkout-test.adyen.com/v69/'
var palUrlEndpoint = 'https://pal-test.adyen.com/pal/servlet/'


router.get('/', (req, res) => {
    res.json("I'm good");
});


function getRandomServiceID(length) {
  return String(Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1)));
}

function getTimeStamp() {
  const date = new Date()
  return date.toISOString()
}

function getPOSPaymentRequest(POIID, reference, currency, amount) {
  const paymentRequest = {
    SaleToPOIRequest: {
      MessageHeader: {
          MessageClass: 'Service',
          MessageCategory: 'Payment',
          MessageType: 'Request',
          ProtocolVersion: "3.0",
          ServiceID: getRandomServiceID(10),
          SaleID: "AdyenPlaygroundVictorTang",
          POIID: POIID
      },
      PaymentRequest: {
          SaleData: {
              SaleTransactionID: {
                  TransactionID: reference,
                  TimeStamp: getTimeStamp()
              },
          },
          PaymentTransaction: {
              AmountsReq: {
                  Currency: currency,
                  RequestedAmount: amount
              }
          }
      }
  }
}
  return paymentRequest
}


function getTerminalLocalAPIClient(
  merchantAccount, terminalLocalIPAddress, environment
  ) {
  var certPath = path.join(__dirname, '.', 'certificates', 'adyen-terminalfleet-test.cer');

  const config = new Config();
  config.merchantAccount = merchantAccount;
  config.certificatePath = certPath;
  config.terminalApiLocalEndpoint = "https://" + terminalLocalIPAddress;
  config.apiKey = process.env.POSAPIKEY
  const client = new Client({ config });
  client.setEnvironment(environment);
  const terminalLocalApi = new TerminalLocalAPI(client);
  
  return terminalLocalApi
}



router.post('/local/paymentRequest', (req, res) => {

  var terminalLocalApi = getTerminalLocalAPIClient(
    req.body.merchantAccount,
    req.body.terminalLocalIPAddress,
    req.body.environment
    )

  const securityKey = {
    AdyenCryptoVersion: 1,
    KeyIdentifier: "key",
    KeyVersion: 1,
    Passphrase: process.env.POSPASSPHRASE,
  };

  const paymentRequest = getPOSPaymentRequest(
    req.body.POIID, 
    "adyenPlayground", 
    req.body.currency, 
    req.body.amount
    );
  

  terminalLocalApi.request(paymentRequest, securityKey)
  .then(function (response) {
    console.log(typeof(response));
    console.log(response['SaleToPOIResponse']['PaymentResponse'])
    res.json("I'm good");
  })
  .catch(function (error) {
  console.log(error)
  })
  

});


module.exports = router;
