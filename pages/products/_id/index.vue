<template>
  <div>
    <v-container v-if="product">
      <v-row justify="center">
        <v-col cols="11" md="7">
          <h2 class="text-center text-md-h4 font-weight-bold">
            {{ product.product_name }}
          </h2>
          <br />
          <v-img
            width="100%"
            contain
            class="el rounded-lg"
            height="40vh"
            :src="product.image_url"
          ></v-img>
          <v-card-subtitle class="primary--text text-h5 ml-0 pl-0 pr-0">
            {{ $formatMoney(product.price) }}
          </v-card-subtitle>
          <p class="mb-7">
            {{ product.description }}
          </p>
          <v-btn
            @click="$store.commit('ADD_TO_CART', product)"
            min-height="45"
            min-width="170"
            class="text-capitalize"
            color="primary"
            >Add To Cart</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <br /><br />
    <ScrollTop />
  </div>
</template>

<script>
export default {
  layout: 'store',
  data() {
    return {
      created: false,
      product: null,
    }
  },
  async beforeCreate() {
    // this.$snipcart.setCurrency('ngn')
    const { data: Products, error } = await this.$supabase
      .from('Products')
      .select('*')
      .eq('id', `${this.$route.params.id}`)
    this.product = await Products[0]
    if (error) {
      this.$store.dispatch('setSnackbar', {
        show: true,
        content: 'Error retreiving products',
        color: 'error',
      })
    }
  },
}
</script>

<style lang="css" scoped></style>
