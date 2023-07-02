<template>
  <div>
    <br />
    <div class="text-center" v-if="$store.state.cart.length == 0">
      <v-img class="d-block mx-auto" src="/emptycart.svg" width="500"></v-img>
      <p>No Items Just Yet</p>
    </div>
    <v-container>
      <div class="cart-container mb-3" v-if="$store.state.cart.length > 0">
        <v-btn
          nuxt
          to="/cart/confirm"
          min-width="150"
          min-height="45"
          color="primary"
          >Checkout</v-btn
        >
        <p class="text-h6">Total Amount: NGN{{ getTotalAmount.toFixed(2) }}</p>
      </div>
      <v-row>
        <template v-for="(c, i) in $store.state.cart">
          <v-col cols="12" justify="center">
            <v-card color="surface" flat elevation="3" class="mt-5">
              <v-btn
                @click="$store.commit('REMOVE_CART_ITEM', i)"
                absolute
                top
                right
                icon
              >
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>

              <v-row dense>
                <v-col md="3">
                  <v-img
                    class=""
                    height="220"
                    contain
                    :src="c.product.image_url"
                  ></v-img>
                </v-col>
                <v-col class="pl-5 pt-2" md="9">
                  <h2 class="text-md-h6 font-weight-bold">
                    {{ c.product.product_name }} x {{ c.quantity }}
                  </h2>
                  <p class="primary--text mt-2">
                    {{ $formatMoney(c.product.price * c.quantity) }}
                  </p>
                  <v-btn @click="$store.commit('INCREASE_ITEM_COUNT', i)" icon>
                    <v-icon size="20">mdi-plus-circle</v-icon>
                  </v-btn>
                  <span class="mx-2">{{ c.quantity }}</span>
                  <v-btn @click="$store.commit('DECREASE_ITEM_COUNT', i)" icon>
                    <v-icon size="20">mdi-minus-circle</v-icon>
                  </v-btn>
                  <p class="primary--text mt-2 text-boby-1">
                    {{ c.product.description }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
    <ScrollTop />
  </div>
</template>

<script>
import ScrollTop from '~/components/ScrollTop.vue'
export default {
  layout: 'store',
  components: {
    ScrollTop,
  },
  data() {
    return {
      totalAmount: 0,
    }
  },

  computed: {
    getTotalAmount() {
      return this.$store.getters.get_cart_amount
    },
  },
}
</script>

<style lang="scss">
.cart-container {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between;

  p {
    margin-block-end: 0;
  }
}
</style>
