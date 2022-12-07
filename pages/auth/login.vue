<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="4" md="3">
      <login-form />
    </v-col>
  </v-row>
</template>

<script>
import LoginForm from '~/components/Login.vue'
export default {
  layout: 'login',
  components: {
    LoginForm,
  },
}
</script>
<style lang="css">
.row {
  min-height: 100vh;
}
</style>
