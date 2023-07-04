'use strict'
const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
exports.handler = async function (event) {
  const { mailOptions } = JSON.parse(event.body)

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'horlartom2013@gmail.com',
      pass: process.env.PASS,
    },
  })

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)
    console.log(info)
    return {
      statusCode: 200,
      body: 'Message sent',
    }
  } catch (error) {
    console.log(mailOptions)
    return { statusCode: 500, body: error.message }
  }
}
