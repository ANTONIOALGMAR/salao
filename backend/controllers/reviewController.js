const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// @desc    Criar uma nova avaliação
// @route   POST /api/reviews
// @access  Private (apenas clientes)
const createReview = asyncHandler(async (req, res) => {
  const { appointmentId, rating, comment, photos } = req.body;

  // Verificar se o agendamento existe e pertence ao cliente
  const appointment = await Appointment.findById(appointmentId);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Agendamento não encontrado');
  }

  // Verificar se o agendamento pertence ao cliente logado
  if (appointment.client.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Não autorizado, este agendamento não pertence a você');
  }

  // Verificar se o agendamento foi concluído
  if (appointment.status !== 'completed') {
    res.status(400);
    throw new Error('Você só pode avaliar serviços concluídos');
  }

  // Verificar se já existe uma avaliação para este agendamento
  const existingReview = await Review.findOne({ appointment: appointmentId });
  if (existingReview) {
    res.status(400);
    throw new Error('Você já avaliou este serviço');
  }

  // Criar a avaliação
  const review = await Review.create({
    client: req.user._id,
    service: appointment.service,
    employee: appointment.employee,
    appointment: appointmentId,
    rating,
    comment,
    photos: photos || [],
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Dados de avaliação inválidos');
  }
});

// @desc    Obter todas as avaliações
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { service, employee } = req.query;
  const filter = {};

  // Filtrar por serviço se fornecido
  if (service) {
    filter.service = service;
  }

  // Filtrar por funcionário se fornecido
  if (employee) {
    filter.employee = employee;
  }

  const reviews = await Review.find(filter)
    .populate('client', 'name')
    .populate('service', 'name')
    .populate('employee', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Obter uma avaliação por ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('client', 'name')
    .populate('service', 'name')
    .populate('employee', 'name');

  if (review) {
    res.json(review);
  } else {
    res.status(404);
    throw new Error('Avaliação não encontrada');
  }
});

// @desc    Atualizar uma avaliação
// @route   PUT /api/reviews/:id
// @access  Private (apenas o cliente que criou a avaliação)
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment, photos } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Avaliação não encontrada');
  }

  // Verificar se a avaliação pertence ao cliente logado
  if (review.client.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Não autorizado, esta avaliação não pertence a você');
  }

  // Atualizar os campos
  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  review.photos = photos || review.photos;

  const updatedReview = await review.save();
  res.json(updatedReview);
});

// @desc    Excluir uma avaliação
// @route   DELETE /api/reviews/:id
// @access  Private (apenas o cliente que criou a avaliação ou admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Avaliação não encontrada');
  }

  // Verificar se o usuário é o cliente que criou a avaliação ou um admin
  if (
    review.client.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(401);
    throw new Error('Não autorizado para excluir esta avaliação');
  }

  await Review.deleteOne({ _id: req.params.id });
  res.json({ message: 'Avaliação removida' });
});

// @desc    Obter média de avaliações para um serviço
// @route   GET /api/reviews/average/service/:id
// @access  Public
const getServiceAverageRating = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;
  const averageRating = await Review.getAverageRating(serviceId);
  res.json(averageRating);
});

// @desc    Obter média de avaliações para um funcionário
// @route   GET /api/reviews/average/employee/:id
// @access  Public
const getEmployeeAverageRating = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;
  const averageRating = await Review.getEmployeeAverageRating(employeeId);
  res.json(averageRating);
});

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getServiceAverageRating,
  getEmployeeAverageRating,
};