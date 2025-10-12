const express = require('express');

const router = express.Router();
const {
  authUser,
  registerUser,
  getUsers,
  getEmployeesForClients,
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

router.use((req, res, next) => {
  console.log('Request hit userRoutes:', req.method, req.url);
  next();
});

router.post('/', registerUser);
router.get('/', protect, admin, getUsers);
router.post('/login', authUser);
router.get('/employees', getEmployeesForClients);

module.exports = router;
