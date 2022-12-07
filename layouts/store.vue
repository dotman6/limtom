<template>
  <v-app>
    <v-app-bar fixed flat app>
      <v-toolbar-title v-text="title" class="font-weight-bold" />
      <v-spacer />
    </v-app-bar>
    <v-main app>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Supply Store',
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
