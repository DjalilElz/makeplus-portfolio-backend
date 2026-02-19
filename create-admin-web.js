/**
 * Web-based Admin Creation Script
 * 
 * SECURITY WARNING: This file creates an admin account via web browser.
 * DELETE THIS FILE IMMEDIATELY AFTER CREATING YOUR ADMIN ACCOUNT!
 * 
 * Usage:
 * 1. Upload this file to your server root directory
 * 2. Visit: https://wemakeplus.com/create-admin-web.js (or run: node create-admin-web.js)
 * 3. Fill the form and submit
 * 4. DELETE this file immediately after
 */

require('dotenv').config({ path: '.env.production' });
const express = require('express');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Admin Model
const Admin = sequelize.define('Admin', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'admin'
  }
}, {
  timestamps: true
});

// Serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Create Admin Account</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFontFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          padding: 40px;
          max-width: 500px;
          width: 100%;
        }
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
          font-size: 14px;
        }
        .warning strong {
          display: block;
          margin-bottom: 5px;
          font-size: 16px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          color: #555;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
        }
        button:active {
          transform: translateY(0);
        }
        .success {
          background: #d4edda;
          border: 1px solid #28a745;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #155724;
        }
        .error {
          background: #f8d7da;
          border: 1px solid #dc3545;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Create Admin Account</h1>
        
        <div class="warning">
          <strong>⚠️ SECURITY WARNING</strong>
          DELETE this file immediately after creating your admin account!
        </div>

        <form id="adminForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required minlength="3">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="6">
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
          </div>

          <button type="submit">Create Admin Account</button>
        </form>

        <div id="message"></div>
      </div>

      <script>
        document.getElementById('adminForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const username = document.getElementById('username').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const messageDiv = document.getElementById('message');

          // Validation
          if (password !== confirmPassword) {
            messageDiv.innerHTML = '<div class="error">❌ Passwords do not match!</div>';
            return;
          }

          if (password.length < 6) {
            messageDiv.innerHTML = '<div class="error">❌ Password must be at least 6 characters!</div>';
            return;
          }

          try {
            const response = await fetch('/create-admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
              messageDiv.innerHTML = \`
                <div class="success">
                  <strong>✅ Admin account created successfully!</strong>
                  <br><br>
                  <strong>Username:</strong> \${data.admin.username}<br>
                  <strong>Email:</strong> \${data.admin.email}<br>
                  <br>
                  <strong>⚠️ DELETE this file now!</strong>
                </div>
              \`;
              document.getElementById('adminForm').style.display = 'none';
            } else {
              messageDiv.innerHTML = \`<div class="error">❌ \${data.message}</div>\`;
            }
          } catch (error) {
            messageDiv.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Create admin endpoint
app.post('/create-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Connect to database
    await sequelize.authenticate();
    await Admin.sync();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 3500;
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`\n🚀 Admin creation server running on port ${PORT}`);
      console.log(`\n📝 Open your browser and visit:`);
      console.log(`   http://localhost:${PORT}`);
      console.log(`\n⚠️  DELETE THIS FILE AFTER CREATING ADMIN!\n`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
