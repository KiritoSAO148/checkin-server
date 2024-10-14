const express = require('express');
const paperController = require('../controllers/paperController.js');

const router = express.Router();

router.get('/', paperController.getAllPapers);
router.get('/:id', paperController.getPaper);
router.post('/', paperController.createPaper);
router.patch('/:id', paperController.updatePaper);
router.delete('/:id', paperController.deletePaper);

module.exports = router;
