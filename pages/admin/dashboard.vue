<template>
  <v-row class="">
    <v-col cols="3">
      <v-card class="mr-3 ml-3" elevation="" min-height="150">
        <v-card-text class="text-center justify-self-center">
          <div class="text-subtitle-1 font-weight-black">
            <h6 class="text-h3">{{ products.length }}</h6>
            <p class="text-h6 mt-2 mb-1">Different products</p>
            <p class="text-caption mt-0">Accross 3 FMCG categories</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3" v-for="(category, n) in reducedCategories" :key="n">
      <v-card class="mr-3 ml-3" elevation="" min-height="150">
        <v-card-text class="text-center justify-self-center">
          <div class="text-subtitle-1 font-weight-black">
            <h6 class="text-h3 d-flex flex-column">
              {{ `${category.numItems}` }}
              <span class="text-body-2">{{ n }} products</span>
            </h6>
            <p class="text-h6 mt-2 mb-1">
              <span>Worth </span> <span class="">&#8358;</span
              >{{ category.totalPrice }}
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      allCategories: null,
      allProducts: null,
    }
  },
  computed: {
    categories() {
      return (this.allCategories = this.$store.getters.getCategories)
    },

    products() {
      return (this.allProducts = this.$store.getters.getProducts)
    },

    reducedCategories() {
      const reducedData = Object.entries(this.categories).reduce(
        (result, [categoryName, products]) => {
          // Calculate the total price, number of items, and total base_qty for the current category
          const totalPrice = products.reduce(
            (total, product) => total + product.price,
            0
          )
          const numItems = products.length
          const totalBaseQty = products.reduce(
            (total, product) => total + product.base_qty,
            0
          )

          // Add the calculated values to the result object using the category name as the key
          result[categoryName] = { totalPrice, numItems, totalBaseQty }

          return result
        },
        {}
      )

      return reducedData
    },
  },
}
</script>

<style lang="scss" scoped></style>
