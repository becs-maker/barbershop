const express = require('express');
const router = express.Router();
const { Customer, User, Service, Barber } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/customers/profile
// @desc    Get customer profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
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

    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/customers/preferences
// @desc    Update customer preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { favoriteBarber, favoriteServices, notificationPreferences } = req.body;

    const customer = await Customer.findOne({ 
      where: { userId: req.user.id }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // Parse preferences JSON
    const preferences = typeof customer.preferences === 'string' 
      ? JSON.parse(customer.preferences) 
      : customer.preferences;

    if (favoriteBarber) preferences.favoriteBarber = favoriteBarber;
    if (favoriteServices) preferences.favoriteServices = favoriteServices;
    if (notificationPreferences) {
      preferences.notificationPreferences = {
        ...preferences.notificationPreferences,
        ...notificationPreferences
      };
    }

    await customer.update({ preferences: JSON.stringify(preferences) });

    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/customers
// @desc    Get all customers (admin/staff)
// @access  Private (Admin/Staff)
router.get('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID (admin/staff)
// @access  Private (Admin/Staff)
router.get('/:id', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
