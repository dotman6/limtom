<template>
  <v-app>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" app>
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
      <v-btn color="primary" outlined @click="logout">Log-out</v-btn>
    </v-app-bar>
    <v-main app>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/dashboard',
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
      miniVariant: false,
      // right: true,
      // rightDrawer: false,
      title: 'Warehouse Manager',
    }
  },
  methods: {
    logout() {
      this.$router.push('/auth/login')
    },
  },
}
</script>
<style lang="css">
.container {
  max-height: 100vh;
}
</style>
