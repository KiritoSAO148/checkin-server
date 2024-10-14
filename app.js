const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authorRouter = require('./routes/authorRoute');
const paperRouter = require('./routes/paperRoute');
const authorPaperRouter = require('./routes/authorPaperRoute');
const invoiceAuthorRouter = require('./routes/invoiceAuthorRoute');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/authors', authorRouter);
app.use('/api/v1/papers', paperRouter);
app.use('/api/v1/authors-papers', authorPaperRouter);
app.use('/api/v1/invoices-authors', invoiceAuthorRouter);

module.exports = app;
