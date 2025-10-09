const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Appointment, Customer, Barber, Service, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { sendAppointmentConfirmation } = require('../utils/notifications');
const { Op } = require('sequelize');

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a barber on a specific date
// @access  Public
router.get('/available-slots', async (req, res) => {
  try {
    const { barberId, date } = req.query;

    if (!barberId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Barber ID and date are required'
      });
    }

    const barber = await Barber.findByPk(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // Parse availability JSON if needed
    const availabilityArray = typeof barber.availability === 'string' 
      ? JSON.parse(barber.availability) 
      : barber.availability;

    // Check barber availability for this day
    const availability = availabilityArray?.find(a => a.dayOfWeek === dayOfWeek);
    if (!availability) {
      return res.json({
        success: true,
        slots: []
      });
    }

    // Parse blocked dates JSON if needed
    const blockedDatesArray = typeof barber.blockedDates === 'string'
      ? JSON.parse(barber.blockedDates || '[]')
      : (barber.blockedDates || []);

    // Check if date is blocked
    const isBlocked = blockedDatesArray.some(bd => {
      const blockedDate = new Date(bd.date);
      return blockedDate.toDateString() === requestedDate.toDateString();
    });

    if (isBlocked) {
      return res.json({
        success: true,
        slots: []
      });
    }

    // Get existing appointments for this barber on this date
    const existingAppointments = await Appointment.findAll({
      where: {
        barberId: barberId,
        date: date,
        status: { [Op.notIn]: ['cancelled', 'no-show'] }
      }
    });

    // Generate time slots (30-minute intervals)
    const slots = [];
    const [startHour, startMinute] = availability.startTime.split(':').map(Number);
    const [endHour, endMinute] = availability.endTime.split(':').map(Number);

    let currentTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60);
      const minute = currentTime % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Check if slot is available
      const isBooked = existingAppointments.some(apt => {
        return apt.startTime === timeString;
      });

      slots.push({
        time: timeString,
        available: !isBooked
      });

      currentTime += 30; // 30-minute intervals
    }

    res.json({
      success: true,
      slots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', [
  protect,
  body('barberId').notEmpty().withMessage('Barber is required'),
  body('serviceId').notEmpty().withMessage('Service is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { barberId, serviceId, date, startTime, notes } = req.body;

    // Get customer
    const customer = await Customer.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user' }]
    });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // Verify barber and service exist
    const barber = await Barber.findByPk(barberId);
    const service = await Service.findByPk(serviceId);

    if (!barber || !service) {
      return res.status(404).json({
        success: false,
        message: 'Barber or service not found'
      });
    }

    // Calculate end time
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + service.duration;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    // Check for conflicts
    const conflict = await Appointment.findOne({
      where: {
        barberId: barberId,
        date: date,
        startTime: startTime,
        status: { [Op.notIn]: ['cancelled', 'no-show'] }
      }
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Check for available discounts
    let discountApplied = 0;
    const discountsEarned = typeof customer.discountsEarned === 'string' 
      ? JSON.parse(customer.discountsEarned || '[]')
      : (customer.discountsEarned || []);
    
    const availableDiscount = discountsEarned.find(d => !d.used && new Date(d.expiresAt) > new Date());
    
    if (availableDiscount) {
      if (availableDiscount.type === 'percentage') {
        discountApplied = (service.price * availableDiscount.value) / 100;
      } else if (availableDiscount.type === 'fixed') {
        discountApplied = availableDiscount.value;
      }
    }

    const finalPrice = Math.max(0, parseFloat(service.price) - discountApplied);

    // Create appointment
    const appointment = await Appointment.create({
      customerId: customer.id,
      barberId,
      serviceId,
      date,
      startTime,
      endTime,
      notes,
      price: service.price,
      discountApplied,
      finalPrice,
      status: 'confirmed'
    });

    // Mark discount as used
    if (availableDiscount) {
      availableDiscount.used = true;
      availableDiscount.usedAt = new Date();
      await customer.update({ 
        discountsEarned: JSON.stringify(discountsEarned) 
      });
    }

    // Send confirmation (optional - skip if fails)
    try {
      await sendAppointmentConfirmation(appointment, customer, 'email');
    } catch (notificationError) {
      console.log('Notification error (non-critical):', notificationError.message);
    }

    // Populate appointment details
    const populatedAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Barber, as: 'barber' },
        { model: Service, as: 'service' },
        { model: Customer, as: 'customer' }
      ]
    });

    res.status(201).json({
      success: true,
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get current user's appointments
// @access  Private
router.get('/my-appointments', protect, async (req, res) => {
  try {
    const customer = await Customer.findOne({ 
      where: { userId: req.user.id }
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const appointments = await Appointment.findAll({
      where: { customerId: customer.id },
      include: [
        { 
          model: Barber, 
          as: 'barber',
          include: [{ model: User, as: 'user' }]
        },
        { model: Service, as: 'service' }
      ],
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const customer = await Customer.findOne({ 
      where: { userId: req.user.id }
    });
    
    // Check if user owns this appointment or is admin/staff
    if (appointment.customerId !== customer.id && 
        !['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    await appointment.update({
      status: 'cancelled',
      cancelledBy: req.user.id,
      cancelledAt: new Date(),
      cancellationReason: req.body.reason || ''
    });

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments (admin/staff)
// @access  Private (Admin/Staff)
router.get('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status, date, barberId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (barberId) where.barberId = barberId;
    if (date) where.date = date;

    const appointments = await Appointment.findAll({
      where,
      include: [
        { 
          model: Customer, 
          as: 'customer',
          include: [{ model: User, as: 'user' }]
        },
        { 
          model: Barber, 
          as: 'barber',
          include: [{ model: User, as: 'user' }]
        },
        { model: Service, as: 'service' }
      ],
      order: [['date', 'DESC'], ['startTime', 'ASC']]
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
