const express = require('express');

const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
} = require('../controllers/appointmentController');

router.route('/').post(createAppointment).get(getAppointments);
router
  .route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);
router.route('/available/:employeeId/:date').get(getAvailableSlots);

module.exports = router;
