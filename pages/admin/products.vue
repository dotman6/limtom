<template>
  <div>
    <v-row>
      <v-col class="d-flex">
        <h5 class="text-h5">Category</h5>
        <v-spacer></v-spacer>
        <add-products />
        <product-update />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="3" v-for="category in productCategories" :key="category.id">
        <v-card class="mx-auto" max-width="374">
          <v-img
            height="200"
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
          ></v-img>

          <v-card-title class="text-h6 text-truncate">{{
            category.name
          }}</v-card-title>

          <v-card-text>
            <div class="text-subtitle-1">
              <v-icon>mdi-dot</v-icon>{{ `${category.inStock} packs` }}
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddProducts from '~/components/AddProducts.vue'
import ProductUpdate from '~/components/ProductUpdate.vue'
export default {
  components: {
    AddProducts,
    ProductUpdate,
  },
  head() {
    return {
      title: 'All products',
      meta: [
        {
          name: 'description',
          content: 'This is the all products page',
          hid: 'description',
        },
      ],
    }
  },
  data: () => {
    return {
      page: '',
      productCategories: [
        { id: 1, name: 'Home care', inStock: 1000 },
        { id: 2, name: 'Personal care', inStock: 2500 },
        { id: 3, name: 'Foods & Beverages', inStock: 5000 },
        // { id: 4, name: 'Alcohols & Cigars', inStock: 300 },
        // { id: 5, name: 'OTC', inStock: 500 },
      ],
    }
  },
}
</script>

<style scoped>
.product-cate {
  margin-bottom: 0;
}
</style>
