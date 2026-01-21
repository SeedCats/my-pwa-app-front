require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
const PORT = process.env.PORT || 3000
const TARGET_EMAIL = process.env.PROVIDER_TARGET_EMAIL || 's928641007@gmail.com'

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }))
app.use(express.json())

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: (process.env.SMTP_SECURE === 'true'), // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Optional verification at startup
transporter.verify()
  .then(() => console.log('Nodemailer transporter verified'))
  .catch(err => console.warn('Warning: Nodemailer transporter verification failed', err.message))

app.post('/api/provider/request', async (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' })
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: TARGET_EMAIL,
    subject: `Provider request from ${name}`,
    text: `Provider Name: ${name}\nProvider Email: ${email}\n\nMessage:\n${message}\n\nReceived at: ${new Date().toISOString()}`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Provider request sent:', info.messageId)
    return res.json({ success: true, message: 'Provider request sent' })
  } catch (err) {
    console.error('Error sending provider request:', err)
    return res.status(500).json({ success: false, message: 'Failed to send provider request' })
  }
})

app.listen(PORT, () => console.log(`Provider request server listening on port ${PORT}`))