const express = require('express');
require('express-async-errors');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const userRouter = require('./routes/userRouter');
const matchRouter = require('./routes/matchRouter');
const matchPredictionRouter = require('./routes/matchPredictionRouter');


// API routes
app.use('/api/users', userRouter);
app.use('/api/matches', matchRouter);
app.use('/api/matchPredictions', matchPredictionRouter);


// 404
app.use('/', (req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;