const express = require('express');

const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
  getEmployeeAppointments,
} = require('../controllers/appointmentController');

const { protect, admin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

router
  .route('/')
  .post(
    protect,
    validate([
      body('client').isMongoId().withMessage('Client inválido'),
      body('employee').isMongoId().withMessage('Employee inválido'),
      body('service').isMongoId().withMessage('Service inválido'),
      body('date').isISO8601().withMessage('Data inválida'),
      body('startTime')
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Horário inicial deve estar no formato HH:mm'),
    ]),
    createAppointment,
  )
  .get(getAppointments);
router
  .route('/:id')
  .get(getAppointmentById)
  .put(
    protect,
    validate([
      param('id').isMongoId().withMessage('Id inválido'),
      body('date').optional().isISO8601().withMessage('Data inválida'),
      body('startTime')
        .optional()
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Horário inicial deve estar no formato HH:mm'),
      body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
        .withMessage('Status inválido'),
    ]),
    updateAppointment,
  )
  .delete(protect, admin, deleteAppointment);
router
  .route('/available/:employeeId/:date')
  .get(
    validate([
      param('employeeId').isMongoId().withMessage('Employee inválido'),
      param('date').isISO8601().withMessage('Data inválida'),
    ]),
    getAvailableSlots,
  );
router
  .route('/employee/:employeeId')
  .get(
    protect,
    validate([
      param('employeeId').isMongoId().withMessage('Employee inválido'),
      query('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
      query('endDate').optional().isISO8601().withMessage('Data final inválida'),
    ]),
    getEmployeeAppointments,
  );

module.exports = router;
