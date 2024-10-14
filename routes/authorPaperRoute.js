const express = require('express');
const authorPaperController = require('../controllers/authorPaperController.js');

const router = express.Router();

router.get('/:authorId', authorPaperController.getPapersByAuthorId);
router.get(
  '/authors/:paperId',
  authorPaperController.getAuthorsWithGiftsForPaper,
);
router.patch(
  '/:authorId/:paperId/gifts',
  authorPaperController.updateGiftsForPaper,
);

module.exports = router;
