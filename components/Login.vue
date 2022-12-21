<template>
  <v-card class="pb-5 pt-5">
    <v-card-title class="headline d-flex flex-column pb-3">
      <v-avatar color="black"> SCC </v-avatar>
      Login
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
          class="login-btn text-center"
          @click="login"
          block
        >
          Login
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'login',
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
      items: ['Admin', 'Driver'],
    }
  },

  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        const { data, error } = await this.$supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
          options: {
            data: {
              role: this.select,
            },
          },
        })
        if (data.user.user_metadata.role === 'admin') {
          //Check the user data
          this.$router.push('/admin/products')

          this.$store.dispatch('setSnackbar', {
            show: true,
            content: 'Login successfull',
            color: 'success',
          })
        } else {
          this.$router.push('/admin/driver')
        }

        if (error) {
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: error,
            color: 'error',
          })
        }
      }
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

.login-btn {
  text-transform: capitalize;
  padding: 4px;
  text-align: center;
}
</style>
