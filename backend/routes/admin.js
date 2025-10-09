const express = require('express');
const router = express.Router();
const { Appointment, Customer, Expense, Service, Barber, LoyaltyRule, User, sequelize } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin/Staff)
router.get('/dashboard', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateWhere = {};
    if (startDate && endDate) {
      dateWhere = {
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
    } else {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      dateWhere = {
        date: {
          [Op.between]: [monthStart, monthEnd]
        }
      };
    }

    // Total revenue
    const revenueResult = await Appointment.sum('finalPrice', {
      where: {
        ...dateWhere,
        status: 'completed',
        paymentStatus: 'paid'
      }
    });
    const totalRevenue = revenueResult || 0;

    // Total expenses
    const expensesResult = await Expense.sum('amount', {
      where: dateWhere
    });
    const totalExpenses = expensesResult || 0;

    // Net profit
    const netProfit = totalRevenue - totalExpenses;

    // Total bookings
    const totalBookings = await Appointment.count({ where: dateWhere });

    // New customers
    const newCustomers = await Customer.count({
      where: {
        createdAt: dateWhere.date
      }
    });

    // Top services - simplified
    const topServices = await Appointment.findAll({
      where: {
        ...dateWhere,
        status: 'completed'
      },
      attributes: [
        'serviceId',
        [sequelize.fn('COUNT', sequelize.col('serviceId')), 'count'],
        [sequelize.fn('SUM', sequelize.col('finalPrice')), 'revenue']
      ],
      include: [{ model: Service, as: 'service' }],
      group: ['serviceId', 'service.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('serviceId')), 'DESC']],
      limit: 5
    });

    // Bookings by status
    const bookingsByStatus = await Appointment.findAll({
      where: dateWhere,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalExpenses,
        netProfit,
        totalBookings,
        newCustomers,
        topServices,
        bookingsByStatus
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/expenses
// @desc    Add an expense
// @access  Private (Admin/Staff)
router.post('/expenses', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/expenses
// @desc    Get all expenses
// @access  Private (Admin/Staff)
router.get('/expenses', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (category) where.category = category;

    const expenses = await Expense.findAll({
      where,
      include: [{ model: User, as: 'addedByUser' }],
      order: [['date', 'DESC']]
    });

    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    res.json({
      success: true,
      count: expenses.length,
      totalAmount,
      expenses
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/expenses/:id
// @desc    Update an expense
// @access  Private (Admin)
router.put('/expenses/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.update(req.body);

    res.json({
      success: true,
      expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/expenses/:id
// @desc    Delete an expense
// @access  Private (Admin)
router.delete('/expenses/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.destroy();

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/appointments/:id/complete
// @desc    Mark appointment as completed
// @access  Private (Admin/Staff)
router.put('/appointments/:id/complete', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Service, as: 'service' },
        { model: Barber, as: 'barber' }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update({
      status: 'completed',
      paymentStatus: 'paid'
    });

    // Update customer stats
    const customer = await Customer.findByPk(appointment.customerId);
    const visitHistory = customer.visitHistory || [];
    visitHistory.push({
      date: appointment.date,
      serviceId: appointment.serviceId,
      barberId: appointment.barberId,
      amount: appointment.finalPrice,
      rating,
      feedback
    });

    await customer.update({
      totalVisits: customer.totalVisits + 1,
      totalSpent: parseFloat(customer.totalSpent) + parseFloat(appointment.finalPrice),
      loyaltyPoints: customer.loyaltyPoints + appointment.service.loyaltyPoints,
      visitHistory
    });

    // Check loyalty rules and apply rewards
    const rules = await LoyaltyRule.findAll({ where: { isActive: true } });
    const discountsEarned = customer.discountsEarned || [];

    for (const rule of rules) {
      let eligible = false;

      if (rule.type === 'visit-count' && customer.totalVisits >= rule.threshold) {
        eligible = true;
      } else if (rule.type === 'amount-spent' && parseFloat(customer.totalSpent) >= rule.threshold) {
        eligible = true;
      } else if (rule.type === 'points' && customer.loyaltyPoints >= rule.threshold) {
        eligible = true;
      }

      if (eligible) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + rule.expiryDays);

        discountsEarned.push({
          type: rule.reward.type,
          value: rule.reward.value,
          reason: `Loyalty reward: ${rule.name}`,
          expiresAt
        });
      }
    }

    if (discountsEarned.length > (customer.discountsEarned || []).length) {
      await customer.update({ discountsEarned });
    }

    // Update barber stats
    const barber = await Barber.findByPk(appointment.barberId);
    const updates = {
      totalAppointments: barber.totalAppointments + 1
    };

    if (rating) {
      const newCount = barber.ratingCount + 1;
      const newAverage = ((barber.ratingAverage * barber.ratingCount) + rating) / newCount;
      updates.ratingAverage = newAverage;
      updates.ratingCount = newCount;
    }

    await barber.update(updates);

    // Update service popularity
    const service = await Service.findByPk(appointment.serviceId);
    await service.update({ popularity: service.popularity + 1 });

    res.json({
      success: true,
      appointment,
      customer
    });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
