const { Contact } = require('../models-sql');
const { sendContactEmails } = require('../services/emailService');

/**
 * @route   POST /api/contact
 * @desc    Handle contact form submission
 * @access  Public
 */
const submitContactForm = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      language = 'fr'
    } = req.body;
    
    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    // Create contact submission in database
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
      language,
      ip_address: ipAddress,
      user_agent: userAgent
    });
    
    // Send emails
    try {
      const emailResults = await sendContactEmails({
        name,
        email,
        phone,
        company,
        subject,
        message,
        language,
        ipAddress,
        timestamp: contact.createdAt
      });
      
      // Update contact with email status
      if (emailResults.notification) {
        contact.email_sent = true;
        contact.email_sent_at = new Date();
        await contact.save();
      }
      
      // Log any email errors (but still return success)
      if (emailResults.errors.length > 0) {
        console.error('Email sending errors:', emailResults.errors);
      }
    } catch (emailError) {
      console.error('Failed to send emails:', emailError.message);
      // Continue - don't fail the request if email fails
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: language === 'fr' 
        ? 'Message envoyé avec succès'
        : 'Message sent successfully',
      data: {
        id: contact.id,
        timestamp: contact.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm
};
