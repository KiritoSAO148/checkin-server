const express = require('express');
const invoiceAuthorController = require('../controllers/invoiceAuthorController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get(
  '/:authorId',
  authMiddleware(),
  invoiceAuthorController.getInvoicesByAuthorId,
);

module.exports = router;
