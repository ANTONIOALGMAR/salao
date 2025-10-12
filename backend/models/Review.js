const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Referência ao cliente que fez a avaliação
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Service', // Serviço avaliado
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Funcionário que realizou o serviço
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appointment', // Agendamento relacionado
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Avaliação de 1 a 5 estrelas
    },
    comment: {
      type: String,
      trim: true,
    },
    photos: [
      {
        url: String,
        caption: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Método estático para calcular a média de avaliações para um serviço
ReviewSchema.statics.getAverageRating = async function (serviceId) {
  const result = await this.aggregate([
    {
      $match: { service: serviceId },
    },
    {
      $group: {
        _id: '$service',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? { averageRating: result[0].averageRating, count: result[0].count }
    : { averageRating: 0, count: 0 };
};

// Método estático para calcular a média de avaliações para um funcionário
ReviewSchema.statics.getEmployeeAverageRating = async function (employeeId) {
  const result = await this.aggregate([
    {
      $match: { employee: employeeId },
    },
    {
      $group: {
        _id: '$employee',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? { averageRating: result[0].averageRating, count: result[0].count }
    : { averageRating: 0, count: 0 };
};

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;