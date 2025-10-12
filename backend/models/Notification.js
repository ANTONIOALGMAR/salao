const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['appointment_reminder', 'appointment_confirmation', 'appointment_change', 'system'],
      default: 'system',
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Appointment', 'Service', 'User'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentViaEmail: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;