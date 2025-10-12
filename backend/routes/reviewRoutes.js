const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getServiceAverageRating,
  getEmployeeAverageRating,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.get('/average/service/:id', getServiceAverageRating);
router.get('/average/employee/:id', getEmployeeAverageRating);

// Rotas protegidas (requerem autenticação)
router.post('/', protect, authorize('client'), createReview);
router.put('/:id', protect, authorize('client'), updateReview);
router.delete('/:id', protect, authorize(['client', 'admin']), deleteReview);

module.exports = router;