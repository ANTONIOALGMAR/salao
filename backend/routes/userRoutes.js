const express = require('express');

const router = express.Router();
const {
  authUser,
  registerUser,
  getUsers,
} = require('../controllers/userController');

router.use((req, res, next) => {
  console.log('Request hit userRoutes:', req.method, req.url);
  next();
});

router.post('/', registerUser);
router.get('/', getUsers);
router.post('/login', authUser);

module.exports = router;
