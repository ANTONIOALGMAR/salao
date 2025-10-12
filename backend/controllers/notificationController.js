const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const emailService = require('../utils/emailService');

// @desc    Criar uma nova notificação
// @route   POST /api/notifications
// @access  Private (admin)
const createNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, type, relatedTo, sendEmail } = req.body;

  // Verificar se o usuário existe
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }

  // Criar a notificação
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type: type || 'system',
    relatedTo,
    sentViaEmail: false,
  });

  // Enviar email se solicitado
  if (sendEmail) {
    try {
      await emailService.sendEmail(
        user.email,
        title,
        message,
        `<div style="font-family: Arial, sans-serif;">${message}</div>`
      );
      notification.sentViaEmail = true;
      await notification.save();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Continua mesmo se o email falhar
    }
  }

  res.status(201).json(notification);
});

// @desc    Obter todas as notificações do usuário logado
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(notifications);
});

// @desc    Marcar notificação como lida
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notificação não encontrada');
  }

  // Verificar se a notificação pertence ao usuário logado
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  notification.isRead = true;
  await notification.save();

  res.json(notification);
});

// @desc    Marcar todas as notificações como lidas
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ message: 'Todas as notificações foram marcadas como lidas' });
});

// @desc    Excluir uma notificação
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notificação não encontrada');
  }

  // Verificar se a notificação pertence ao usuário logado
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  await Notification.deleteOne({ _id: req.params.id });
  res.json({ message: 'Notificação removida' });
});

// @desc    Enviar lembretes de agendamentos
// @route   POST /api/notifications/send-reminders
// @access  Private (admin)
const sendAppointmentReminders = asyncHandler(async (req, res) => {
  // Buscar agendamentos para o dia seguinte
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);

  const appointments = await Appointment.find({
    date: { $gte: tomorrow, $lt: nextDay },
    status: 'confirmed',
  })
    .populate('client')
    .populate('service')
    .populate('employee');

  const results = {
    total: appointments.length,
    sent: 0,
    failed: 0,
  };

  // Enviar lembretes para cada agendamento
  for (const appointment of appointments) {
    try {
      // Verificar se já existe uma notificação para este agendamento
      const existingNotification = await Notification.findOne({
        'relatedTo.model': 'Appointment',
        'relatedTo.id': appointment._id,
        type: 'appointment_reminder',
      });

      if (existingNotification) {
        continue; // Pular se já existe uma notificação
      }

      // Enviar email
      await emailService.sendAppointmentReminder(
        appointment,
        appointment.client,
        appointment.service,
        appointment.employee
      );

      // Criar notificação
      await Notification.create({
        user: appointment.client._id,
        title: 'Lembrete de Agendamento',
        message: `Você tem um agendamento amanhã às ${appointment.startTime} para ${appointment.service.name} com ${appointment.employee.name}.`,
        type: 'appointment_reminder',
        relatedTo: {
          model: 'Appointment',
          id: appointment._id,
        },
        sentViaEmail: true,
      });

      results.sent++;
    } catch (error) {
      console.error(`Erro ao enviar lembrete para agendamento ${appointment._id}:`, error);
      results.failed++;
    }
  }

  res.json(results);
});

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendAppointmentReminders,
};