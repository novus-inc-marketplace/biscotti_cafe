const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static('.'));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    });
  }
  
  try {
    // Create new message in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message
      }
    });
    
    // Send success response
    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({
      success: false,
      message: 'There was an error saving your message. Please try again.'
    });
  }
});

// Admin endpoint to view messages (in a real app, this would be protected)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      message: 'There was an error fetching messages.'
    });
  }
});

// Serve the main index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the website`);
});