// var clientKey = 'test_TNNSZ6AC2FHXBLVMYUZ3K4KPPQURD4ZG'
var clientKey = 'test_TNNSZ6AC2FHXBLVMYUZ3K4KPPQURD4ZG'
var myIPDataKey = "263994c8926a8cfd56041c3ab982cbe2a3461d95ee5bb1791801bbc2"
var ipAddressField = document.getElementById("ipAddress");
const url_domain = location.protocol + '//' + location.host;

// Used to finalize a checkout call in case of redirect
const urlParams = new URLSearchParams(window.location.search);
var sessionId = urlParams.get('sessionId'); // Unique identifier for the payment session
const redirectResult = urlParams.get('redirectResult');


function handleOnChange(state, component) {
  console.log(state.data)
  // state.isValid // True or false. Specifies if all the information that the shopper provided is valid.
}

const configuration = {
  locale: "en_US",
  environment: "test",
  clientKey: clientKey,
  onChange: handleOnChange
};


AdyenCheckout(configuration)
.then((checkout) => {

  const customCard = checkout.create('securedfields', {
    // Optional configuration
    type: 'card',
    brands: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],
    styles: {
        error: {
            color: 'red'
        },
        validated: {
            color: 'green'
        },
        placeholder: {
            color: '#d8d8d8'
        }
    },
    // Only for Web Components before 4.0.0.
    // For Web Components 4.0.0 and above, configure aria-label attributes in translation files
    ariaLabels: {
        lang: 'en-GB',
        encryptedCardNumber: {
            label: 'Credit or debit card number field',
            iframeTitle: 'Iframe for secured card number',
            error: 'Message that gets read out when the field is in the error state'
        }
    },
    // Events
    // onChange: handleOnChange,
    // onValid : function() {},
    // onLoad: function() {},
    // onConfigSuccess: function() {},
    // onFieldValid : function() {},
    // onBrand: function() {},
    // onError: function() {},
    // onFocus: function() {},
    // onBinValue: function(bin) {},
    // onBinLookup: function(callbackObj) {}
  }).mount('#customCard-container');
  

});


