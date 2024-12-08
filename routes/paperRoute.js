const express = require('express');
const paperController = require('../controllers/paperController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get(
  '/total-checked-in',
  authMiddleware(),
  paperController.getTotalCheckedInPapers,
);
router.get('/', authMiddleware(), paperController.getAllPapers);
router.get('/:id', authMiddleware(), paperController.getPaper);
router.post('/', authMiddleware(), paperController.createPaper);
router.patch('/:id', authMiddleware(), paperController.updatePaper);
router.delete('/:id', authMiddleware(), paperController.deletePaper);

module.exports = router;
