const createClient = require('@supabase/supabase-js').createClient
const { schedule } = require('@netlify/functions')

const supabase = createClient(process.env.SUPABASE_URL, process.env.API_KEY)
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.DOMAIN,
  url: process.env.MAILGUN_URL,
})

exports.handler = schedule('* * * * *', async (event) => {
  //Look-up for the products from the database
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
        days_to_expire: `${difference} days lefts`,
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
    from: 'horlartom@live.com',
    to: 'horlartom2013@gmail.com',
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

  //Mailgun logic
  try {
    await mailgun.messages().send(mailgunData)

    return {
      statusCode: 200,
      body: 'Your message was sent successfully!',
    }
  } catch (error) {
    return {
      statusCode: 422,
      body: `Error: ${error}`,
    }
  }
})
