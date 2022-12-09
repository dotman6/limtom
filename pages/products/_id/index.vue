<template>
  <div v-if="product" class="justify-center v-row d-flex full-height">
    <v-card class="ma-4" width="250">
      <v-img
        height="150"
        :src="product.image_url"
        :alt="product.product_name"
        contain
      ></v-img>

      <v-card-title class="text-subtitle-2 pa-2 text-truncate">
        {{ product.product_name }}
      </v-card-title>

      <v-card-text class="pa-5">
        <div class="price-text text-center blue--text font-weight-light">
          <span class="">&#8358;</span>
          {{ product.price }}<span class="ml-2 text-caption">Per Carton</span>
        </div>
      </v-card-text>
      <v-card-text class="pa-0 pl-16 pr-16"> </v-card-text>
      <v-card-actions class="pt-5 pb-5 justify-center">
        <v-btn
          color="blue darken-1"
          small
          outlined
          class="text-capitalize snipcart-add-item pl-10 pr-10 block"
          :data-item-id="product.id"
          :data-item-name="product.product_name"
          :data-item-price="product.price"
          :data-item-image="product.image_url"
          :data-item-description="product.description"
          :data-item-url="`${this.$route.fullPath}`"
        >
          Add to cart
        </v-btn>
      </v-card-actions>
    </v-card>
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
    console.log(this.product[0])
  },
}
</script>

<style lang="css" scoped></style>
