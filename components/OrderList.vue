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
    <v-tab class="text-capitalize font-weight-bold black--text my-tab">
      Map-view
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
                {{ item.product_name }} : {{ item.quantity }} x
                {{ item.price }} =
                {{ item.total_price }}
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
    <v-tab-item class="">
      <div id="map" style="height: 80vh;">
        <client-only>
          <l-map :zoom="zoom" ref="map" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-layer-group ref="features">
              <l-popup>
                <span> Yay I was opened by {{ caller }}</span></l-popup
              >
            </l-layer-group>
            <l-marker
              :lat-lng="location"
              v-for="(location, index) in orderLocations"
              :key="index"
              @click="openPopUp(location, $event)"
            ></l-marker>
            <l-marker
              :lat-lng="$store.state.driverLocation"
              ref="driver"
              @ready="track()"
            >
              <l-icon
                icon-url="https://harrywood.co.uk/maps/examples/leaflet/marker-icon-red.png"
              >
              </l-icon>
            </l-marker>
            <l-control-layers position="topright"></l-control-layers>
          </l-map>
        </client-only>
      </div>
    </v-tab-item>
  </v-tabs>
</template>
<script>
import { map } from 'leaflet'

export default {
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 10,
      center: [6.601838, 3.3514863],
      caller: null,
      // markerLatLng: [7.1379161, 3.3389562],
      headers: [
        { text: 'Customer Name', value: 'customer_name', align: 'center' },
        { text: 'Items', value: 'items', align: 'center' },
        { text: 'Billing Address', value: 'billing_address', align: 'center' },
        { text: 'Approved', value: 'approved', align: 'center' },
        { text: 'Delivery Status', value: 'delivery_status', align: 'center' },
      ],
      orders: [],
      orderLocations: [],
      layer: null,
      currentDriverLocation: null,
    }
  },
  created() {
    this.initialize()
  },

  // mounted() {
  //   this.$nextTick(() => {
  //     console.log(this.$refs.map)
  //   })
  // },

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
      this.getLocation(this.orders)

      //Create a layer from the points
      // console.log(this.$L.layerGroup(this.orderLocations))
    },
    getColor(item) {
      if (item == false) return 'red'
      else return 'green'
    },
    getLocation(arr) {
      for (const item of arr) {
        let longitude = item.billing_address.longitude
        let latitude = item.billing_address.latitude
        this.orderLocations.push([latitude, longitude])
      }
      const layerGroup = this.$L.layerGroup(this.orderLocations)
    },

    track() {
      return (this.currentDriverLocation = this.$store.state.driverLocation)
    },

    // getMap() {
    //   console.log(this.$refs.map.addLayer())
    // },

    openPopUp(latLng) {
      // this.caller = caller
      this.$refs.features.mapObject.openPopup(latLng)
    },

    // switchChange(item) {
    //   const order = item
    //   const productOrdered = this.getProducts.filter((product) =>
    //     order.items.some(
    //       (item) => item.name === product.name && item.id === product.id
    //     )
    //   )

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

  computed: {
    getProducts() {
      return this.$store.getters.getProducts
    },
  },
}
</script>
