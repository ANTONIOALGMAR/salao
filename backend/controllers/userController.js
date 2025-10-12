const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all users (optionally filtered by role)
// @route   GET /api/users
// @access  Private/Admin (or potentially authenticated users for specific roles)
const getUsers = asyncHandler(async (req, res) => {
  console.log('getUsers controller hit!', req.query);
  const { role } = req.query;
  const query = {};

  if (role) {
    query.role = role;
  }

  const users = await User.find(query).select('-password'); // Don't return passwords
  res.json(users);
});

// @desc    Get employees (users with role 'employee')
// @route   GET /api/users/employees
// @access  Public (or Private/Authenticated if needed)
const getEmployeesForClients = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('-password');
  res.json(employees);
});

module.exports = { authUser, registerUser, getUsers, getEmployeesForClients };
