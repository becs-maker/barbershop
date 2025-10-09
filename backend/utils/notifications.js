const nodemailer = require('nodemailer');

// Email transporter - only create if credentials are provided
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// Twilio client - only initialize if credentials are valid
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send email
exports.sendEmail = async ({ to, subject, text, html }) => {
  if (!emailTransporter) {
    console.log('Email not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Send SMS
exports.sendSMS = async ({ to, message }) => {
  if (!twilioClient) {
    console.log('Twilio not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error: error.message };
  }
};

// Send WhatsApp message
exports.sendWhatsApp = async ({ to, message }) => {
  if (!twilioClient) {
    console.log('Twilio not configured');
    return { success: false, error: 'WhatsApp service not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`
    });
    console.log('WhatsApp sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};

// Send appointment confirmation
exports.sendAppointmentConfirmation = async (appointment, customer, method = 'email') => {
  const message = `Your appointment is confirmed for ${appointment.date} at ${appointment.startTime}. See you soon!`;
  
  if (method === 'email' && customer.user.email) {
    return await exports.sendEmail({
      to: customer.user.email,
      subject: 'Appointment Confirmation',
      text: message,
      html: `<p>${message}</p>`
    });
  } else if (method === 'sms' && customer.user.phone) {
    return await exports.sendSMS({
      to: customer.user.phone,
      message
    });
  } else if (method === 'whatsapp' && customer.user.phone) {
    return await exports.sendWhatsApp({
      to: customer.user.phone,
      message
    });
  }
};

// Send appointment reminder
exports.sendAppointmentReminder = async (appointment, customer) => {
  const message = `Reminder: You have an appointment tomorrow at ${appointment.startTime}. Looking forward to seeing you!`;
  
  const preferences = customer.preferences?.notificationPreferences || {};
  
  if (preferences.email) {
    await exports.sendEmail({
      to: customer.user.email,
      subject: 'Appointment Reminder',
      text: message,
      html: `<p>${message}</p>`
    });
  }
  
  if (preferences.sms) {
    await exports.sendSMS({
      to: customer.user.phone,
      message
    });
  }
  
  if (preferences.whatsapp) {
    await exports.sendWhatsApp({
      to: customer.user.phone,
      message
    });
  }
};
