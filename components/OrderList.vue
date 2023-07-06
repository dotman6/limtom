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
        class="elevation-1 text-capitalize text-body-1"
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
          <v-switch
            v-model="item.delivery_status"
            inset
            dense
            disabled
          ></v-switch>
        </template>
        <template v-slot:[`item.approved`]="{ item }">
          <v-switch
            v-model="item.approved"
            inset
            dense
            @change="switchChange(item)"
            :disabled="
              item.approved ? (isDisabled = true) : (isDisabled = false)
            "
          ></v-switch>
        </template>
      </v-data-table>
    </v-tab-item>
    <!-- <Notifiy /> -->
  </v-tabs>
</template>
<script>
import Notifiy from './Notification.vue'
export default {
  components: {
    Notifiy,
  },
  data() {
    return {
      headers: [
        {
          text: 'Customer Name',
          value: 'customer_name',
          align: 'center',
          class: 'text-body-1 font-weight-bold',
        },
        {
          text: 'Items',
          value: 'items',
          align: 'center',
          class: 'text-body-1 font-weight-bold',
        },
        {
          text: 'Billing Address',
          value: 'billing_address',
          align: 'center',
          class: 'text-body-1 font-weight-bold',
        },
        {
          text: 'Approved',
          value: 'approved',
          align: 'center',
          class: 'text-body-1 font-weight-bold',
        },
        {
          text: 'Delivery Status',
          value: 'delivery_status',
          align: 'center',
          class: 'text-body-1 font-weight-bold',
        },
      ],
      orders: [],
      updatedProducts: null,
      isDisabled: false,
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
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error retrieving orders',
          color: 'error',
        })
      }
      this.orders = orders
    },
    getColor(item) {
      if (item == false) return 'red'
      else return 'green'
    },

    async switchChange(item) {
      //Look up for the users to retrieve the admin who are drivers
      const { data: users, error } = await this.$supabase
        .from('users')
        .select('*')
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error retrieving users',
          color: 'error',
        })
      }
      //filter the drivers from the user data
      let drivers = []
      users.forEach((user) => {
        if (user.raw_user_meta_data.role === 'Driver') {
          drivers.push(user)
        }
      })
      //If there are no drivers
      if (drivers.length === 0) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'There are no drivers added, Pls consider adding drivers',
          color: 'error',
        })
      }

      //Continue if there are drivers
      if (drivers.length > 0) {
        const selectedDriverIndex = Math.floor(Math.random() * drivers.length)
        //Get the selectedDriver ID
        const deliveryDriver = drivers[selectedDriverIndex].id
        //Look up for the order to update
        console.log('Drivers are available to deliver order')
        this.updateOrder(item, deliveryDriver)
      }
    },

    async updateOrder(item, driverId) {
      //Update the order table first
      const { data, error } = await this.$supabase
        .from('orders')
        .update({ approved: true, driver_id: driverId })
        .eq('id', item.id)
      //Look up for the prduct and update stock
      const order = item
      const updatedProducts = this.getProducts.map((product) => {
        const orderItem = order.items.find(
          (item) => item.product.product_name === product.product_name
        )
        if (orderItem) {
          return {
            ...product,
            quantity_in_stock: product.quantity_in_stock - orderItem.quantity,
          }
        }
      })
      this.updatedProducts = updatedProducts.filter(
        (product) => product !== undefined
      )
      //Updte the database
      this.updatedProducts.forEach((product) => {
        this.updateTable(product)
      })
      //Check for error
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error updating orders',
          color: 'error',
        })
      }
    },

    async updateTable(product) {
      const { data, error } = await this.$supabase
        .from('Products')
        .update({ quantity_in_stock: product.quantity_in_stock })
        .eq('id', product.id)
      console.log(data)
    },
  },
  computed: {
    getProducts() {
      return this.$store.getters.getProducts
    },
  },
}
</script>
