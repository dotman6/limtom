<template>
  <v-snackbar
    v-model="$store.state.snackbar.show"
    :timeout="-1"
    :color="$store.state.snackbar.color"
    bottom
    multi-line
    style="z-index: 20000;"
    class="mx-a"
    elevation="10"
  >
    {{ $store.state.snackbar.content }}
    <v-btn text small color="primary" @click="close" class="ml-5">
      CLOSE
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  methods: {
    close() {
      this.$store.dispatch('setSnackbar', {
        show: false,
        content: '',
        color: '',
      })
    },
  },
}
</script>

<style lang="css">
.v-snack__wrapper {
  text-align: center;
  display: flex;
}
.v-snack__content {
  text-align: center;
}
</style>
