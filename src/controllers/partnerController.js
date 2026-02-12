const { Partner } = require('../models-sql');

/**
 * @route   GET /api/content/partners
 * @desc    Get all active partners (public)
 * @access  Public
 */
const getPublicPartners = async (req, res, next) => {
  try {
    const partners = await Partner.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/partners
 * @desc    Get all partners (admin)
 * @access  Private
 */
const getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.findAll({
      order: [['display_order', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/partners/:id
 * @desc    Get single partner
 * @access  Private
 */
const getPartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/admin/partners
 * @desc    Add new partner
 * @access  Private
 */
const createPartner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Logo file is required'
      });
    }
    
    const {
      name,
      website,
      order = 0,
      isActive = true
    } = req.body;
    
    // Convert image buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const partner = await Partner.create({
      name,
      logo: base64Image,
      logo_mime_type: req.file.mimetype,
      website,
      display_order: order,
      is_active: isActive
    });
    
    res.status(201).json({
      success: true,
      message: 'Partner added successfully',
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/partners/:id
 * @desc    Update partner
 * @access  Private
 */
const updatePartner = async (req, res, next) => {
  try {
    let partner = await Partner.findByPk(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    const {
      name,
      website,
      order,
      isActive
    } = req.body;
    
    // Update logo if new file uploaded
    if (req.file) {
      // Convert new logo to base64
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      partner.logo = base64Image;
      partner.logo_mime_type = req.file.mimetype;
    }
    
    // Update fields
    if (name !== undefined) partner.name = name;
    if (website !== undefined) partner.website = website;
    if (order !== undefined) partner.display_order = order;
    if (isActive !== undefined) partner.is_active = isActive;
    
    await partner.save();
    
    res.status(200).json({
      success: true,
      message: 'Partner updated successfully',
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/partners/:id
 * @desc    Delete partner
 * @access  Private
 */
const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    // Delete from database (no file cleanup needed)
    await partner.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/partners/reorder
 * @desc    Reorder partners
 * @access  Private
 */
const reorderPartners = async (req, res, next) => {
  try {
    const { partners } = req.body;
    
    if (!partners || !Array.isArray(partners)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid partners array'
      });
    }
    
    // Update order for each partner
    const updatePromises = partners.map(({ id, order }) => 
      Partner.update(
        { display_order: order },
        { where: { id } }
      )
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Partners reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicPartners,
  getAllPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartners
};
