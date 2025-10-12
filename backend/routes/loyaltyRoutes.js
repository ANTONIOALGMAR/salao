const express = require('express');
const router = express.Router();
const {
  getLoyaltyProgram,
  updateLoyaltyProgram,
  addReward,
  updateReward,
  getUserPoints,
  getUserTransactions,
  addPoints,
  redeemPoints,
  processAppointmentPoints,
} = require('../controllers/loyaltyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/program', getLoyaltyProgram);

// Rotas para clientes
router.get('/points', protect, authorize('client'), getUserPoints);
router.get('/transactions', protect, authorize('client'), getUserTransactions);
router.post('/redeem', protect, authorize('client'), redeemPoints);

// Rotas administrativas
router.put('/program', protect, authorize('admin'), updateLoyaltyProgram);
router.post('/program/rewards', protect, authorize('admin'), addReward);
router.put('/program/rewards/:id', protect, authorize('admin'), updateReward);
router.post('/add-points', protect, authorize('admin'), addPoints);
router.post('/process-appointment', protect, authorize('admin'), processAppointmentPoints);

module.exports = router;