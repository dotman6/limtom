<template>
  <v-app>
    <v-app-bar
      color="surface"
      height="80"
      class="el"
      :style="{
        padding: $vuetify.breakpoint.mdAndUp ? '0px 100px' : '',
      }"
      app
    >
      <v-toolbar-title
        @click="$router.push('/')"
        class="text-md-h5 font-weight-bold pointer"
        >Mike&Cole Store</v-toolbar-title
      >
      <v-spacer />

      <v-btn nuxt to="/" class="mr-md-2" icon>
        <v-icon size="20">mdi-store-outline</v-icon>
      </v-btn>
      <v-badge
        v-if="$store.state.cart.length > 0"
        overlap
        :content="`${$store.state.cart.length}`"
      >
        <v-btn nuxt to="/cart" icon>
          <v-icon size="20">mdi-cart-outline</v-icon>
        </v-btn>
      </v-badge>
      <v-btn v-else nuxt to="/cart" icon>
        <v-icon size="20">mdi-cart-outline</v-icon>
      </v-btn>
      <v-divider vertical class="mx-md-5 mx-2" />
      <v-btn @click="toggleTheme" icon>
        <v-icon size="20">mdi-brightness-7</v-icon>
      </v-btn>
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
  name: 'Store',
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
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
  },
}
</script>
<style lang="css" scoped>
.d-flex {
  gap: 40px;
}
</style>
