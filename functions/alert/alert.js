'use strict'
const nodemailer = require('nodemailer')
const createClient = require('@supabase/supabase-js').createClient
const { schedule } = require('@netlify/functions')

const supabase = createClient(process.env.SUPABASE_URL, process.env.API_KEY)

// async..await is not allowed in global scope, must use a wrapper
exports.handler = schedule('0 9,17 * * *', async function () {
  let { data: Products, error } = await supabase.from('Products').select('*')

  //Get product name and expiring date from the products
  const refineProduct = Products.map((el) => {
    let expDate = new Date(el.expiring_date)
    let currDate = Date.now()
    let difference = Math.ceil((expDate - currDate) / (1000 * 3600 * 24))
    if (difference <= 60) {
      return {
        product_name: el.product_name,
        expiring_date: el.expiring_date,
        days_to_expire: `${
          difference > 0 ? `${difference} days lefts` : 'Already expired'
        }`,
      }
    }
  })

  //Remove null values
  const newArray = refineProduct.filter((el) => {
    return el !== undefined
  })

  const rows = newArray
    .map(
      (product) => `
    <tr>
      <td style="border: 1px solid black; padding: 8px;">${product.product_name}</td>
      <td style="border: 1px solid black; padding: 8px;">${product.expiring_date}</td>
      <td style="border: 1px solid black; padding: 8px;">${product.days_to_expire}</td>
    </tr>
  `
    )
    .join('')

  const mailgunData = {
    from: 'mike&cole-stores.com',
    to: 'arilewolaolatomiwa@rocketmail.com,horlartom@live.com,cole.dotun@gmail.com,michaelsantos755@gmail.com,colefolashade3@gmail.com',
    subject: `New mail from `,
    html: `<html>
        <body>
          <h1 style="padding:30px; text-decoration:underline; text-align:center;">List of product abouts to expires</h1>
           <table style="border: 1px solid black border-collapse: collapse width:50%; margin:auto;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 8px;">Product name</th>
                <th style="border: 1px solid black; padding: 8px;">expiring date</th>
                <th style="border: 1px solid black; padding: 8px; ">Days left</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `,
  }

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
    let info = await transporter.sendMail(mailgunData)
    console.log(info)
    return {
      statusCode: 200,
      body: 'Message sent',
    }
  } catch (error) {
    return { statusCode: 500, body: error.message }
  }
})
