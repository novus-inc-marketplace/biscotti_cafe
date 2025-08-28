# Biscotti Cafe Website

A modern restaurant website with backend integration, featuring a menu, contact form, and WhatsApp integration.

## Features

- Responsive design with a white and black aesthetic theme
- Menu section with prices for:
  - Vanilla Cake @ 450 KSH
  - Spaghetti and meatballs @ 1100 KSH
  - Coffee @ 270 KSH
  - Mocktails @ 550 KSH
  - Pizza @ 1300 KSH
  - Shrimp @ 1500 KSH
  - Waffles @ 750 KSH
  - Cheesecake @ 800 KSH
- Contact form with backend integration using Prisma ORM
- WhatsApp integration for easy customer communication
- Direct phone number contact (+254 116 000 026)

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Node.js
- Express.js
- Prisma ORM
- SQLite database

## Setup Instructions

1. Clone the repository
2. Navigate to the `biscotti_cafe` directory
3. Install dependencies:
   ```
   npm install
   ```
4. Generate Prisma client:
   ```
   npx prisma generate
   ```
5. Run database migrations:
   ```
   npx prisma migrate dev --name init
   ```
6. Start the server:
   ```
   node server.js
   ```
7. Visit `http://localhost:3001` in your browser

## API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/messages` - View all contact messages (admin endpoint)

## Database

The project uses SQLite as the database with Prisma ORM for database operations. The database file is automatically created as `dev.db` in the project directory.

## Contact Information

- Phone: +254 116 000 026
- WhatsApp: [Message us](https://wa.me/254116000026)
