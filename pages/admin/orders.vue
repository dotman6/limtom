<template>
  <div>
    <order-list />
  </div>
</template>

<script>
import OrderList from '~/components/OrderList.vue'
export default {
  components: {
    OrderList,
  },
  head() {
    return {
      title: 'All Orders',
      meta: [
        {
          name: 'description',
          content: 'A page displaying all the orders recieved',
          hid: 'order-description',
        },
      ],
    }
  },
  data() {
    return {}
  },
}
</script>
