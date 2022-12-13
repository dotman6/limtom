<template>
  <v-app>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
      <Notify />
    </v-main>
  </v-app>
</template>

<script>
import Notify from '~/components/Notification.vue'
export default {
  components: {
    Notify,
  },
  data() {
    return {}
  },
}
</script>
<style lang="css"></style>
