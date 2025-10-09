const express = require('express');
const router = express.Router();
const { Appointment, Customer } = require('../models');
const { sendAppointmentReminder } = require('../utils/notifications');

// @route   POST /api/notifications/send-reminders
// @desc    Send appointment reminders for tomorrow
// @access  Private (Admin/Staff) - Can be called by cron job
router.post('/send-reminders', async (req, res) => {
  try {
    // Get appointments for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: {
        $gte: tomorrow,
        $lte: endOfTomorrow
      },
      status: 'confirmed',
      reminderSent: false
    }).populate({
      path: 'customer',
      populate: { path: 'user' }
    });

    let sentCount = 0;
    const errors = [];

    for (const appointment of appointments) {
      try {
        await sendAppointmentReminder(appointment, appointment.customer);
        appointment.reminderSent = true;
        await appointment.save();
        sentCount++;
      } catch (error) {
        console.error(`Error sending reminder for appointment ${appointment._id}:`, error);
        errors.push({
          appointmentId: appointment._id,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Sent ${sentCount} reminders`,
      totalAppointments: appointments.length,
      sentCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/notifications/test-email
// @desc    Test email notification
// @access  Private (Admin)
router.post('/test-email', async (req, res) => {
  try {
    const { sendEmail } = require('../utils/notifications');
    const { to, subject, message } = req.body;

    const result = await sendEmail({
      to: to || process.env.EMAIL_USER,
      subject: subject || 'Test Email',
      text: message || 'This is a test email from Barbershop API',
      html: `<p>${message || 'This is a test email from Barbershop API'}</p>`
    });

    res.json({
      success: result.success,
      message: result.success ? 'Email sent successfully' : 'Failed to send email',
      details: result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/notifications/test-sms
// @desc    Test SMS notification
// @access  Private (Admin)
router.post('/test-sms', async (req, res) => {
  try {
    const { sendSMS } = require('../utils/notifications');
    const { to, message } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const result = await sendSMS({
      to,
      message: message || 'This is a test SMS from Barbershop'
    });

    res.json({
      success: result.success,
      message: result.success ? 'SMS sent successfully' : 'Failed to send SMS',
      details: result
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
