require('dotenv').config(); // Load environment variables
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Email sending route
app.post('/send-mail', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text or html' });
  }

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email from environment variables
        pass: process.env.EMAIL_PASS  // Your email password or app-specific password
      }
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to, // Receiver address
      subject, // Email subject
      text, // Plain text body
      html // HTML body (optional)
    });

    res.status(200).json({ message: 'Email sent successfully!', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
