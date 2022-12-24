<template>
  <v-row justify="center" align="center">
    <div class="d-flex flex-column text-center">
      <h4 class="text-md-h4 text-h6 primary--text mt-4">
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
      <v-slide-group>
        <v-slide-item v-for="(product, i) in slideItems" :key="i">
          <v-card
            nuxt
            :to="`/products/${product.id}`"
            color="surface"
            width="300"
            class="el ma-2 mb-5 mr-5 justify-center"
          >
            <v-img :src="product.image_url" height="250" contain>
              <template #placeholder>
                <v-row class="fill-height" justify="center" align="center">
                  <v-progress-circular
                    width="2"
                    size="100"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <v-card-title
              class="text-md-body-1 font-weight-bold justify-self-center"
              >{{ product.product_name }}</v-card-title
            >
            <v-card-subtitle class="primary--text pb-3 text-h5 mt-2">
              {{ $formatMoney(product.price) }}
            </v-card-subtitle>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-col>
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
    if (error) {
      this.$store.dispatch('setSnackbar', {
        show: true,
        content: 'Error retreiving products',
        color: 'error',
      })
    }
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
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error retreiving products',
          color: 'error',
        })
      }
    },
  },

  computed: {
    products() {
      return this.$store.state.products
    },
  },

  mounted() {
    //filter the product by the select value
  },

  methods: {
    addToCart(product) {
      this.$store.dispatch('addToCart', {
        product: product.id,
        quantity: 1,
      })
    },
  },
}
</script>
<style lang="css" scoped>
.price-text {
  font-size: 20px;
  letter-spacing: 0.5;
}

.qty-input {
  padding-left: 100px;
  padding-right: 100px;
}
</style>
