# How to Fix Nodemailer Email Configuration

## The Problem
The email functionality is failing because it's using a regular Gmail password instead of an app-specific password. Gmail requires app-specific passwords for SMTP authentication when 2FA is enabled.

## Error Message
```
Error: Invalid login: 534-5.7.9 Application-specific password required
```

## Solution Steps

### 1. Enable 2-Factor Authentication on Gmail
1. Go to your Google Account settings (myaccount.google.com)
2. Click on "Security" in the left sidebar
3. Find "2-Step Verification" and turn it ON if not already enabled
4. Complete the setup process

### 2. Generate App-Specific Password
1. Still in Google Account Settings > Security
2. Click on "2-Step Verification"
3. Scroll down and click on "App passwords"
4. Select "Mail" from the dropdown
5. Click "Generate"
6. Google will show you a 16-digit password like: `abcd efgh ijkl mnop`
7. **Copy this password immediately** (you won't be able to see it again)

### 3. Update Your .env File
Replace this line in your `.env` file:
```
EMAIL_PASSWORD = your-16-digit-app-password-here
```

With your actual app password (remove spaces):
```
EMAIL_PASSWORD = abcdefghijklmnop
```

### 4. Test the Email Configuration
After updating the .env file, restart your server and test:

```bash
npx tsx test-email.js
```

You should see:
```
✅ Email sent successfully!
📨 Message ID: <some-message-id>
```

## Alternative: Use Different Email Provider

If you don't want to use Gmail, you can use other email providers:

### Outlook/Hotmail
```env
EMAIL_HOST = smtp-mail.outlook.com
EMAIL_PORT = 587
EMAIL_USER = your-email@outlook.com
EMAIL_PASSWORD = your-outlook-password
```

### Yahoo Mail
```env
EMAIL_HOST = smtp.mail.yahoo.com
EMAIL_PORT = 587
EMAIL_USER = your-email@yahoo.com
EMAIL_PASSWORD = your-yahoo-app-password
```

### Business Email (Custom SMTP)
```env
EMAIL_HOST = mail.yourdomain.com
EMAIL_PORT = 587
EMAIL_USER = support@yourdomain.com
EMAIL_PASSWORD = your-email-password
```

## Security Note
- Never commit your email password to version control
- Use app-specific passwords for better security
- Consider using environment-specific email accounts for development vs production

## After Fixing
Once the email is working, customers will receive:
- Order confirmation emails when they place orders
- Order status update emails when you update order status
- Professional HTML emails with order details and company branding
