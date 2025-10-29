const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const {
  authUser,
  registerUser,
  getUsers,
  getEmployeesForClients,
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

router.use((req, res, next) => {
  console.log('Request hit userRoutes:', req.method, req.url);
  next();
});

router.post(
  '/',
  validate([
    body('name').trim().isLength({ min: 1 }).withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
    body('role').optional().isIn(['admin', 'employee', 'client']).withMessage('Papel inválido'),
  ]),
  registerUser,
);
router.get('/', protect, admin, getUsers);
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 1 }).withMessage('Senha é obrigatória'),
  ]),
  authUser,
);
router.get('/employees', getEmployeesForClients);

module.exports = router;
