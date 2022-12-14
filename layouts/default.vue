<template>
  <v-app>
    <v-navigation-drawer :clipped="clipped" app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed flat app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <h6></h6>
      <v-btn color="primary" outlined @click="logout">Log-out</v-btn>
    </v-app-bar>
    <notify />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Notify from '~/components/Notification.vue'
export default {
  components: {
    Notify,
  },
  // middleware: 'auth',

  data() {
    return {
      clipped: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/admin/dashboard',
        },
        {
          icon: 'mdi-store',
          title: 'Products',
          to: '/admin/products',
        },
        {
          icon: 'mdi-view-list',
          title: 'Orders',
          to: '/admin/Orders',
        },
        {
          icon: 'mdi-rv-truck',
          title: 'Logistics',
          to: '/admin/logistics',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Flash sales',
          to: '/flash',
        },
      ],
      title: 'Warehouse Manager',
      authenticated: false,
      authListener: null,
    }
  },
  methods: {
    async logout() {
      let { error } = await this.$supabase.auth.signOut()
      if (!error) {
        this.$router.push('/auth/login')
      }
    },

    async checkUser() {
      const user = await this.$supabase.auth.getUser()
      if (user) {
        this.authenticated = true
      } else {
        this.authenticated = false
      }
    },
  },
  async mounted() {
    //Check to see if the user is signed in when page loads and also create a listener for sign-in and sign-out
    const { data: authListener } = this.$supabase.auth.onAuthStateChange(() =>
      this.checkUser()
    )
    this.authListener = authListener
    this.checkUser()
  },

  beforeMount() {
    this.authListener?.unsubscribe()
  },
}
</script>
<style lang="css"></style>
