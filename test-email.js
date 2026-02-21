#!/usr/bin/env node

/**
 * Email Configuration Test Script for Backend
 * 
 * This script tests your email configuration and sends test emails.
 * 
 * Usage:
 *   node test-email.js
 */

require('dotenv').config({ path: '.env.production' });
const { sendContactEmails } = require('./src/services/emailService');

async function runTests() {
  console.log('🧪 Testing Backend Email Configuration...\n');
  
  console.log('Current Configuration:');
  console.log('=====================');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'NOT SET');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
  console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
  console.log('EMAIL_TO:', process.env.EMAIL_TO || 'NOT SET');
  console.log('\n');
  
  // Test 1: Send test contact form email
  console.log('Test 1: Sending test contact form email...');
  try {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+212 600 000 000',
      company: 'Test Company',
      subject: 'Test Contact Form Submission',
      message: 'This is a test message from the backend email configuration test script.',
      language: 'en',
      ipAddress: '127.0.0.1',
      timestamp: new Date()
    };
    
    const results = await sendContactEmails(contactData);
    
    if (results.notification) {
      console.log('✅ Notification email sent successfully!\n');
    } else {
      console.log('❌ Failed to send notification email');
      console.log('   Errors:', results.errors, '\n');
    }
    
    if (results.autoReply) {
      console.log('✅ Auto-reply email sent successfully!\n');
    } else {
      console.log('❌ Failed to send auto-reply email');
      console.log('   Errors:', results.errors, '\n');
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`Notification Email: ${results.notification ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Auto-Reply Email: ${results.autoReply ? '✅ PASS' : '❌ FAIL'}`);
    
    if (results.notification && results.autoReply) {
      console.log('\n🎉 All tests passed! Email notifications are working correctly.');
      console.log(`📬 Check ${process.env.EMAIL_TO} for the notification email.`);
      console.log(`📬 Check test@example.com for the auto-reply email (won't actually arrive).`);
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test script error:', error);
  process.exit(1);
});
