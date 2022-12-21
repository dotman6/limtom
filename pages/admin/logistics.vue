<template>
  <div>
    <p>{{ `This is the ${this.$route.name} page` }}</p>
    <add-driver />
    <div id="map2" style="height: 80vh;">
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
          <l-marker :lat-lng="center" ref="driver">
            <l-icon
              icon-url="https://harrywood.co.uk/maps/examples/leaflet/marker-icon-red.png"
              :icon-size="dynamicSize"
              :icon-anchor="dynamicAnchor"
            >
            </l-icon>
          </l-marker>
          <l-control-layers position="topright"></l-control-layers>
        </l-map>
      </client-only>
    </div>
  </div>
</template>

<script>
import { LIcon } from 'vue2-leaflet'
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

  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      center: [7.1379161, 3.3389562],
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      orders: [],
      orderLocations: [],
      caller: null,
    }
  },
  created() {
    this.initialize()
  },

  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15]
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15]
    },
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
    },

    openPopUp(latLng) {
      // this.caller = caller
      this.$refs.features.mapObject.openPopup(latLng)
    },
  },
  mounted() {
    // Listen to broadcast messages.
    this.$supabase
      .channel('currentLocation')
      .on(
        'broadcast',
        { event: 'cursor-pos' },
        (payload) => (this.center = payload.payload)
        // console.log(payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // your callback function will now be called with the messages broadcast by the other client
        }
      })
  },
}
</script>
