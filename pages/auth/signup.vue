<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="4" md="3">
      <signup-form />
    </v-col>
  </v-row>
</template>

<script>
import SignupForm from '~/components/SignUp'
export default {
  layout: 'login',
  components: {
    SignupForm,
  },
}
</script>
<style lang="css">
.row {
  min-height: 100vh;
}
</style>
