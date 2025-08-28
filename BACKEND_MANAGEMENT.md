# Biscotti Cafe Backend Management Guide

This guide provides comprehensive information on managing the backend of your Biscotti Cafe website, including database management, API usage, and troubleshooting.

## Table of Contents
1. [Database Management](#database-management)
2. [API Endpoints](#api-endpoints)
3. [Managing Contact Messages](#managing-contact-messages)
4. [Shopping Cart Functionality](#shopping-cart-functionality)
5. [Server Management](#server-management)
6. [Troubleshooting](#troubleshooting)
7. [Security Considerations](#security-considerations)

## Database Management

### Database Structure
The website uses SQLite with Prisma ORM. The database contains one table:

**ContactMessage**
- `id` (String): Unique identifier (CUID)
- `name` (String): Customer's name
- `email` (String): Customer's email
- `message` (String): Customer's message
- `createdAt` (DateTime): Timestamp of submission

### Accessing the Database
You can access the database directly using SQLite tools:
```bash
# Install SQLite CLI (if not already installed)
# On Windows: Download from https://www.sqlite.org/download.html
# On macOS: brew install sqlite
# On Linux: sudo apt-get install sqlite3

# Access the database
sqlite3 dev.db

# View all messages
SELECT * FROM ContactMessage;

# Count total messages
SELECT COUNT(*) FROM ContactMessage;

# View recent messages
SELECT * FROM ContactMessage ORDER BY createdAt DESC LIMIT 10;
```

### Prisma Studio
Prisma provides a visual database browser:
```bash
npx prisma studio
```
This opens a web interface at http://localhost:5555 where you can view and manage your data.

## API Endpoints

### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "message": "Customer message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "data": {
    "id": "cmevg0ak00000nitkdl3gd9xc",
    "name": "Customer Name",
    "email": "customer@example.com",
    "message": "Customer message",
    "createdAt": "2025-08-28T13:31:41.798Z"
  }
}
```

### GET /api/messages
Retrieve all contact messages (admin endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmevg0ak00000nitkdl3gd9xc",
      "name": "Customer Name",
      "email": "customer@example.com",
      "message": "Customer message",
      "createdAt": "2025-08-28T13:31:41.798Z"
    }
  ]
}
```

## Managing Contact Messages

### Viewing Messages
1. Through the API: `GET http://localhost:3000/api/messages`
2. Through Prisma Studio: Run `npx prisma studio`
3. Direct database access: `SELECT * FROM ContactMessage;`

### Exporting Messages
To export messages to a CSV file:
```bash
# Create a CSV header
echo "id,name,email,message,createdAt" > messages.csv

# Export data (requires sqlite3)
sqlite3 -header -csv dev.db "SELECT * FROM ContactMessage;" >> messages.csv
```

### Deleting Messages
To delete all messages (use with caution):
```bash
# Direct database access
sqlite3 dev.db "DELETE FROM ContactMessage;"

# Reset auto-increment if needed
sqlite3 dev.db "DELETE FROM sqlite_sequence WHERE name='ContactMessage';"
```

### Backing Up the Database
```bash
# Simple file copy
cp dev.db dev.db.backup.$(date +%Y%m%d)

# Or using SQLite backup command
sqlite3 dev.db ".backup dev.db.backup.$(date +%Y%m%d)"
```

## Shopping Cart Functionality

The shopping cart is implemented as a client-side feature using JavaScript. All cart data is stored in the browser's memory and is not persisted to the database. When a customer places an order, the cart contents are formatted into a WhatsApp message and sent to your business number.

### How It Works
1. Customers select items and quantities using the +/- buttons
2. Items are added to the cart by clicking "Add to Cart"
3. The cart icon shows the total number of items
4. Customers can view their cart by clicking the cart icon
5. When ready, customers click "Place Order via WhatsApp" to send their order

### Cart Data Storage
Cart data is stored in the browser's memory (JavaScript variable) and is lost when:
- The page is refreshed
- The browser tab is closed
- The customer navigates away from the site

This is intentional as the cart is meant to be a temporary shopping aid, not a persistent shopping cart.

### Customizing the Cart
To modify the cart functionality:
1. Edit `index.html` to change the UI elements
2. Modify the JavaScript code at the bottom of `index.html` for behavior changes
3. The cart data structure is a simple array of objects with `name`, `price`, and `quantity` properties

## Server Management

### Starting the Server
```bash
# Navigate to the project directory
cd biscotti_cafe

# Start the server
node server.js
```

### Changing the Port
If port 3000 is already in use, you can change it in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change 3001 to any available port
```

Or set it through environment variables:
```bash
# Windows
set PORT=3001 && node server.js

# macOS/Linux
PORT=3001 node server.js
```

### Running in Background
To run the server in the background:
```bash
# On Windows
node server.js > server.log 2>&1 &

# On macOS/Linux
nohup node server.js > server.log 2>&1 &
```

### Process Management
Using PM2 (recommended for production):
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "biscotti-cafe"

# View logs
pm2 logs

# Stop the application
pm2 stop biscotti-cafe

# Restart the application
pm2 restart biscotti-cafe

# View status
pm2 status
```

## Troubleshooting

### Port Already in Use
If you see `Error: listen EADDRINUSE: address already in use :::3000`:

1. Find the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000
```

2. Kill the process:
```bash
# Windows (replace PID with actual process ID)
taskkill /PID <PID> /F

# macOS/Linux (replace PID with actual process ID)
kill -9 <PID>
```

3. Or change the port as described in Server Management section.

### Database Issues
If you encounter database errors:

1. Check if the database file exists:
```bash
ls -la dev.db
```

2. If corrupted, restore from backup:
```bash
cp dev.db.backup.20250828 dev.db
```

3. Reset the database (loses all data):
```bash
# Delete the database file
rm dev.db

# Run migrations again
npx prisma migrate dev --name init
```

### API Issues
If the contact form isn't working:

1. Check server logs for errors
2. Verify the API endpoint is correct: `POST /api/contact`
3. Ensure request body is properly formatted JSON
4. Check browser console for any JavaScript errors

## Security Considerations

### Rate Limiting
The current implementation doesn't include rate limiting. For production, consider adding:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation
The current implementation includes basic validation. For enhanced security:
```javascript
const validator = require('validator');

// In the contact endpoint
if (!validator.isEmail(email)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid email format.'
  });
}

if (!validator.isLength(name, { min: 1, max: 50 })) {
  return res.status(400).json({
    success: false,
    message: 'Name must be between 1 and 50 characters.'
  });
}
```

### HTTPS
For production, always use HTTPS. You can obtain a free SSL certificate from Let's Encrypt.

### Admin Endpoint Protection
The `/api/messages` endpoint should be protected:
```javascript
// Add basic authentication
const basicAuth = require('express-basic-auth');

app.get('/api/messages', basicAuth({
  users: { 'admin': 'supersecret' },
  challenge: true
}), async (req, res) => {
  // ... existing code
});
```

## Monitoring and Maintenance

### Log Monitoring
Check server logs regularly:
```bash
# If running with PM2
pm2 logs

# If logging to file
tail -f server.log
```

### Database Maintenance
1. Regular backups (daily/weekly)
2. Monitor database size
3. Optimize queries if performance degrades

### Performance Monitoring
Consider adding application performance monitoring:
```javascript
// Using a service like New Relic
require('newrelic');

// Or Application Insights for Azure
const appInsights = require('applicationinsights');
appInsights.setup("YOUR_INSTRUMENTATION_KEY").start();
```

## Conclusion

This guide covers the essential aspects of managing your Biscotti Cafe website backend. Regular maintenance, monitoring, and security updates will ensure your website continues to function smoothly. Always test changes in a development environment before applying them to production.