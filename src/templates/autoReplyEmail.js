/**
 * Generate auto-reply email template for user
 */
const getAutoReplyTemplate = (contactData) => {
  const {
    name,
    subject,
    language = 'fr'
  } = contactData;
  
  const translations = {
    fr: {
      greeting: 'Bonjour',
      thanksTitle: 'Merci pour votre message',
      thanksMessage: 'Merci de nous avoir contactés. Nous avons bien reçu votre message et notre équipe vous répondra dans les plus brefs délais.',
      summaryTitle: 'Voici un récapitulatif de votre demande :',
      subjectLabel: 'Sujet',
      closing: 'À très bientôt,',
      team: "L'équipe Makeplus",
      tagline: 'Plus qu\'un partenaire'
    },
    en: {
      greeting: 'Hello',
      thanksTitle: 'Thank you for your message',
      thanksMessage: 'Thank you for contacting us. We have received your message and our team will respond to you as soon as possible.',
      summaryTitle: 'Here is a summary of your request:',
      subjectLabel: 'Subject',
      closing: 'See you soon,',
      team: 'The Makeplus Team',
      tagline: 'More than a partner'
    }
  };
  
  const t = translations[language] || translations.fr;
  
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
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .content h3 {
      color: #872c7a;
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    .content p {
      margin: 0 0 15px 0;
      color: #555;
    }
    .summary {
      background: #f9f9f9;
      padding: 20px;
      border-left: 4px solid #872c7a;
      margin: 25px 0;
      border-radius: 4px;
    }
    .summary strong {
      color: #872c7a;
    }
    .signature {
      margin-top: 30px;
    }
    .signature p {
      margin: 5px 0;
    }
    .footer {
      background: #f9f9f9;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #ddd;
    }
    .footer p {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }
    .footer a {
      color: #872c7a;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .icon {
      font-size: 16px;
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Makeplus</h1>
      <p>${t.tagline}</p>
    </div>
    
    <div class="content">
      <h3>${t.greeting} ${name},</h3>
      
      <p>${t.thanksMessage}</p>
      
      <p>${t.summaryTitle}</p>
      
      <div class="summary">
        <strong>${t.subjectLabel}:</strong> ${subject}
      </div>
      
      <div class="signature">
        <p>${t.closing}</p>
        <p><strong>${t.team}</strong></p>
      </div>
    </div>
    
    <div class="footer">
      <p><span class="icon">📧</span> <a href="mailto:contact@wemakeplus.com">contact@wemakeplus.com</a></p>
      <p><span class="icon">📞</span> +213 XXX XXX XXX</p>
      <p><span class="icon">🌐</span> <a href="https://www.wemakeplus.com" target="_blank">www.wemakeplus.com</a></p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} Makeplus. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  getAutoReplyTemplate
};
