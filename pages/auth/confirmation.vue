<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="pa-5 text-center" elevation="" min-width="700">
        <v-card-text>
          <p class="text-h4 font-weight-bold">Account creation successfull</p>
          <div class="blue--text text-body-1">
            Please check your email to activate your account
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Sign-up confirmation',
  layout: 'login',
}
</script>
<style lang="css">
.row {
  min-height: 100vh;
}
</style>
