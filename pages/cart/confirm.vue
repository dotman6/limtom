<template>
  <div>
    <br />
    <div class="text-center" v-if="$store.state.cart.length == 0">
      <v-img class="d-block mx-auto" src="/emptycart.svg" width="500"></v-img>
      <p>No Items Just Yet</p>
    </div>
    <v-container v-else>
      <div class="mb-3" v-if="$store.state.cart.length > 0">
        <v-btn nuxt to="/cart" min-width="150" min-height="45" depressed
          >Back</v-btn
        >
        <v-btn @click="proccess" min-width="150" min-height="45" color="primary"
          >Complete</v-btn
        >
      </div>
      <v-form lazy-validation ref="form" class="mt-10">
        <p class="font-weight-bold">Personal & Delivery</p>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              outlined
              label="Email"
              type="email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="name"
              :rules="[rules.required]"
              outlined
              label="Full Name"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="phone"
              outlined
              label="Phone"
              type="tel"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="address"
              :rules="[rules.required]"
              outlined
              label="Address"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="city"
              :rules="[rules.required]"
              outlined
              label="City"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="country"
              :rules="[rules.required]"
              outlined
              label="Country"
              type="text"
            ></v-text-field>
          </v-col>
        </v-row>
        <p class="font-weight-bold">Credit card</p>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="cc"
              :rules="[rules.required]"
              outlined
              label="Credit Card Number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="expdate"
              :rules="[rules.required]"
              outlined
              label="Exp date"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="cvv"
              :rules="[rules.required]"
              outlined
              label="Security code/CVV"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <br /><br />
    <Footer />
    <ScrollTop />
  </div>
</template>

<script>
// import FM from '~/mixins/FormMixinx'
export default {
  layout: 'store',
  // mixins: [FM],
  data() {
    return {
      email: null,
      name: null,
      phone: null,
      address: null,
      city: null,
      country: null,
      cc: '424242424242',
      expdate: '06/15',
      cvv: '123',
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
      billingAddress: {},
      rows: '',
    }
  },
  computed: {
    getTotalAmount() {
      return this.$store.getters.get_cart_amount
    },
  },
  methods: {
    async proccess() {
      if (!this.$refs.form.validate()) return
      await this.$swal({
        title: 'Proceessing your order',
        icon: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        text: 'Please Wait',
        showConfirmButton: false,
      })
      if (!navigator.geolocation) {
        await this.$swal({
          title: 'Could not complete order',
          icon: 'error',
          allowEscapeKey: false,
          allowOutsideClick: false,
          timer: 10000,
          timerProgressBar: true,
          text: 'We can`t deliver your order without knowing your location',
          showConfirmButton: false,
        })
      } else {
        await navigator.geolocation.getCurrentPosition(
          (position) => {
            this.billingAddress.latitude = position.coords.latitude
            this.billingAddress.longitude = position.coords.longitude

            this.updateOrder()
            console.log(position)
          },
          (error) => {
            this.$swal({
              title: 'Could not complete order',
              icon: 'error',
              allowEscapeKey: false,
              allowOutsideClick: false,
              timer: 10000,
              timerProgressBar: true,
              text: error.message,
              showConfirmButton: false,
            })
          }
        )
      }
    },
    async updateOrder() {
      const { data, error } = await this.$supabase
        .from('orders')
        .insert([
          {
            customer_name: this.name.toLowerCase(),
            billing_address: this.billingAddress,
            items: this.$store.state.cart,
            email: this.email,
            amount_paid: this.getTotalAmount,
          },
        ])
        .select()
      console.log(data)

      //arrange data
      this.rows = this.$store.state.cart
        .map(
          (item) => `
              <tr>
                <td style="border:padding: 3px;">${item.product.product_name}</td>
                <td style="border:padding: 3px;">${item.product.price}</td>
                <td style="border:padding: 3px;">${item.quantity}</td>
              </tr>
               `
        )
        .join('')
      this.$swal({
        title: 'Order Complete',
        icon: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: false,
        timerProgressBar: true,
        text: `Check your mail for your order info. Thank You So Much `,
        html: `
        <h5 style="margin-bottom:5px;">Order id:${data[0].id}</h5>
           <table style="border: 1px solid black border-collapse: collapse width:50%; margin:auto;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 3px;">Product name</th>
                <th style="border: 1px solid black; padding: 3px;">Price</th>
                <th style="border: 1px solid black; padding: 3px; ">Qty</th>
              </tr>
            </thead>
            <tbody>
              ${this.rows}
              <h3>Total: NGN${this.getTotalAmount.toFixed(2)}</h3>
            </tbody>
          </table>`,
        showConfirmButton: true,
      })
      //Send order email with order id
      this.sendMail(data)

      //Remove items from cart
      this.$store.commit('CLEAR_CART')
      this.$router.push('/')
      if (error) {
        this.$swal({
          title: 'Could not complete order',
          icon: 'error',
          allowEscapeKey: false,
          allowOutsideClick: false,
          timer: 10000,
          timerProgressBar: true,
          text: error.message,
          showConfirmButton: false,
        })
      }
    },

    async sendMail(data) {
      var myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      var raw = JSON.stringify({
        mailOptions: {
          from: 'mike&cole-stores.com',
          to: `${this.email}`,
          subject: `Order details`,
          html: `<html>
          <body>
            <h2 style="text-align:center; color:blue;">Mike & Cole stores</h2>
            <h3 style="margin-bottom:5px; text-align:center;">Order id:${
              data[0].id
            }</h3>
             <table style="border: 1px solid black border-collapse: collapse width:50%; margin:auto;">
              <thead>
                <tr>
                  <th style="border: 1px solid black; padding: 3px;">Product name</th>
                  <th style="border: 1px solid black; padding: 3px;">Price</th>
                  <th style="border: 1px solid black; padding: 3px; ">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${this.rows}
                <h3>Total: NGN${this.getTotalAmount.toFixed(2)}</h3>
              </tbody>
            </table>
          </body>
        </html>
      `,
        },
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      try {
        const response = await fetch(
          process.env.NETLIFYAPI_BASEURL,
          requestOptions
        )
        const result = await response.text()
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: `Check your mail for your order receipt`,
          color: 'success',
        })
        this.email = ''
        console.log(result)
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Could not send order receipt',
          color: 'error',
        })
        console.log('Error occurred:', error)
      }
    },
  },
}
</script>

<style></style>
