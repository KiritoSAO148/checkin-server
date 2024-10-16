const express = require('express');
const authorController = require('../controllers/authorController.js');

const router = express.Router();

router.get('/checked-in-total', authorController.getTotalCheckedInAuthors);
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthor);
router.post('/', authorController.createAuthor);
router.patch('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
