<template>
  <div class="driver-view">
    <div class="order-sec">
      <h3 class="text--h3 text-center pa-3 primary--text pt-0">
        Orders to be delivered
      </h3>
      <v-sheet elevation="5" class="order-card pa-6">
        <v-card
          elevation=""
          tile
          max-width=""
          v-for="(order, i) in orders"
          :key="i"
          class="card"
        >
          <v-list-item>
            <v-list-item-avatar>
              <v-icon color="orange" dark>mdi-basket</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="d-block text-capitalize mb-3">{{
                order.customer_name
              }}</v-list-item-title>

              <v-list-item-subtitle class="text-caption"
                >Qty: {{ order.items.length }}</v-list-item-subtitle
              >
            </v-list-item-content>

            <v-list-item-action>
              <v-btn large color="primary lighten-1 text-capitalize">
                <v-icon color=""> mdi-home-map-marker</v-icon>
                locate
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-sheet>
      <section class="bottom-bar">
        <div class="latLngLabel">{{ lat }}, {{ lng }}</div>
        <v-btn class="ui v-btn green" @click="startLocationUpdates">
          <i class="circle dot outline icon large"></i>
          Start Location
        </v-btn>

        <v-btn class="ui v-btn red" @click="stopLocationUpdates">
          <i class="circle dot outline icon large"></i>
          Stop Location
        </v-btn>

        <v-btn
          class="ui v-btn"
          @click="deliverOrder"
          color="primary"
          :disabled="disable"
        >
          <i class="circle dot outline icon large"></i>
          Deliver Order
        </v-btn>
      </section>
    </div>

    <!-- <section class="top-bar">
      <div v-if="user">{{ user.email }}</div>
      <div>Driver</div>
      <v-btn class="ui v-btn red" @click="logOutButtonPressed"> logout </v-btn>
    </section> -->
    <div class="main-interface">
      <div id="map-wrap" style="height: 80vh">
        <client-only>
          <l-map :zoom="13" :center="center" ref="map" >
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-geo-json
              :geojson="geoJson"
              v-if="geoJson"
              :options="options"
              ref="geojson"
            ></l-geo-json>
            <l-marker
              :lat-lng="location"
              :draggable="draggable"
              @drag="track($event)"
              @dragend="confirmLocation"
              ><l-icon
                icon-url="https://harrywood.co.uk/maps/examples/leaflet/marker-icon-red.png"
              >
              </l-icon
            ></l-marker>
          </l-map>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { getDistance } from 'geolib'

export default {
  layout: 'driver',
  middleware: 'auth',
  data() {
    return {
      caller: null,
      user: null,
      lat: 0,
      lng: 0,
      watchPositionId: null,
      center: [55.9464418, 8.1277591],
      orders: [],
      orderLocations: [],
      draggable: true,
      location: [6.4474, 3.3903],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      authenticated: false,
      authListener: null,
      geoJson: null,
      disable: true,
    }
  },

  async mounted() {
    const { data: authListener } = await this.$supabase.auth.onAuthStateChange(
      () => this.checkUser()
    )
    this.authListener = authListener
    let user = await this.checkUser()

    if (user) {
      this.initialize()
    }
  },

  created() {},

  methods: {
    async initialize() {
      //Look up for orders that belongs to the driver and are yet to be deliver
      const { data: orders, error } = await this.$supabase
        .from('orders')
        .select('*')
        .eq('driver_id', this.user.id)
        .eq('delivery_status', false)
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
      this.geoJson = this.convertToGeoJSON(this.orders)
      //Create a layer from the points
      // console.log(this.$L.layerGroup(this.orderLocations))
      //Fit map to bound
      this.$nextTick(() => {
        this.$refs.map.fitBounds(this.$refs.geojson.getBounds())
      })
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
            id: item.id,
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
    track(event) {
      this.lat = event.latlng.lat
      this.lng = event.latlng.lng

      let lat = event.latlng.lat
      let lng = event.latlng.lng
      this.location = [lat, lng]
      this.$store.dispatch('setDriverLocation', [lat, lng])
      console.log(lat, lng)
      const channel = this.$supabase.channel('currentLocation')
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // now you can start broadcasting cursor positions
          setInterval(() => {
            channel.send({
              type: 'broadcast',
              event: 'cursor-pos',
              payload: [lat, lng],
            })
            // console.log(status)
          }, 1000)
        }
      })
    },
    startLocationUpdates() {
      var marker = this.$L.marker([this.lat, this.lng])
      this.watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this.lat = position.coords.latitude
          this.lng = position.coords.longitude

          this.center = [this.lat, this.lng]
          marker.setLatLng(this.lat, this.lng)
          //   this.updateLocation(this.lat, this.lng)
        },
        (error) => {
          console.log(error.message)
        }
      )
    },

    stopLocationUpdates() {
      navigator.geolocation.clearWatch(this.watchPositionId)
      //update the order table with the delivery status
    },

    async logOutButtonPressed() {
      let { error } = await this.$supabase.auth.signOut()
      if (!error) {
        this.$router.push('/auth/login')
      }
    },
    async checkUser() {
      const user = await this.$supabase.auth.getUser()
      if (user) {
        this.authenticated = true
        return (this.user = user.data.user)
      } else {
        this.authenticated = false
      }
    },

    confirmLocation() {
      //Look out for the order close to the driver
      this.geoJson.features.forEach((orderGeo) => {
        const dist = getDistance(
          { latitude: this.lat, longitude: this.lng },
          {
            latitude: orderGeo.geometry.coordinates[1],
            longitude: orderGeo.geometry.coordinates[0],
          }
        )

        if (dist <= 5) {
          this.disable = false
          this.productToDeliver = orderGeo.properties.id
        }
      })
    },
    async deliverOrder() {
      //Update the delivery status of the order table
      const { data, error } = await this.$supabase
        .from('orders')
        .update({ delivery_status: true })
        .eq('id', this.productToDeliver)

      this.disable = true
    },
  },

  computed: {
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
            </p><p class="mt-2 mb-2 text-subtitle-2 text-center font-weight-bold">Delivery status:
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
}
</script>

<style>
.driver-view {
  display: flex;
  height: 85vh;
  column-gap: 30px;
}

.top-bar {
  height: 100px;
  text-align: center;
  background: white;
}

.map {
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.bottom-bar {
  padding: 20px 0px;
  text-align: center;
  background: white;
}

.order-card {
  overflow-y: scroll;
  max-width: 100%;
  overflow-x: hidden;
}

.main-interface {
  flex: 0 0 65%;
}

.card:not(:last-of-type) {
  margin-block-end: 15px;
}

.order-sec {
  display: flex;
  flex-direction: column;
  flex: 0 0 35%;
  order: 1;
}
</style>
