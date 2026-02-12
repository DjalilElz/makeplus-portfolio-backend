const nodemailer = require('nodemailer');
const { getNotificationTemplate } = require('../templates/notificationEmail');
const { getAutoReplyTemplate } = require('../templates/autoReplyEmail');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

/**
 * Send notification email to admin (contact@makeplus.com)
 */
const sendNotificationEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `[Makeplus Contact] ${contactData.subject}`,
      html: getNotificationTemplate(contactData)
    };
    
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Notification email sent to ${process.env.EMAIL_TO}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending notification email:', error.message);
    throw error;
  }
};

/**
 * Send auto-reply email to user
 */
const sendAutoReplyEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const subject = contactData.language === 'fr' 
      ? 'Merci pour votre message - Makeplus'
      : 'Thank you for your message - Makeplus';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: subject,
      html: getAutoReplyTemplate(contactData)
    };
    
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Auto-reply email sent to ${contactData.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending auto-reply email:', error.message);
    throw error;
  }
};

/**
 * Send both notification and auto-reply emails
 */
const sendContactEmails = async (contactData) => {
  const results = {
    notification: false,
    autoReply: false,
    errors: []
  };
  
  try {
    // Send notification email to admin
    await sendNotificationEmail(contactData);
    results.notification = true;
  } catch (error) {
    results.errors.push({ type: 'notification', error: error.message });
  }
  
  try {
    // Send auto-reply to user
    await sendAutoReplyEmail(contactData);
    results.autoReply = true;
  } catch (error) {
    results.errors.push({ type: 'autoReply', error: error.message });
  }
  
  return results;
};

module.exports = {
  sendNotificationEmail,
  sendAutoReplyEmail,
  sendContactEmails
};
