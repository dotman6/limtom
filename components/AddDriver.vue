<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        outlined
        v-bind="attrs"
        v-on="on"
        class="text-capitalize mr-3"
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
        let headersList = {
          apikey: process.env.API_KEY,
          Authorization: `Bearer ${process.env.SERVICE_ROLE}`,
          'Content-Type': 'application/json',
        }

        let bodyContent = JSON.stringify({
          email: `${this.email}`,
          user_metadata: { role: 'driver' },
        })

        try {
          let response = await fetch(
            `${process.env.SUPABASE_URL}/auth/v1/invite`,
            {
              method: 'POST',
              body: bodyContent,
              headers: headersList,
            }
          )

          let data = await response.text()
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: `Invitation sent`,
            color: 'success',
          })
          this.email = ''
        } catch (error) {
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: 'Error sending invitation',
            color: 'error',
          })
        }

        this.dialog = false
      }
    },
  },
}
</script>

<style scoped></style>
