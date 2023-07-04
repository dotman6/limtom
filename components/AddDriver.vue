<template>
  <v-dialog v-model="dialog" persistent max-width="600px" class="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
        class="text-capitalize mr-3"
        style="position: absolute; left: 0; bottom: 50%; z-index: 5000"
      >
        Add driver
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Driver</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <v-form ref="form">
            <v-row
              justify="center"
              class="d-flex flex-column"
              no
              gutter
              align="center"
            >
              <v-col class="pa-0">
                <p class="text-body-1 text-center mb-0 font-weight-bold">
                  Enter email address of the person you want to invite
                </p>
              </v-col>
              <v-col cols="12" md="10" class="pl-0" justify="center">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  outlined
                  clearable
                  dense
                  filled
                  type="email"
                  hide-details
                  placeholder="Enter email to invite"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" dark @click="addDriver" class="pl-4 pr-4">
          invite
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Add-driver',
  data() {
    return {
      dialog: false,
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },

  methods: {
    async addDriver() {
      if (this.$refs.form.validate()) {
        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        var raw = JSON.stringify({
          mailOptions: {
            from: 'mike&cole-stores.com',
            to: `${this.email}`,
            subject: 'Driver invite link',
            html: '<h2>You have been invited</h2>\n<p>You have been invited to create a user on https://smart-supply-store.netlify.app. Follow this link to accept the invite:</p>\n<p><a href="https://smart-supply-store.netlify.app/auth/driver-signup">Accept the invite</a></p>',
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
            content: `Invitation sent`,
            color: 'success',
          })
          this.email = ''
          console.log(result)
        } catch (error) {
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: 'Error sending invitation',
            color: 'error',
          })
          console.log('Error occurred:', error)
        }
        this.dialog = false
      }
    },
  },
}
</script>

<style scoped>
.dialog {
  z-index: 9999;
}
</style>
