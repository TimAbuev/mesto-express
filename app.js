const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { errors } = require('celebrate');
const routes = require('./routes/index');
const { NotFoundError } = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(routes);
// app.use(errors());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ error: err.message });
    console.log(err);
  } else {
    res.status(500).send({ error: 'Internal server errorrrr' });
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`privet && app listening on port ${PORT}`);
});
