<template>
  <v-row justify="center" align="center">
    <div class="d-flex flex-column text-center">
      <h4 class="text-h6 mt-4 font-weight-thin blue--text">
        Explore variety of products from our online store
      </h4>
      <h6 class="text-body-1 font-italic pt-1">
        A shopping experience like never before
      </h6>
    </div>
    <v-col cols="12" class="text-center pt-0">
      <v-col cols="12" md="4" class="ml-0">
        <v-select
          :items="categories"
          label="Category"
          dense
          outlined
          select
          v-model="select"
          :rules="[(v) => !!v || 'Field is required']"
        ></v-select
      ></v-col>
      <v-sheet class="mx-auto" elevation="8" max-width="1200">
        <v-slide-group
          v-model="modal"
          class="pa-3"
          active-class="success"
          show-arrows
        >
          <v-slide-item v-for="(product, i) in slideItems" :key="i">
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
                <div
                  class="price-text text-center blue--text font-weight-light"
                >
                  <span class="">&#8358;</span>
                  {{ product.price
                  }}<span class="ml-2 text-caption">Per Carton</span>
                </div>
              </v-card-text>
              <v-card-text class="pa-0 pl-16 pr-16"> </v-card-text>
              <v-card-actions class="pt-5 pb-5 justify-center">
                <v-btn
                  color="blue darken-1"
                  small
                  outlined
                  class="text-capitalize snipcart-add-item pl-10 pr-10 block"
                  @click="addToCart(product)"
                  :data-item-id="product.id"
                  :data-item-name="product.product_name"
                  :data-item-price="product.price"
                  :data-item-image="product.image_url"
                  :data-item-description="product.description"
                  :data-item-url="`https://deluxe-fudge-13dd9f.netlify.app/`"
                >
                  Add to cart
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-sheet></v-col
    >
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  head() {
    return {
      title: 'Supply store',
      meta: [
        {
          name: 'description',
          content: 'The main store of the application',
          hid: 'description',
        },
      ],
    }
  },
  layout: 'store',
  components: {},
  data() {
    return {
      modal: null,
      categories: ['Home care', 'Personal care', 'Foods and Beverages'],
      select: 'Home care',
      slideItems: [],
    }
  },

  async created() {
    // this.$snipcart.setCurrency('ngn')
    const { data: Products, error } = await this.$supabase
      .from('Products')
      .select('*')
      .eq('category', `${this.select.toLowerCase()}`)
    this.slideItems = Products
    this.$store.dispatch('setProducts', Products)
  },
  watch: {
    async select(newValue, oldValue) {
      const { data: Products, error } = await this.$supabase
        .from('Products')
        .select('*')

        // Filters
        .eq('category', `${newValue.toLowerCase()}`)
      this.slideItems = Products
      this.$store.dispatch('setProducts', Products)
    },
  },

  computed: {
    products() {
      return this.$store.state.products
    },

    // categoryItems() {
    //   let items = this.products.filter((el) => {
    //     return el.category == this.select.toLowerCase()
    //   })
    //   return items
    // },
  },

  mounted() {
    //filter the product by the select value
  },

  methods: {
    addToCart(product) {
      console.log(this.$snipcart)
      this.$store.dispatch('addToCart', {
        product: product.id,
        quantity: 1,
      })
    },
  },
}
</script>
<style lang="css">
.price-text {
  font-size: 20px;
  letter-spacing: 0.5;
}

.qty-input {
  padding-left: 100px;
  padding-right: 100px;
}
</style>
