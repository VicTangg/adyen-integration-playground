const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const checkout = require('./routes/api/checkout');
// const webhooks = require('./routes/api/webhooks');
// const disputes = require('./routes/api/disputes');
// const testing = require('./routes/api/testing');
// const frontEnd = require('./routes/front_end/front_end');

const app = express();
app.use(function(req, res, next) {
      // res.header("Access-Control-Allow-Origin", "*");
      const allowedOrigins = ['http://localhost:5000', 'https://adyen-integration-playground.onrender.com/'];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
           res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-credentials", true);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
      next();
    });

app.use(bodyParser.json());



// app.use('/images', express.static(__dirname + '/images'));
// app.use(express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public/drop-in-session'));
app.use('/component', express.static(__dirname + '/public/component-session'));
app.use('/result/success', express.static(__dirname + '/public/result/success'));
app.use('/result/failure', express.static(__dirname + '/public/result/failure'));

// app.use('/webhooks', express.static(__dirname + '/public/webhooks'));

// app.use('/', frontEnd);
app.use('/api/checkout', checkout);
// app.use('/api/webhooks', webhooks);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
