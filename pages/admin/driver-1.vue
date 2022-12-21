<template>
  <div class="driver-view">
    <section class="top-bar">
      <div v-if="user">{{ user.email }}</div>
      <div>Driver</div>
      <v-btn class="ui v-btn red" @click="signOutButtonPressed">
        Signout
      </v-btn>
    </section>

    <div id="map-wrap" style="height: 80vh;">
      <client-only>
        <l-map :zoom="13" :center="center" ref="map">
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
            :lat-lng="location"
            :draggable="draggable"
            @drag="track($event)"
            ><l-icon
              icon-url="https://harrywood.co.uk/maps/examples/leaflet/marker-icon-red.png"
            >
            </l-icon
          ></l-marker>
        </l-map>
      </client-only>
    </div>

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
    </section>
  </div>
</template>

<script>
export default {
  layout: 'login',
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
    }
  },

  //   mounted() {
  //     firebase.auth().onAuthStateChanged((user) => {
  //       this.user = user
  //     })
  //   },
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
      this.getLocation(this.orders)

      //Create a layer from the points
      // console.log(this.$L.layerGroup(this.orderLocations))
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
    track(event) {
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
    },

    signOutButtonPressed() {
      firebase
        .auth()
        .signOut()
        .then((user) => {
          this.$router.push({
            name: 'Signin',
          })
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    updateLocation(lat, lng) {
      const db = firebase.firestore()
      db.collection('users')
        .doc(this.user.uid)
        .set({ lat: lat, lng: lng, active: true }, { merge: true })
    },
  },
}
</script>

<style>
.driver-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
</style>
