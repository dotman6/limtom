<template>
  <v-app>
    <v-app-bar fixed flat app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <Cart />
      <span
        class="snipcart-total-price ml-3 font-semibold text-sm text-indigo-500"
      ></span>
    </v-app-bar>
    <notify />
    <v-main app>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Cart from '~/components/Cart.vue'
import Notify from '~/components/Notification.vue'
export default {
  components: {
    Cart,
    Notify,
  },
  data() {
    return {
      title: 'MIKE & COLE SUPPER MALL',
      dialog: false,
    }
  },

  methods: {
    logout() {
      console.log(this.$supabase)
    },
  },
}
</script>
<style lang="css" scoped>
.d-flex {
  gap: 40px;
}
</style>
