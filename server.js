const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const checkout = require('./routes/api/checkout');
const notifications = require('./routes/api/notifications');
const pos = require('./routes/api/pos');
// const webhooks = require('./routes/api/webhooks');
// const disputes = require('./routes/api/disputes');
// const testing = require('./routes/api/testing');
// const frontEnd = require('./routes/front_end/front_end');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.use('/images', express.static(__dirname + '/images'));
// app.use(express.static(__dirname + '/public'));
app.use('/dropin', express.static(__dirname + '/public/drop-in-session'));
app.use('/component', express.static(__dirname + '/public/component-session'));
app.use('/custom-card', express.static(__dirname + '/public/custom-card'));
app.use('/result/success', express.static(__dirname + '/public/result/success'));
app.use('/result/failure', express.static(__dirname + '/public/result/failure'));

// app.use('/webhooks', express.static(__dirname + '/public/webhooks'));

// app.use('/', frontEnd);
app.use('/api/checkout', checkout);
app.use('/api/notifications', notifications);
app.use('/api/pos', pos);
// app.use('/api/webhooks', webhooks);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
