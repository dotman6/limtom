<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        outlined
        v-bind="attrs"
        v-on="on"
        class="text-capitalize"
      >
        Update product
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Update Product Info</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <v-form ref="form2">
            <v-row>
              <v-col cols="12" sm="6" class="pl-0">
                <v-text-field
                  label="Product name"
                  required
                  dense
                  outlined
                  v-model="product.name"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Manufacturer"
                  dense
                  outlined
                  v-model="product.manufacturer"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pl-0 pb-0">
                <v-select
                  :items="category"
                  label="Category"
                  dense
                  outlined
                  required
                  v-model="product.category"
                  disabled
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-select
                  :items="subCategories"
                  label="Sub-category"
                  dense
                  outlined
                  required
                  v-model="product.subCategory"
                  disabled
                ></v-select>
              </v-col>
              <v-card-text class="pa-0 pb-2">
                <v-divider></v-divider>
              </v-card-text>
              <v-col cols="12" sm="4" class="pl-0">
                <v-text-field
                  label="Price"
                  required
                  dense
                  outlined
                  v-model.number="product.price"
                  :rules="numberRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  label="Quantity To Stock"
                  dense
                  outlined
                  v-model.number="product.quantityToStock"
                  :rules="numberRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" class="">
                <v-text-field
                  label="Batch Number"
                  dense
                  outlined
                  required
                  v-model="product.batchNumber"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0 pl-0">
                <v-textarea
                  label="Product Description"
                  dense
                  outlined
                  required
                  rows="2"
                  v-model="product.description"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6" class="pl-0">
                <v-text-field
                  label="Production Date"
                  dense
                  outlined
                  required
                  type="date"
                  v-model="product.productionDate"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Expiring Date"
                  dense
                  outlined
                  type="date"
                  v-model="product.ExpiringDate"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="updateProduct"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Add-products',
  data() {
    return {
      dialog: false,
      product: {
        name: 'Bournvita',
        manufacturer: 'Cardbury',
        category: 'Foods and Beverages',
        subCategory: '',
        price: '',
        quantityToStock: '',
        description: '',
        batchNumber: '',
        productionDate: '',
        ExpiringDate: '',
      },
      categorySelection: '',
      category: [],
      subCategories: [],
      categories: [
        {
          name: 'Home care',
          subCategory: [
            'Dishwasher',
            'Fabric care',
            'Home insecticide',
            'Toilet care',
          ],
        },
        {
          name: 'Personal care',
          subCategory: ['Oral care', 'Soap and Bath'],
        },
        {
          name: 'Foods and Beverages',
          subCategory: [
            'Convenience foods',
            'Soft drinks',
            'Tea and Coffee',
            'Baked foods',
          ],
        },
      ],
      numberRules: [
        (v) => !!v || 'Field is required',
        (v) => (!!v && typeof v !== 'string') || 'Must be a number',
        (v) => (!!v && v > 0) || 'Must be greater than 0',
      ],
    }
  },
  mounted() {
    this.categories.forEach((el) => {
      this.category.push(el.name)
      this.product.subCategory = 'Tea and Coffee'
    })
  },

  methods: {
    updateProduct() {
      if (this.$refs.form2.validate()) {
        this.dialog = false
        console.log(this.product)
      }
    },
  },
}
</script>

<style scoped></style>
