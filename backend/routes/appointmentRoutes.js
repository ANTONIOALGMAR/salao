const express = require('express');

const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
  getEmployeeAppointments,
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').post(createAppointment).get(getAppointments);
router
  .route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);
router.route('/available/:employeeId/:date').get(getAvailableSlots);
router.route('/employee/:employeeId').get(protect, getEmployeeAppointments);

module.exports = router;
