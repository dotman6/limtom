<template>
  <div>
    <p>{{ `This is the ${this.$route.name} page` }}</p>
    <add-driver />
    <div id="map2" style="height: 80vh;">
      <client-only>
        <l-map :zoom="zoom" ref="map" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            :lat-lng="center"
            draggable
            ref="driver"
            @drag="track($event)"
          >
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
      zoom: 10,
      center: [7.1379161, 3.3389562],
      iconUrl: '/assets/truck-1.1s-200px.svg',
      // icon: L.icon({
      //   iconUrl: '/images/baseball-marker.png',
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      // }),
    }
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
    track(event) {
      let lat = event.latlng.lat
      let lng = event.latlng.lng
      this.$store.dispatch('setDriverLocation', [lat, lng])
      console.log(lat, lng)
    },
  },
}
</script>
