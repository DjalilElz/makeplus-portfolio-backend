const { Stats } = require('../models-sql');

/**
 * @route   GET /api/content/stats
 * @desc    Get current statistics (public)
 * @access  Public
 */
const getPublicStats = async (req, res, next) => {
  try {
    let stats = await Stats.findByPk(1);
    
    // If no stats exist, create default
    if (!stats) {
      stats = await Stats.create({ id: 1 });
    }
    
    res.status(200).json({
      success: true,
      data: {
        internationalCongress: stats.international_congress_value,
        symposium: stats.symposium_value,
        satisfiedCompanies: stats.satisfied_companies_value
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get all statistics (admin)
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    let stats = await Stats.findByPk(1);
    
    // If no stats exist, create default
    if (!stats) {
      stats = await Stats.create({ id: 1 });
    }
    
    res.status(200).json({
      success: true,
      data: stats.toAPIFormat()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/stats
 * @desc    Update statistics
 * @access  Private
 */
const updateStats = async (req, res, next) => {
  try {
    let stats = await Stats.findByPk(1);
    
    if (!stats) {
      stats = await Stats.create({ id: 1 });
    }
    
    const {
      internationalCongress,
      symposium,
      satisfiedCompanies
    } = req.body;
    
    // Update fields if provided
    if (internationalCongress) {
      if (internationalCongress.value !== undefined) {
        stats.international_congress_value = internationalCongress.value;
      }
      if (internationalCongress.labelFr !== undefined) {
        stats.international_congress_label_fr = internationalCongress.labelFr;
      }
      if (internationalCongress.labelEn !== undefined) {
        stats.international_congress_label_en = internationalCongress.labelEn;
      }
    }
    
    if (symposium) {
      if (symposium.value !== undefined) {
        stats.symposium_value = symposium.value;
      }
      if (symposium.labelFr !== undefined) {
        stats.symposium_label_fr = symposium.labelFr;
      }
      if (symposium.labelEn !== undefined) {
        stats.symposium_label_en = symposium.labelEn;
      }
    }
    
    if (satisfiedCompanies) {
      if (satisfiedCompanies.value !== undefined) {
        stats.satisfied_companies_value = satisfiedCompanies.value;
      }
      if (satisfiedCompanies.labelFr !== undefined) {
        stats.satisfied_companies_label_fr = satisfiedCompanies.labelFr;
      }
      if (satisfiedCompanies.labelEn !== undefined) {
        stats.satisfied_companies_label_en = satisfiedCompanies.labelEn;
      }
    }
    
    stats.updated_by = req.admin.id;
    
    await stats.save();
    
    res.status(200).json({
      success: true,
      message: 'Statistics updated successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicStats,
  getStats,
  updateStats
};
