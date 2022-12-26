<template>
  <div>
    <add-driver />
    <div id="map2" style="height: 80vh;">
      <client-only>
        <l-map
          :zoom="zoom"
          ref="map"
          :center="center"
          style="position: relative;"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-geo-json
            :geojson="geoJson"
            v-if="geoJson"
            :options="options"
          ></l-geo-json>
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
      geoJson: null,
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

    options() {
      return {
        onEachFeature: this.onEachFeatureFunction,
      }
    },
    onEachFeatureFunction() {
      return (feature, layer) => {
        layer.bindPopup(
          `<p ref="mine" class="mt-0 mb-0 text-subtitle-1 text-center font-weight-bold text-capitalize">Name:
            ${feature.properties.customer_name}</p>
            <p class="mt-2 mb-2 text-subtitle-2 text-center font-weight-bold">Email:
            ${feature.properties.email}
            </p> <p class="mt-2 mb-2 text-subtitle-2 text-center font-weight-bold">Delivery status:
            ${feature.properties.deliveryStatus}
            </p>`,
          {
            permanent: false,
            sticky: true,
          }
        )
      }
    },
  },

  methods: {
    async initialize() {
      const { data: orders, error } = await this.$supabase
        .from('orders')
        .select('*')
      //   this.$store.dispatch('setProducts', Products)
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error retrieving orders',
          color: 'error',
        })
      }
      this.orders = orders
      this.getLocation(this.orders)
      this.geoJson = this.convertToGeoJSON(this.orders)
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

    convertToGeoJSON(arr) {
      const geoJSON = {
        type: 'FeatureCollection',
        features: [],
      }

      arr.forEach((item) => {
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              item.billing_address.longitude,
              item.billing_address.latitude,
            ],
          },
          properties: {
            customer_name: item.customer_name,
            email: item.email,
            deliveryStatus: item.delivery_status,
          },
        }
        geoJSON.features.push(feature)
      })
      return geoJSON
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
