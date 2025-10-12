const asyncHandler = require('express-async-handler');
const LoyaltyProgram = require('../models/LoyaltyProgram');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Obter configurações do programa de fidelidade
// @route   GET /api/loyalty/program
// @access  Public
const getLoyaltyProgram = asyncHandler(async (req, res) => {
  let program = await LoyaltyProgram.findOne({ isActive: true });

  // Se não existir um programa ativo, criar um com configurações padrão
  if (!program) {
    program = await LoyaltyProgram.create({
      name: 'Programa de Fidelidade',
      pointsPerCurrency: 10,
      minimumPointsForRedemption: 1000,
      pointsToRewardRatio: 100,
      isActive: true,
    });
  }

  res.json(program);
});

// @desc    Atualizar configurações do programa de fidelidade
// @route   PUT /api/loyalty/program
// @access  Private (admin)
const updateLoyaltyProgram = asyncHandler(async (req, res) => {
  const {
    name,
    pointsPerCurrency,
    minimumPointsForRedemption,
    pointsToRewardRatio,
    isActive,
  } = req.body;

  let program = await LoyaltyProgram.findOne();

  if (!program) {
    program = new LoyaltyProgram({});
  }

  program.name = name || program.name;
  program.pointsPerCurrency = pointsPerCurrency || program.pointsPerCurrency;
  program.minimumPointsForRedemption = minimumPointsForRedemption || program.minimumPointsForRedemption;
  program.pointsToRewardRatio = pointsToRewardRatio || program.pointsToRewardRatio;
  program.isActive = isActive !== undefined ? isActive : program.isActive;

  const updatedProgram = await program.save();
  res.json(updatedProgram);
});

// @desc    Adicionar uma recompensa ao programa de fidelidade
// @route   POST /api/loyalty/program/rewards
// @access  Private (admin)
const addReward = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    pointsRequired,
    discountValue,
    discountPercentage,
    freeService,
  } = req.body;

  const program = await LoyaltyProgram.findOne({ isActive: true });

  if (!program) {
    res.status(404);
    throw new Error('Programa de fidelidade não encontrado');
  }

  program.rewards.push({
    name,
    description,
    pointsRequired,
    discountValue,
    discountPercentage,
    freeService,
    isActive: true,
  });

  await program.save();
  res.status(201).json(program.rewards[program.rewards.length - 1]);
});

// @desc    Atualizar uma recompensa
// @route   PUT /api/loyalty/program/rewards/:id
// @access  Private (admin)
const updateReward = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    pointsRequired,
    discountValue,
    discountPercentage,
    freeService,
    isActive,
  } = req.body;

  const program = await LoyaltyProgram.findOne({ isActive: true });

  if (!program) {
    res.status(404);
    throw new Error('Programa de fidelidade não encontrado');
  }

  const rewardIndex = program.rewards.findIndex(
    (reward) => reward._id.toString() === req.params.id
  );

  if (rewardIndex === -1) {
    res.status(404);
    throw new Error('Recompensa não encontrada');
  }

  program.rewards[rewardIndex] = {
    ...program.rewards[rewardIndex].toObject(),
    name: name || program.rewards[rewardIndex].name,
    description: description || program.rewards[rewardIndex].description,
    pointsRequired: pointsRequired || program.rewards[rewardIndex].pointsRequired,
    discountValue: discountValue !== undefined ? discountValue : program.rewards[rewardIndex].discountValue,
    discountPercentage: discountPercentage !== undefined ? discountPercentage : program.rewards[rewardIndex].discountPercentage,
    freeService: freeService || program.rewards[rewardIndex].freeService,
    isActive: isActive !== undefined ? isActive : program.rewards[rewardIndex].isActive,
  };

  await program.save();
  res.json(program.rewards[rewardIndex]);
});

// @desc    Obter saldo de pontos do cliente
// @route   GET /api/loyalty/points
// @access  Private
const getUserPoints = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }

  res.json({
    loyaltyPoints: user.loyaltyPoints || 0,
  });
});

// @desc    Obter histórico de transações de pontos do cliente
// @route   GET /api/loyalty/transactions
// @access  Private
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await LoyaltyTransaction.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(transactions);
});

// @desc    Adicionar pontos ao cliente (após um agendamento concluído)
// @route   POST /api/loyalty/add-points
// @access  Private (admin)
const addPoints = asyncHandler(async (req, res) => {
  const { userId, appointmentId, points, description } = req.body;

  // Verificar se o usuário existe
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }

  // Verificar se o agendamento existe
  if (appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      res.status(404);
      throw new Error('Agendamento não encontrado');
    }
  }

  // Calcular data de expiração (1 ano a partir de agora)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Criar transação
  const transaction = await LoyaltyTransaction.create({
    user: userId,
    type: 'earn',
    points,
    description: description || 'Pontos adicionados por serviço concluído',
    relatedTo: appointmentId
      ? {
          model: 'Appointment',
          id: appointmentId,
        }
      : undefined,
    expiresAt,
  });

  // Atualizar pontos do usuário
  user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
  await user.save();

  res.status(201).json(transaction);
});

// @desc    Resgatar pontos por uma recompensa
// @route   POST /api/loyalty/redeem
// @access  Private
const redeemPoints = asyncHandler(async (req, res) => {
  const { rewardId } = req.body;

  // Buscar o programa de fidelidade
  const program = await LoyaltyProgram.findOne({ isActive: true });
  if (!program) {
    res.status(404);
    throw new Error('Programa de fidelidade não encontrado');
  }

  // Buscar a recompensa
  const reward = program.rewards.find(
    (r) => r._id.toString() === rewardId && r.isActive
  );
  if (!reward) {
    res.status(404);
    throw new Error('Recompensa não encontrada ou inativa');
  }

  // Verificar se o usuário tem pontos suficientes
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }

  if ((user.loyaltyPoints || 0) < reward.pointsRequired) {
    res.status(400);
    throw new Error('Pontos insuficientes para resgatar esta recompensa');
  }

  // Criar transação de resgate
  const transaction = await LoyaltyTransaction.create({
    user: req.user._id,
    type: 'redeem',
    points: -reward.pointsRequired,
    description: `Resgate de recompensa: ${reward.name}`,
    relatedTo: {
      model: 'LoyaltyProgram',
      id: program._id,
    },
  });

  // Atualizar pontos do usuário
  user.loyaltyPoints -= reward.pointsRequired;
  await user.save();

  res.status(201).json({
    transaction,
    reward,
    remainingPoints: user.loyaltyPoints,
  });
});

// @desc    Calcular e adicionar pontos automaticamente após um agendamento concluído
// @route   POST /api/loyalty/process-appointment
// @access  Private (admin)
const processAppointmentPoints = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  // Buscar o agendamento com os dados relacionados
  const appointment = await Appointment.findById(appointmentId)
    .populate('client')
    .populate('service');

  if (!appointment) {
    res.status(404);
    throw new Error('Agendamento não encontrado');
  }

  // Verificar se o agendamento foi concluído
  if (appointment.status !== 'completed') {
    res.status(400);
    throw new Error('Apenas agendamentos concluídos podem gerar pontos');
  }

  // Buscar o programa de fidelidade
  const program = await LoyaltyProgram.findOne({ isActive: true });
  if (!program || !program.isActive) {
    res.status(400);
    throw new Error('Programa de fidelidade não está ativo');
  }

  // Calcular pontos com base no preço do serviço
  const points = Math.floor(appointment.service.price * program.pointsPerCurrency);

  // Verificar se já existem pontos para este agendamento
  const existingTransaction = await LoyaltyTransaction.findOne({
    'relatedTo.model': 'Appointment',
    'relatedTo.id': appointmentId,
    type: 'earn',
  });

  if (existingTransaction) {
    res.status(400);
    throw new Error('Este agendamento já gerou pontos');
  }

  // Calcular data de expiração (1 ano a partir de agora)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Criar transação
  const transaction = await LoyaltyTransaction.create({
    user: appointment.client._id,
    type: 'earn',
    points,
    description: `Pontos por serviço: ${appointment.service.name}`,
    relatedTo: {
      model: 'Appointment',
      id: appointmentId,
    },
    expiresAt,
  });

  // Atualizar pontos do usuário
  const user = await User.findById(appointment.client._id);
  user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
  await user.save();

  res.status(201).json({
    transaction,
    points,
    totalPoints: user.loyaltyPoints,
  });
});

module.exports = {
  getLoyaltyProgram,
  updateLoyaltyProgram,
  addReward,
  updateReward,
  getUserPoints,
  getUserTransactions,
  addPoints,
  redeemPoints,
  processAppointmentPoints,
};