const express = require('express');
const accountController = require('../controllers/accountController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/login', accountController.login);

module.exports = router;
