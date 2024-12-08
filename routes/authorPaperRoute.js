const express = require('express');
const authorPaperController = require('../controllers/authorPaperController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get(
  '/total-gifts-taken',
  authMiddleware(),
  authorPaperController.getTotalGiftsTaken,
);
router.get(
  '/:authorId',
  authMiddleware(),
  authorPaperController.getPapersByAuthorId,
);
router.get(
  '/authors/:paperId',
  authMiddleware(),
  authorPaperController.getAuthorsWithGiftsForPaper,
);
router.patch(
  '/:authorId/:paperId/gifts',
  authMiddleware(),
  authorPaperController.updateGiftsForPaper,
);

module.exports = router;
