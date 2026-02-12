/**
 * Generate notification email template for admin
 */
const getNotificationTemplate = (contactData) => {
  const {
    name,
    email,
    phone,
    company,
    subject,
    message,
    ipAddress,
    timestamp
  } = contactData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #872c7a, #9333ea);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      background: #f9f9f9;
    }
    .field {
      margin-bottom: 20px;
      background: white;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid #872c7a;
    }
    .label {
      font-weight: bold;
      color: #872c7a;
      margin-bottom: 5px;
      font-size: 12px;
      text-transform: uppercase;
    }
    .value {
      color: #333;
      font-size: 14px;
      margin-top: 5px;
      word-wrap: break-word;
    }
    .message-box {
      background: white;
      padding: 20px;
      border-radius: 5px;
      border-left: 4px solid #9333ea;
      margin-top: 20px;
      white-space: pre-wrap;
    }
    .footer {
      padding: 20px;
      background: #333;
      color: #ccc;
      font-size: 12px;
      text-align: center;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📧 New Contact Form Submission</h2>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Makeplus Portfolio Website</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${name}</div>
      </div>
      
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}" style="color: #872c7a; text-decoration: none;">${email}</a></div>
      </div>
      
      ${phone ? `
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${phone}</div>
      </div>
      ` : ''}
      
      ${company ? `
      <div class="field">
        <div class="label">Company</div>
        <div class="value">${company}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${subject}</div>
      </div>
      
      <div class="message-box">
        <div class="label">Message</div>
        <div class="value">${message}</div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Submission Details</strong></p>
      <p>Submitted on: ${new Date(timestamp).toLocaleString('en-US', { 
        dateStyle: 'full', 
        timeStyle: 'long' 
      })}</p>
      ${ipAddress ? `<p>IP Address: ${ipAddress}</p>` : ''}
      <p style="margin-top: 15px; opacity: 0.7;">
        This email was sent from the Makeplus Portfolio contact form
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  getNotificationTemplate
};
