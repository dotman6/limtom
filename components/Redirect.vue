<template>
  <div>
    <v-btn color="primary" v-if="hasQueryString">SIGN-IN</v-btn>
  </div>
</template>

<script>
export default {
  computed: {
    hasQueryString() {
      return Object.keys(this.$route.hash).length > 0
    },
  },
}
</script>

<style lang="css" scoped></style>
