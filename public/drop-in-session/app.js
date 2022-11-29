var clientKey = 'test_TNNSZ6AC2FHXBLVMYUZ3K4KPPQURD4ZG'
var myIPDataKey = "263994c8926a8cfd56041c3ab982cbe2a3461d95ee5bb1791801bbc2"
var ipAddressField = document.getElementById("ipAddress");
const url_domain = location.protocol + '//' + location.host;


// Used to finalize a checkout call in case of redirect
const urlParams = new URLSearchParams(window.location.search);
const integrationType = urlParams.get('type')
const sessionId = urlParams.get('sessionId'); // Unique identifier for the payment session
const redirectResult = urlParams.get('redirectResult');


// HTML Elements
var promotionTextElement = document.getElementById("promotionText");
var paymentAmountElement = document.getElementById("paymentAmount");
var shoppingCartAmountElement = document.getElementById("shoppingCartAmount");


// Detected Card information
var detectedCard = {
  brand: '',
  bin: ''
}


async function updatePromotionText(appliedDiscount, promotionText) {
  var discountedAmount = parseInt(shoppingCartAmountElement.innerHTML) * (100 - appliedDiscount) / 100
  paymentAmountElement.innerHTML = discountedAmount
  promotionTextElement.innerHTML = promotionText
}

var styleObject = {
  base: {
    color: 'purple',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    fontFamily: 'Helvetica'
  },
  error: {
    color: 'red'
  },
  placeholder: {
    color: '#d8d8d8'
  },
  validated: {
    color: 'pink'
  }
};


// Handles responses sent from your server to the client
function handleServerResponse(res, component) {
  if (res.action) {
    component.handleAction(res.action);
  } else {
    switch (res.resultCode) {
      case "Authorised":
        window.location.href = "/result/success";
        break;
      case "Pending":
      case "Received":
        window.location.href = "/result/pending";
        break;
      case "Refused":
        window.location.href = "/result/failed";
        break;
      default:
        window.location.href = "/result/error";
        break;
    }
  }
}

const applePayConfiguration = {
    amount: {
        value: 1000,
        currency: "HKD"
    },
    countryCode: "HK"
};

const configuration = {
  environment: 'test', // Change to 'live' for the live environment.
  clientKey: clientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
  analytics: {
    enabled: true // Set to false to not send analytics data to Adyen.
  },
  // session: {
  //   id: '', // Unique identifier for the payment session.
  //   sessionData: '' // The payment session data.
  // },
  // styles: {
  //   base: {
  //     // "creditCard.holderName": "Name on card",
  //     // "creditCard.holderName.placeholder": "J. Smith",
  //     // "creditCard.holderName.invalid": "Invalid cardholder name",
  //     "creditCard.numberField.title": "信用咖號碼",
  //     // "creditCard.numberField.invalid": "Invalid card number",
  //     // "creditCard.expiryDateField.title": "Expiry date",
  //     // "creditCard.expiryDateField.placeholder": "MM/YY",
  //     // "creditCard.expiryDateField.invalid": "Invalid expiry date",
  //     // "creditCard.expiryDateField.month": "Month",
  //     // "creditCard.expiryDateField.month.placeholder": "MM",
  //     // "creditCard.expiryDateField.year.placeholder": "YY",
  //     // "creditCard.expiryDateField.year": "Year",
  //     // "creditCard.cvcField.title": "CVC / CVV",
  //     "creditCard.cvcField.placeholder": "999",
  //     // "creditCard.storeDetailsButton": "Remember for next time",
  //     // "creditCard.oneClickVerification.invalidInput.title": "Invalid CVC / CVV format",
  //     // "creditCard.cvcField.placeholder.4digits": "4 digits",
  //     // "creditCard.cvcField.placeholder.3digits": "3 digits",
  //   }
  // },
  onPaymentCompleted: (result, component) => {
      console.info(result, component);
      console.log('onPaymentCompleted')
      wait(2000)
      handleServerResponse(result, component);

  },
  onError: (error, component) => {
      console.error(error.name, error.message, error.stack, component);
  },
  openFirstPaymentMethod: false,

  // can be hidden
  showPayButton: true,
  openFirstStoredPaymentMethod: false,
  showStoredPaymentMethods: true,
  // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
  // For example, this is 3D Secure configuration for cards:
  onSubmit: (state, component) => {
    console.log(state)

    var payload = {}
    payload['paymentMethod'] = state['data']['paymentMethod']
    payload['amount'] = paymentAmountElement.innerHTML + '0'
    // payload['returnUrl'] = url_domain + '/component'
    payload['returnUrl'] = url_domain + '/?type=dropin'

    console.log(payload)


    fetch(url_domain + "/api/checkout/payments",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(function (data) {
        console.log(data)
        if (data['success'] === true) {
          // Deal with payment result here
          handleServerResponse(data['apiResponse'], component);
        } else {
          console.log("Failed to make a payment")
        }
      })
     //  Your function calling your server to make a `/payments` request
  },
  onAdditionalDetails: (state, component) => {
    console.log(state)
    console.log("on Additional Details triggered")
    submitPaymentDetails(state.details)
     //  Your function calling your server to make a `/payments/details` request
  },
  showRemovePaymentMethodButton: true,
  onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
    console.log(storedPaymentMethodId)
    dropinComponent.resolve()
  },
  paymentMethodsConfiguration: {
    applepay: applePayConfiguration,
    card: {
      amount: null,
      enableStoreDetails: true,
      hasHolderName: true,
      holderNameRequired: true,
      billingAddressRequired: false,
      name: "信用咖",
      styles: styleObject,
      onBrand: function(brand){
        console.log(brand)
      },
      onBrand: function(brand){
        console.log('Brand information')
        console.log(brand)
        detectedCard['brand'] = brand['brand']
        var promotionDetails = applyCardDiscount(detectedCard)
        updatePromotionText(
          promotionDetails['appliedDiscount'], promotionDetails['promotionText']
        )
      },
      onBinValue: function(bin){
        console.log(bin)
        detectedCard['bin'] = bin['binValue']
        var promotionDetails = applyCardDiscount(detectedCard)
        updatePromotionText(
          promotionDetails['appliedDiscount'], promotionDetails['promotionText']
        )
      },
    }
  },
  locale: "zh_HK",
  translations: {
    "zh_HK": {
      "creditCard.numberField.title": "尊貴客人的卡號",
      "payButton": "卑錢啦",
      "creditCard.holderName.placeholder": "陳大文",
      "creditCard.cvcField.title": "安全碼",
      "creditCard.expiryDateField.placeholder": "月月/年年",
      "creditCard.cvcField.placeholder.3digits": "999",
      "creditCard.cvcField.placeholder.4digits": "8888",
      "creditCard.numberField.placeholder": "4111 2333 4242 5123",
      "creditCard.holderName": "尊貴客人的名字"
    }
  }
};


// Get IP address
function json(url) {
  return fetch(url).then(res => res.json());
}

json(`https://api.ipdata.co?api-key=${myIPDataKey}`).then(data => {
  cardholderIP = data.ip
  console.log(cardholderIP)
  ipAddressField.innerHTML = cardholderIP;
});

var cardholderIP;


// Load the drop-in
async function startCheckoutByPaymentMethods() {

  // Create a drop-in session
  var payload = {}

  fetch(url_domain + "/api/checkout/paymentMethods",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(function (data) {
      console.log(data)
      if (data['success'] === true) {
        // Load the drop-in here
        configuration['paymentMethodsResponse'] = data['apiResponse']

        AdyenCheckout(configuration)
          .then((checkout) => {
            const dropinComponent = checkout.create(integrationType).mount('#dropin-container');
          });
      } else {
        console.log("Failed to create a drop-in session")
      }
    })

}


async function createAdyenCheckout(session) {

  configuration['session'] = session

  return new AdyenCheckout(configuration);
}


async function submitPaymentDetails(details) {
  var payload = {}
  payload['details'] = details

  console.log(payload)


  fetch(url_domain + "/api/checkout/payments/details",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(function (data) {
      console.log(data)
      if (data['success'] === true) {
        // Deal with payment result here
        console.log('Payment details submitted successfully')
        wait(2000)
        handleServerResponse(data['apiResponse'], null);
      } else {
        console.log("Failed to submit payment details")
      }
    })
}


// Some payment methods use redirects. This is where we finalize the operation
async function finalizeCheckout() {
  try {
    // Create AdyenCheckout re-using existing Session
    console.log('Redirect result with NO session ID, call payments details API')

    submitPaymentDetails({
      'redirectResult': redirectResult
    })
    // The purpose to submit payment details after redirect is to get the resultCode
  } catch (error) {
    console.error(error);
    alert("Error occurred. Look at console for details");
  }
}


function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


// Load the drop-in
async function startCheckoutBySession() {

  // Create a drop-in session
  var payload = {}

  fetch(url_domain + "/api/checkout/sessions",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(function (data) {
      console.log(data)
      if (data['success'] === true) {
        // Load the drop-in here
        configuration['session'] = {}
        configuration['session']['id'] = data['apiResponse']['id']
        configuration['session']['sessionData'] = data['apiResponse']['sessionData']
        AdyenCheckout(configuration)
          .then((checkout) => {
            const dropinComponent = checkout.create(integrationType).mount('#dropin-container');
          });
      } else {
        console.log("Failed to create a drop-in session")
      }
    })

}


if (!redirectResult) {
  // startCheckoutBySession();
  startCheckoutByPaymentMethods();
}
else {
  wait(2000)
  console.log('From redirect')
  // existing session: complete Checkout
  finalizeCheckout();
}
