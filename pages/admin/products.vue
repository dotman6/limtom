<template>
  <v-row class="pa-3">
    <v-row>
      <v-col class="d-flex mt-2">
        <h5 class="text-h5 font-weight-light">Category</h5>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="text-capitalize"
          @click="loadAllProducts"
        >
          All Products
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="3" v-for="category in productCategories" :key="category.id">
        <v-card class="mx-auto" max-width="374">
          <v-img height="150" :src="category.img"></v-img>

          <v-card-title class="text-h6 text-truncate">{{
            category.name
          }}</v-card-title>

          <v-card-text>
            <div class="text-subtitle-1 font-weight-bold">
              <v-icon>mdi-dot</v-icon>{{ `${category.inStock} Cartons` }}
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>
        </v-card>
      </v-col>
    </v-row>
    <v-col class="mt-3">
      <h4 class="text-h5 font-weight-light">Featured products</h4>
    </v-col>
    <v-row class="">
      <v-col cols="2" v-for="(product, n) in productImg" :key="n">
        <v-card class="mr-3 ml-3" elevation="" min-height="150">
          <v-card-text class="text-center justify-self-center">
            <v-img
              max-height="100"
              max-width="120"
              :src="product.img"
              position="center"
              contain
              :alt="product.name"
            ></v-img>
            <div class="text-subtitle-1 font-weight-black">
              <h6 class="text-truncate">{{ product.name }}</h6>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
export default {
  components: {},
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
        {
          id: 1,
          name: 'Home care',
          inStock: '',
          img:
            'https://indieseducation.b-cdn.net/wp-content/uploads/2020/05/home-care-fmcg-product.jpg',
        },
        {
          id: 2,
          name: 'Personal care',
          inStock: '',
          img:
            'https://indieseducation.b-cdn.net/wp-content/uploads/2020/05/personal-care-fmcg-product-1.jpg',
        },
        {
          id: 3,
          name: 'Foods & Beverages',
          inStock: '',
          img:
            'https://indieseducation.b-cdn.net/wp-content/uploads/2020/05/fmcg-product-food-and-beverages.jpg',
        },
      ],
      productImg: [
        {
          name: '2-Sure herbal moisture plus - 70g',
          img:
            'https://i0.wp.com/nextcashandcarry.com.ng/wp-content/uploads/2022/05/Anti-Bac.-Soap-120g-Herbal.png?fit=559%2C374&ssl=1',
        },
        {
          name: '2-Sure dishwasher fresh lemon- 500ml',
          img:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbVq_XbSJ5wCsp_68VOXt8bXaFdCg6jXQ_8g&usqp=CAU',
        },
        {
          name: 'Colgate  maximum protection-95g',
          img:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX_RQY7ILjYBs8gDiPnW16xyzbaLSPJxctLg&usqp=CAU',
        },
        {
          name: 'Indomie relish chicken delight- 114g',
          img:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB18gOHON_rd4R8Gb6JS93_TB6LKOrNUpyZA&usqp=CAU',
        },
        {
          name: 'knorr chicken- 8g',
          img:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB7lQJuhxVgVZ45jDz6Lku_6Urm4CpZRWWkg&usqp=CAU',
        },
        {
          name: 'Sprite classic- PET- 33cl',
          img:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8XZ99K7qMRY3Fp451dgyC_28dc4GBu2zJzw&usqp=CAU',
        },
      ],
    }
  },
  async mounted() {
    const { data: Products, error } = await this.$supabase
      .from('Products')
      .select('*')
    this.$store.dispatch('setProducts', Products)
    this.$store.dispatch('setSnackbar', {
      show: true,
      content: `All products retrieved`,
      color: 'success',
    })
    if (error) {
      this.$store.dispatch('setSnackbar', {
        show: true,
        content: 'Error retrieving products',
        color: 'error',
      })
    }
  },

  computed: {
    getProducts() {
      return this.$store.getters.getProducts
    },

    categories() {
      return this.$store.getters.getCategories
    },

    totalStockFoodsAndBeverages() {
      let sum = this.categories['foods and beverages'].reduce((acc, cur) => {
        return acc + cur.quantity_in_stock
      }, 0)

      this.productCategories[2].inStock = sum
      return sum
    },

    totalStockPersonalCare() {
      let sum = this.categories['personal care'].reduce((acc, cur) => {
        return acc + cur.quantity_in_stock
      }, 0)

      this.productCategories[1].inStock = sum
      return sum
    },

    totalStockHomeCare() {
      let sum = this.categories['home care'].reduce((acc, cur) => {
        return acc + cur.quantity_in_stock
      }, 0)
      this.productCategories[0].inStock = sum
      return sum
    },
  },

  methods: {
    loadAllProducts() {
      this.$router.push('/admin/allproducts')
    },
  },
}
</script>

<style lang="css"></style>
