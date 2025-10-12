const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'employee', 'client'], // Define roles
      default: 'client',
    },
    // Campos adicionais para clientes
    phone: {
      type: String,
      trim: true,
    },
    birthdate: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    preferences: {
      preferredServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
      preferredEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      notes: String,
    },
    // Campos para o sistema de fidelidade
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    visitHistory: [
      {
        date: Date,
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function matchPassword(
  enteredPassword,
) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
