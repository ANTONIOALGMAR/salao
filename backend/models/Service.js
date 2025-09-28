const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      default: 30,
    },
  },
  {
    timestamps: true,
  },
);

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
