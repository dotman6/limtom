const nodemailer = require('nodemailer')

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'horlartom2013@gmail.com',
    pass: process.env.PASS,
  },
})

module.exports = function (req, res, next) {
  if (req.method === 'POST' && req.path === '/send-email') {
    const { mailOptions } = req.body

    // Define the email content
    // const mailOptions = {
    //   from: 'horlartom2013@gmail.com',
    //   to: 'recipient@example.com',
    //   subject: 'Contact Form Submission',
    //   html: `Email: ${email}\nMessage: ${message}`,
    // }

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error)
        res.status(500).json({ message: 'Failed to send email' })
      } else {
        console.log('Email sent successfully')
        res.status(200).json({ message: 'Email sent successfully' })
      }
    })
  } else {
    next()
  }
}
