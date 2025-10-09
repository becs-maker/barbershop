const express = require('express');
const router = express.Router();
const { Customer, LoyaltyRule } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/loyalty/my-points
// @desc    Get current user's loyalty points and discounts
// @access  Private
router.get('/my-points', protect, async (req, res) => {
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

    const discountsEarned = typeof customer.discountsEarned === 'string'
      ? JSON.parse(customer.discountsEarned || '[]')
      : (customer.discountsEarned || []);

    const availableDiscounts = discountsEarned.filter(
      d => !d.used && new Date(d.expiresAt) > new Date()
    );

    res.json({
      success: true,
      loyaltyPoints: customer.loyaltyPoints,
      totalVisits: customer.totalVisits,
      totalSpent: customer.totalSpent,
      referralCode: customer.referralCode,
      availableDiscounts
    });
  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/loyalty/rules
// @desc    Get all active loyalty rules
// @access  Public
router.get('/rules', async (req, res) => {
  try {
    const rules = await LoyaltyRule.findAll({ 
      where: { isActive: true }
    });

    res.json({
      success: true,
      count: rules.length,
      rules
    });
  } catch (error) {
    console.error('Get loyalty rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/rules
// @desc    Create a loyalty rule
// @access  Private (Admin)
router.post('/rules', protect, authorize('admin'), async (req, res) => {
  try {
    const rule = await LoyaltyRule.create(req.body);

    res.status(201).json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Create loyalty rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/loyalty/rules/:id
// @desc    Update a loyalty rule
// @access  Private (Admin)
router.put('/rules/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const rule = await LoyaltyRule.findByPk(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty rule not found'
      });
    }

    await rule.update(req.body);

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Update loyalty rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/apply-referral
// @desc    Apply referral code
// @access  Private
router.post('/apply-referral', protect, async (req, res) => {
  try {
    const { referralCode } = req.body;

    const customer = await Customer.findOne({ 
      where: { userId: req.user.id }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    if (customer.referredBy) {
      return res.status(400).json({
        success: false,
        message: 'You have already used a referral code'
      });
    }

    // Find referrer
    const referrer = await Customer.findOne({ 
      where: { referralCode }
    });

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    if (referrer.id === customer.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot use your own referral code'
      });
    }

    // Parse discounts
    const customerDiscounts = typeof customer.discountsEarned === 'string'
      ? JSON.parse(customer.discountsEarned || '[]')
      : (customer.discountsEarned || []);

    // Give discount to new customer
    customerDiscounts.push({
      type: 'percentage',
      value: 10,
      reason: 'Referral bonus',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Apply referral and update
    await customer.update({
      referredBy: referrer.id,
      loyaltyPoints: customer.loyaltyPoints + 50,
      discountsEarned: JSON.stringify(customerDiscounts)
    });

    await referrer.update({
      loyaltyPoints: referrer.loyaltyPoints + 100
    });

    res.json({
      success: true,
      message: 'Referral code applied successfully',
      bonusPoints: 50
    });
  } catch (error) {
    console.error('Apply referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
