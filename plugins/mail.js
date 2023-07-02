const nodemailer = require('nodemailer')

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'horlartom2013@gmail.com',
    pass: 'vhvkurycduvplnvl',
  },
})

export default (_, inject) => {
  inject('transporter', transporter)
}
// module.exports = transporter
