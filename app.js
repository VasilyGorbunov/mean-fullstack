const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const { mongoURI } = require('./config/keys')

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log('MONGODB connect')
  })
  .catch((err) => console.log(err));

const analyticsRouter = require('./routes/analytics');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const orderRouter = require('./routes/order');
const positionRouter = require('./routes/position');

const app = express();
app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('cors')());

app.use('/api/analytics', analyticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);
app.use('/api/position', positionRouter);

module.exports = app;