const express = require('express');
const authorController = require('../controllers/authorController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get(
  '/checked-in-total',
  authMiddleware(),
  authorController.getTotalCheckedInAuthors,
);
router.get('/', authMiddleware(), authorController.getAllAuthors);
router.get('/:id', authMiddleware(), authorController.getAuthor);
router.post('/', authMiddleware(), authorController.createAuthor);
router.patch('/:id', authMiddleware(), authorController.updateAuthor);
router.delete('/:id', authMiddleware(), authorController.deleteAuthor);

module.exports = router;
