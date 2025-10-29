const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

router
  .route('/')
  .post(
    protect,
    admin,
    validate([
      body('name').trim().isLength({ min: 1 }).withMessage('Nome é obrigatório'),
      body('description').optional().isString().withMessage('Descrição inválida'),
      body('price').isFloat({ gt: 0 }).withMessage('Preço deve ser positivo'),
      body('duration').isInt({ gt: 0 }).withMessage('Duração deve ser positiva (minutos)'),
    ]),
    createService,
  )
  .get(getServices);
router
  .route('/:id')
  .get(getServiceById)
  .put(
    protect,
    admin,
    validate([
      body('name').optional().trim().isLength({ min: 1 }).withMessage('Nome inválido'),
      body('description').optional().isString().withMessage('Descrição inválida'),
      body('price').optional().isFloat({ gt: 0 }).withMessage('Preço deve ser positivo'),
      body('duration').optional().isInt({ gt: 0 }).withMessage('Duração deve ser positiva (minutos)'),
    ]),
    updateService,
  )
  .delete(protect, admin, deleteService);

module.exports = router;
