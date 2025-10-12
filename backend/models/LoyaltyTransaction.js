const mongoose = require('mongoose');

const LoyaltyTransactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['earn', 'redeem', 'expire', 'adjust'],
    },
    points: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Appointment', 'Service', 'LoyaltyProgram'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const LoyaltyTransaction = mongoose.model('LoyaltyTransaction', LoyaltyTransactionSchema);

module.exports = LoyaltyTransaction;