const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Makeplus Backend Setup...\n');

const checks = [];

// Check 1: Node modules
try {
  if (fs.existsSync('node_modules')) {
    checks.push({ name: 'Dependencies installed', status: '✅', message: 'node_modules folder exists' });
  } else {
    checks.push({ name: 'Dependencies installed', status: '❌', message: 'Run: npm install' });
  }
} catch (e) {
  checks.push({ name: 'Dependencies installed', status: '❌', message: e.message });
}

// Check 2: .env file
try {
  if (fs.existsSync('.env')) {
    checks.push({ name: '.env file exists', status: '✅', message: 'Environment file found' });
    
    // Read .env and check key variables
    const envContent = fs.readFileSync('.env', 'utf8');
    
    if (envContent.includes('MONGODB_URI')) {
      checks.push({ name: 'MongoDB URI configured', status: '✅', message: 'MONGODB_URI found in .env' });
    } else {
      checks.push({ name: 'MongoDB URI configured', status: '⚠️', message: 'MONGODB_URI not found' });
    }
    
    if (envContent.includes('JWT_SECRET')) {
      checks.push({ name: 'JWT Secret configured', status: '✅', message: 'JWT_SECRET found in .env' });
    } else {
      checks.push({ name: 'JWT Secret configured', status: '⚠️', message: 'JWT_SECRET not found' });
    }
    
    if (envContent.includes('SMTP_USER') && envContent.includes('SMTP_PASSWORD')) {
      checks.push({ name: 'Email configured', status: '✅', message: 'SMTP credentials found' });
    } else {
      checks.push({ name: 'Email configured', status: '⚠️', message: 'Configure SMTP credentials' });
    }
  } else {
    checks.push({ name: '.env file exists', status: '❌', message: 'Create .env file from .env.example' });
  }
} catch (e) {
  checks.push({ name: '.env file check', status: '❌', message: e.message });
}

// Check 3: Upload directories
const uploadDirs = ['uploads', 'uploads/videos', 'uploads/thumbnails', 'uploads/partners'];
let uploadDirsOk = true;

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    uploadDirsOk = false;
  }
});

if (uploadDirsOk) {
  checks.push({ name: 'Upload directories', status: '✅', message: 'All upload directories exist' });
} else {
  checks.push({ name: 'Upload directories', status: '⚠️', message: 'Will be created on first run' });
}

// Check 4: Required files
const requiredFiles = [
  'server.js',
  'src/app.js',
  'src/config/database.js',
  'src/models/Admin.js',
  'src/routes/index.js',
  'scripts/createAdmin.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    allFilesExist = false;
  }
});

if (allFilesExist) {
  checks.push({ name: 'Required files', status: '✅', message: 'All core files present' });
} else {
  checks.push({ name: 'Required files', status: '❌', message: 'Some files are missing' });
}

// Display results
console.log('═══════════════════════════════════════════════════════════');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
  console.log(`   ${check.message}`);
});
console.log('═══════════════════════════════════════════════════════════\n');

// Summary
const passed = checks.filter(c => c.status === '✅').length;
const warnings = checks.filter(c => c.status === '⚠️').length;
const failed = checks.filter(c => c.status === '❌').length;

console.log(`\n📊 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ Setup incomplete. Please resolve the failed checks above.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  Setup mostly complete. Check warnings above.\n');
  console.log('Next steps:');
  console.log('1. Update .env with your MongoDB URI');
  console.log('2. Configure SMTP credentials for email');
  console.log('3. Run: npm run create-admin');
  console.log('4. Run: npm run dev\n');
} else {
  console.log('✅ Setup complete! Your backend is ready.\n');
  console.log('Next steps:');
  console.log('1. Run: npm run create-admin (if not done yet)');
  console.log('2. Run: npm run dev');
  console.log('3. Test: http://localhost:5000/api/health\n');
}
