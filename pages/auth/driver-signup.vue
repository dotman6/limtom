<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="4" md="3">
      <v-card class="pb-5 pt-5">
        <v-card-title class="headline d-flex flex-column pb-3">
          <v-avatar color="black"> SCC-DRIVER </v-avatar>

          SignUp
        </v-card-title>
        <v-card-text class="pl-5 pr-5">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              outlined
              clearable
              dense
              filled
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="password"
              type="password"
              required
              outlined
              clearable
              dense
              filled
            ></v-text-field>

            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || 'Item is required']"
              label="Role"
              required
              outlined
              dense
              clearable
              filled
            ></v-select>

            <v-btn
              color="success"
              class="signup-btn text-center"
              @click="signup"
              block
            >
              Signup
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'login',
  name: 'driver-signup',
  data() {
    return {
      user: {},
      valid: true,
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length >= 6) || 'Password must be greater than 6 characters',
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: ['Driver'],
    }
  },

  methods: {
    async signup() {
      if (this.$refs.form.validate()) {
        const { data, error } = await this.$supabase.auth.signUp({
          email: this.email,
          password: this.password,
          options: {
            data: {
              role: this.select,
            },
          },
        })
        if (!error && data.user.identities.length === 0) {
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: 'Account already exist',
            color: 'error',
          })
        }
        if (!error && data.user.identities.length > 0) {
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: 'Account creation successfull',
            color: 'success',
          })
          this.$router.push('/auth/confirmation')
        }
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style lang="css" scoped>
.v-card__title {
  justify-content: center;
}
.v-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signup-btn {
  text-transform: capitalize;
  padding: 4px;
  text-align: center;
}

.row {
  min-height: 100vh;
}
</style>
