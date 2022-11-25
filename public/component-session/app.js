var clientKey = 'test_TNNSZ6AC2FHXBLVMYUZ3K4KPPQURD4ZG'
var myIPDataKey = "263994c8926a8cfd56041c3ab982cbe2a3461d95ee5bb1791801bbc2"
var ipAddressField = document.getElementById("ipAddress");
const url_domain = location.protocol + '//' + location.host;

// Used to finalize a checkout call in case of redirect
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId'); // Unique identifier for the payment session
const redirectResult = urlParams.get('redirectResult');


var dropinComponent;

// Handles responses sent from your server to the client
function handleServerResponse(res, component) {
  console.log(res)


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


// HTML Elements
var promotionTextElement = document.getElementById("promotionText");
var paymentAmountElement = document.getElementById("paymentAmount");

// Detected Card information
var detectedCard = {
  brand: '',
  bin: ''
}


function applyCardDiscount(detectedCard) {
  var appliedDiscount = 0
  var promotionText = ''

  // Check if Bin discount applied
  if (detectedCard['bin'] == '542713') {
    // apply citi cash back discount 25% off
    appliedDiscount = 25
    promotionText = 'Citi Cash Back detected: 25% OFF discount applied'
  } else {
    // Clear Bin Discount if not applicable
    appliedDiscount = 0
  }

  // Check if Brand Discount applied
  if (detectedCard['brand'] == 'mc') {
    // apply mc 20% off
    if (appliedDiscount <= 20) {
      appliedDiscount = 20
      promotionText = 'Mastercard detected: 20% OFF discount applied'
    }
  } else if (detectedCard['brand'] == 'jcb') {
    if (appliedDiscount <= 30) {
      appliedDiscount = 30
      promotionText = 'JCB detected: 30% OFF discount applied'
    }
  } else if (detectedCard['brand'] == 'amex') {
    if (appliedDiscount <= 30) {
      appliedDiscount = 30
      promotionText = 'AMEX detected: 30% OFF discount applied'
    }
  } else if (detectedCard['brand'] == 'visa') {
    if (appliedDiscount <= 40) {
      appliedDiscount = 40
      promotionText = 'Visa detected: 40% OFF discount applied'
    }
  } else {
    // No brand detected
    appliedDiscount = 0
    promotionText = 'No promotion'
  }

  // Apply Final discount
  paymentAmountElement.innerHTML = 100 - appliedDiscount
  promotionTextElement.innerHTML = promotionText
}

const configuration = {
  environment: 'test', // Change to 'live' for the live environment.
  clientKey: clientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
  analytics: {
    enabled: true // Set to false to not send analytics data to Adyen.
  },
  session: {
    id: '', // Unique identifier for the payment session.
    sessionData: '' // The payment session data.
  },
  onSubmit: (state, component) => {
    console.log(state)

    var payload = {}
    payload['paymentMethod'] = state['data']['paymentMethod']
    payload['amount'] = paymentAmountElement.innerHTML + '0'

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
          handleServerResponse(data['apiResponse'], null);
        } else {
          console.log("Failed to make a payment")
        }
      })






     //  Your function calling your server to make a `/payments` request
  },
  onPaymentCompleted: (result, component) => {
      console.info(result, component);
      handleServerResponse(result, component);

  },
  onError: (error, component) => {
      console.error(error.name, error.message, error.stack, component);
  },
  showStoredPaymentMethods: true,
  paymentMethodsConfiguration: {
    card: {
      showPayButton: true,
      enableStoreDetails: true,
      hasHolderName: true,
      holderNameRequired: true,
      billingAddressRequired: false,
      amount: null,
      onBrand: function(brand){
        console.log('Brand information')
        console.log(brand)
        detectedCard['brand'] = brand['brand']
        applyCardDiscount(detectedCard)
      },
      onBinValue: function(bin){
        console.log(bin)
        detectedCard['bin'] = bin['binValue']
        applyCardDiscount(detectedCard)
      },
      // onBinLookup: function(callbackObj) {
      //   console.log('Bin Lookup information')
      //   console.log(callbackObj)
      // }
    }
  }
};


// Get IP address
function json(url) {
  return fetch(url).then(res => res.json());
}


function pay() {
  console.log('I\'m here')
  dropinComponent.submit()
}


json(`https://api.ipdata.co?api-key=${myIPDataKey}`).then(data => {
  cardholderIP = data.ip
  console.log(cardholderIP)
  ipAddressField.innerHTML = cardholderIP;
});

var cardholderIP;


// Load the drop-in
async function startCheckout() {

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
        configuration['session']['id'] = data['apiResponse']['id']
        configuration['session']['sessionData'] = data['apiResponse']['sessionData']
        AdyenCheckout(configuration)
          .then((checkout) => {
            console.log(checkout.paymentMethodsResponse)
            dropinComponent = checkout.create('scheme').mount('#card-container');
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


// Some payment methods use redirects. This is where we finalize the operation
async function finalizeCheckout() {
  try {
    // Create AdyenCheckout re-using existing Session
    const checkout = await createAdyenCheckout({ id: sessionId });

    // Submit the extracted redirectResult (to trigger onPaymentCompleted() handler)
    checkout.submitDetails({ details: { redirectResult } });
  } catch (error) {
    console.error(error);
    alert("Error occurred. Look at console for details");
  }
}


if (!sessionId) {
  startCheckout();
}
else {
  // existing session: complete Checkout
  finalizeCheckout();
}
