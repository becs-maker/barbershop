const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User, Customer } = require('../models');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('preferredLanguage').optional().isIn(['am', 'om', 'ti', 'en']),
  body('referralCode').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: errors.array()[0].msg 
    });
  }

  try {
    const { name, email, phone, password, preferredLanguage, referralCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Check referral code if provided
    let referrerId = null;
    if (referralCode) {
      const referrer = await Customer.findOne({ 
        where: { referralCode }
      });
      if (referrer) {
        referrerId = referrer.id;
        // Give bonus points to referrer
        await referrer.update({
          loyaltyPoints: referrer.loyaltyPoints + 100
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      preferredLanguage: preferredLanguage || 'am',
      role: 'customer'
    });

    // Create customer profile with referral bonus
    const customerData = {
      userId: user.id,
      referredBy: referrerId
    };

    // Give bonus points if referred
    if (referrerId) {
      customerData.loyaltyPoints = 50;
      const discounts = [{
        type: 'percentage',
        value: 10,
        reason: 'Referral bonus',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }];
      customerData.discountsEarned = JSON.stringify(discounts);
    }

    const customer = await Customer.create(customerData);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      },
      customer: {
        id: customer.id,
        loyaltyPoints: customer.loyaltyPoints,
        referralCode: customer.referralCode
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    let additionalData = {};
    if (user.role === 'customer') {
      const customer = await Customer.findOne({ where: { userId: user.id } });
      additionalData.customer = customer;
    }

    res.json({
      success: true,
      user,
      ...additionalData
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone, preferredLanguage } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;

    await User.update(updateData, {
      where: { id: req.user.id }
    });

    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
