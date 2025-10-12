const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendAppointmentReminders,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rotas protegidas (requerem autenticação)
router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

// Rotas administrativas
router.post('/', protect, authorize('admin'), createNotification);
router.post('/send-reminders', protect, authorize('admin'), sendAppointmentReminders);

module.exports = router;