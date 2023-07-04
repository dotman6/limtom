<template>
  <div>
    <v-btn
      color="primary"
      v-if="hasHash"
      nuxt
      to="https://smart-supply-store.netlify.app/auth/login"
      >SIGN-IN</v-btn
    >
  </div>
</template>

<script>
export default {
  computed: {
    hasHash() {
      return (
        this.$route.hash.length > 0 && this.$route.hash.includes('access_token')
      )
    },
  },
}
</script>

<style lang="css" scoped></style>
