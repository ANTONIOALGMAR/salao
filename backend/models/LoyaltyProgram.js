const mongoose = require('mongoose');

const LoyaltyProgramSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Programa de Fidelidade',
    },
    pointsPerCurrency: {
      type: Number,
      required: true,
      default: 10, // 10 pontos por cada R$ 1,00 gasto
    },
    minimumPointsForRedemption: {
      type: Number,
      required: true,
      default: 1000, // Mínimo de pontos para resgate
    },
    pointsToRewardRatio: {
      type: Number,
      required: true,
      default: 100, // 100 pontos = R$ 1,00 em desconto
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rewards: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        pointsRequired: {
          type: Number,
          required: true,
        },
        discountValue: {
          type: Number, // Valor do desconto em R$
        },
        discountPercentage: {
          type: Number, // Percentual de desconto
        },
        freeService: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const LoyaltyProgram = mongoose.model('LoyaltyProgram', LoyaltyProgramSchema);

module.exports = LoyaltyProgram;