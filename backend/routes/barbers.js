const express = require('express');
const router = express.Router();
const { Barber, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/barbers
// @desc    Get all barbers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const barbers = await Barber.findAll({
      where,
      include: [{ model: User, as: 'user' }],
      order: [['ratingAverage', 'DESC']]
    });

    res.json({
      success: true,
      count: barbers.length,
      barbers
    });
  } catch (error) {
    console.error('Get barbers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/barbers/:id
// @desc    Get barber by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const barber = await Barber.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    res.json({
      success: true,
      barber
    });
  } catch (error) {
    console.error('Get barber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/barbers
// @desc    Create a new barber
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { userId, bio, specialties, experience, availability } = req.body;

    // Verify user exists and is staff
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'User must be a staff member'
      });
    }

    // Check if barber profile already exists
    const existingBarber = await Barber.findOne({ 
      where: { userId: userId }
    });
    if (existingBarber) {
      return res.status(400).json({
        success: false,
        message: 'Barber profile already exists for this user'
      });
    }

    const barber = await Barber.create({
      userId: userId,
      bio,
      specialties,
      experience,
      availability
    });

    const populatedBarber = await Barber.findByPk(barber.id, {
      include: [{ model: User, as: 'user' }]
    });

    res.status(201).json({
      success: true,
      barber: populatedBarber
    });
  } catch (error) {
    console.error('Create barber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/barbers/:id
// @desc    Update barber profile
// @access  Private (Admin/Staff)
router.put('/:id', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const barber = await Barber.findByPk(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    // Staff can only update their own profile
    if (req.user.role === 'staff' && barber.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    await barber.update(req.body);

    const updatedBarber = await Barber.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    res.json({
      success: true,
      barber: updatedBarber
    });
  } catch (error) {
    console.error('Update barber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/barbers/:id/block-date
// @desc    Block a date for a barber
// @access  Private (Admin/Staff)
router.post('/:id/block-date', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { date, reason } = req.body;

    const barber = await Barber.findByPk(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    const blockedDates = barber.blockedDates || [];
    blockedDates.push({ date, reason });
    await barber.update({ blockedDates });

    res.json({
      success: true,
      barber
    });
  } catch (error) {
    console.error('Block date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
