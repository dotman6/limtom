<template>
  <div>
    <p>{{ `This is the ${this.$route.name} page` }}</p>
  </div>
</template>

<script>
export default {
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
