const { Contact } = require('../models-sql');
const { Op } = require('sequelize');

/**
 * @route   GET /api/admin/contacts
 * @desc    Get all contact submissions with pagination and filters
 * @access  Private
 */
const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search
    } = req.query;
    
    const where = {};
    
    // Filter by status
    if (status) {
      where.status = status;
    }
    
    // Search in name, email, or subject
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { rows: contacts, count: totalItems } = await Contact.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    res.status(200).json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/contacts/:id
 * @desc    Get single contact submission
 * @access  Private
 */
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/contacts/:id/status
 * @desc    Update contact status
 * @access  Private
 */
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    contact.status = status;
    await contact.save();
    
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/contacts/:id
 * @desc    Delete contact submission
 * @access  Private
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    await contact.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/contacts/stats/summary
 * @desc    Get contact submissions summary statistics
 * @access  Private
 */
const getContactStats = async (req, res, next) => {
  try {
    const [
      totalContacts,
      newContacts,
      readContacts,
      repliedContacts,
      archivedContacts
    ] = await Promise.all([
      Contact.count(),
      Contact.count({ where: { status: 'new' } }),
      Contact.count({ where: { status: 'read' } }),
      Contact.count({ where: { status: 'replied' } }),
      Contact.count({ where: { status: 'archived' } })
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalContacts,
        new: newContacts,
        read: readContacts,
        replied: repliedContacts,
        archived: archivedContacts
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
};
