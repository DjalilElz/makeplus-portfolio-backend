# Alternative Methods to Create Admin Account

Since you can't access the terminal, here are 2 easy alternatives:

---

## METHOD 1: Web-Based Creator (Recommended)

### Steps:
1. **Upload** the file `create-admin-web.js` to your server root directory (same folder as package.json)

2. **Run it temporarily** by visiting:
   ```
   https://wemakeplus.com/create-admin-web.js
   ```
   OR SSH/File Manager: `node create-admin-web.js` (port 3500)

3. **Fill the form** with your admin credentials:
   - Username: your_username
   - Email: your_email@example.com
   - Password: your_secure_password

4. **DELETE the file immediately** after creating the account! (Security risk)

---

## METHOD 2: Direct Database Insert (phpMyAdmin)

### Steps:
1. **Login to cPanel** → **phpMyAdmin**

2. **Select** your database: `wemaszvr_portfolio`

3. **Click "SQL" tab** and run this query:

```sql
INSERT INTO `Admins` (`username`, `email`, `password`, `role`, `createdAt`, `updatedAt`)
VALUES (
  'admin',
  'your-email@example.com',
  '$2a$10$YourHashedPasswordHere',
  'admin',
  NOW(),
  NOW()
);
```

4. **Generate Password Hash**:
   Visit: https://bcrypt-generator.com/
   - Enter your desired password
   - Rounds: 10
   - Copy the hash
   - Replace `$2a$10$YourHashedPasswordHere` with the generated hash

### Example:
If your password is `MySecurePass123`, generate its bcrypt hash and use:
```sql
INSERT INTO `Admins` (`username`, `email`, `password`, `role`, `createdAt`, `updatedAt`)
VALUES (
  'admin',
  'admin@wemakeplus.com',
  '$2a$10$rF8vqGkF.3K8Wj6K8Wj6K8Wj6K8Wj6K8Wj6K8Wj6K8Wj6K8Wj6K8W',
  'admin',
  NOW(),
  NOW()
);
```

---

## Which Method Should You Use?

- **Method 1** (Web Creator): Easiest, no technical knowledge needed
- **Method 2** (SQL Insert): If you prefer phpMyAdmin or Method 1 doesn't work

---

## After Creating Admin:

1. **Test Login**: 
   - POST https://wemakeplus.com/api/auth/login
   - Body: `{ "username": "admin", "password": "your_password" }`

2. **Delete** `create-admin-web.js` if you used Method 1

3. **Update** your frontend environment variables

---

**Need Help?** Let me know which method you want to use!
