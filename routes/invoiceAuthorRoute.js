const express = require('express');
const invoiceAuthorController = require('../controllers/invoiceAuthorController.js');

const router = express.Router();

router.get('/:authorId', invoiceAuthorController.getInvoicesByAuthorId);

module.exports = router;
