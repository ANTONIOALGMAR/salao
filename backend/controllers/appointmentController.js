const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// Helper function to calculate end time
const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private/Client & Employee
const createAppointment = asyncHandler(async (req, res) => {
  const { client, employee, service, date, startTime } = req.body;

  // Basic validation
  if (!client || !employee || !service || !date || !startTime) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const serviceDetails = await Service.findById(service);
  if (!serviceDetails) {
    res.status(404);
    throw new Error('Service not found');
  }

  const endTime = calculateEndTime(startTime, serviceDetails.duration);

  // Check for overlapping appointments for the employee
  const existingAppointment = await Appointment.findOne({
    employee,
    date: new Date(date),
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // New appointment starts before existing ends and ends after existing starts
    ],
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('Employee is not available at this time');
  }

  const appointment = await Appointment.create({
    client,
    employee,
    service,
    date: new Date(date),
    startTime,
    endTime,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
});

// @desc    Get all appointments (Admin/Employee)
// @route   GET /api/appointments
// @access  Private/Admin & Employee
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('client', 'name email')
    .populate('employee', 'name email')
    .populate('service', 'name price duration');
  res.json(appointments);
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private/Admin & Employee & Client (if owns)
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('client', 'name email')
    .populate('employee', 'name email')
    .populate('service', 'name price duration');

  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private/Admin & Employee
const updateAppointment = asyncHandler(async (req, res) => {
  const { date, startTime, status } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    appointment.date = date ? new Date(date) : appointment.date;
    appointment.startTime = startTime || appointment.startTime;
    appointment.status = status || appointment.status;

    // Recalculate endTime if startTime or service changes (not implemented here for simplicity)
    // For a real app, you'd re-fetch service details and recalculate endTime

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Get available time slots for an employee on a specific date
// @route   GET /api/appointments/available/:employeeId/:date
// @access  Public
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { employeeId, date } = req.params;

  // Assuming working hours are 9:00 to 17:00 (8 hours) and services are 30min, 60min, etc.
  const workingHoursStart = 9 * 60; // 9:00 AM in minutes
  const workingHoursEnd = 17 * 60; // 5:00 PM in minutes
  const slotDuration = 30; // Check availability in 30-minute increments

  const requestedDate = new Date(date);
  requestedDate.setHours(0, 0, 0, 0); // Normalize date to start of day

  const appointments = await Appointment.find({
    employee: employeeId,
    date: requestedDate,
  }).select('startTime endTime');

  const bookedSlots = appointments.map((app) => ({
    start: app.startTime,
    end: app.endTime,
  }));

  const availableSlots = [];
  for (
    let time = workingHoursStart;
    time < workingHoursEnd;
    time += slotDuration
  ) {
    const currentSlotStart = `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
    const currentSlotEnd = `${String(Math.floor((time + slotDuration) / 60)).padStart(2, '0')}:${String((time + slotDuration) % 60).padStart(2, '0')}`;

    let isBooked = false;
    for (let i = 0; i < bookedSlots.length; i += 1) {
      const booked = bookedSlots[i];
      // Check for overlap: (start1 < end2 && end1 > start2)
      if (currentSlotStart < booked.end && currentSlotEnd > booked.start) {
        isBooked = true;
        break;
      }
    }

    if (!isBooked) {
      availableSlots.push(currentSlotStart);
    }
  }

  res.json(availableSlots);
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
};
