<template>
  <v-tabs
    elevation=""
    right
    flat
    tile
    slider-color="#7c1d74"
    slider-size="4"
    center-active
    color="blue"
  >
    <v-tab class="text-capitalize font-weight-bold black--text my-tab" active>
      List-view
    </v-tab>
    <v-tab-item class="">
      <v-data-table
        :headers="headers"
        :items="orders"
        class="elevation-1"
        :items-per-page="7"
        align="start"
      >
        <template v-slot:[`item.items`]="{ item }">
          <div v-for="item in item.items" :key="item.id">
            <ul>
              <li>
                {{ item.product.product_name }} : {{ item.quantity }} x
                {{ item.product.price }} =
                {{ item.quantity * item.product.price }}
              </li>
            </ul>
          </div>
        </template>

        <template v-slot:[`item.billing_address`]="{ item }">
          <div>
            {{ item.billing_address.latitude }},
            {{ item.billing_address.longitude }}
          </div>
        </template>

        <template v-slot:[`item.delivery_status`]="{ item }">
          <v-switch v-model="item.delivery_status" inset dense></v-switch>
        </template>
        <template v-slot:[`item.approved`]="{ item }">
          <v-switch
            v-model="item.approved"
            inset
            dense
            @change="switchChange(item)"
          ></v-switch>
        </template>
      </v-data-table>
    </v-tab-item>
  </v-tabs>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Customer Name', value: 'customer_name', align: 'center' },
        { text: 'Items', value: 'items', align: 'center' },
        { text: 'Billing Address', value: 'billing_address', align: 'center' },
        { text: 'Approved', value: 'approved', align: 'center' },
        { text: 'Delivery Status', value: 'delivery_status', align: 'center' },
      ],
      orders: [],
    }
  },
  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const { data: orders, error } = await this.$supabase
        .from('orders')
        .select('*')
      //   this.$store.dispatch('setProducts', Products)
      this.$store.dispatch('setSnackbar', {
        show: true,
        content: `All orders retrieved`,
        color: 'success',
      })
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error retrieving orders',
          color: 'error',
        })
      }
      this.orders = orders
      // this.getLocation(this.orders)

      //Create a layer from the points
      // console.log(this.$L.layerGroup(this.orderLocations))
    },
    getColor(item) {
      if (item == false) return 'red'
      else return 'green'
    },

    // openPopUp(latLng) {
    //   // this.caller = caller
    //   this.$refs.features.mapObject.openPopup(latLng)
    // },

    switchChange(item) {
      const order = item
      console.log(order)
      const filteredHobbies = this.getProducts.filter((product) => {
        return order.items.some(
          (item) => item.product.product_name === product.product_name
        )
      })

      console.log(filteredHobbies)

      // const productOrdered = this.getProducts.filter((product) =>
      //   order.items.some(
      //     (item) =>
      //       item[product].product_name === product.name &&
      //       item[product].id === product.id
      //   )
      // )
      // console.log(order)

      //   const itemsWithinOrder = order.items
      //   const rem = productOrdered.forEach((product) => {
      //     return product.quantity_in_stock
      //     // return itemsWithinOrder.forEach((it) => {
      //     //   return product.quantity_in_stock
      //     // })
      //   })
      //   //Update the order table
      //   console.log(rem)
      //   console.log(productOrdered)
      // },
    },
  },
  computed: {
    getProducts() {
      return this.$store.getters.getProducts
    },
  },

  // mounted() {
  //   // Listen to broadcast messages.
  //   this.$supabase
  //     .channel('currentLocation')
  //     .on(
  //       'broadcast',
  //       { event: 'cursor-pos' },
  //       (payload) => (this.center = payload.payload)
  //       // console.log(payload)
  //     )
  //     .subscribe((status) => {
  //       if (status === 'SUBSCRIBED') {
  //         // your callback function will now be called with the messages broadcast by the other client
  //       }
  //     })
  // },
}
</script>
