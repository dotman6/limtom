<template>
  <div>
    <p>{{ `This is the ${this.$route.name} page` }}</p>
    <add-driver />
  </div>
</template>

<script>
import AddDriver from '~/components/AddDriver.vue'
export default {
  components: {
    AddDriver,
  },
  head() {
    return {
      title: 'Delivery Monitoring',
      meta: [
        {
          name: 'description',
          content: 'Delivery monitoring page',
          hid: 'description',
        },
      ],
    }
  },
}
</script>
