<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        outlined
        v-bind="attrs"
        v-on="on"
        class="text-capitalize mr-3"
      >
        Add product
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Product</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6" class="pl-0">
                <v-text-field
                  label="Product name"
                  required
                  dense
                  outlined
                  v-model="product.name"
                  :rules="[
                    (v) => !!v || 'Field is required',
                    (v) =>
                      (!!v && v.trim().length >= 5) ||
                      'Value must not be less than 5',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Manufacturer"
                  dense
                  outlined
                  v-model="product.manufacturer"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pl-0">
                <v-select
                  :items="category"
                  label="Category"
                  dense
                  outlined
                  required
                  v-model="categorySelection"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="subCategories"
                  label="Sub-category"
                  dense
                  outlined
                  required
                  v-model="product.subCategory"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-select>
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
        <v-btn color="blue darken-1" text @click="addProduct"> Save </v-btn>
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
        name: '',
        manufacturer: '',
        category: '',
        subCategory: '',
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
    }
  },
  mounted() {
    this.categories.forEach((el) => {
      this.category.push(el.name)
    })
  },

  watch: {
    categorySelection(newValue) {
      this.product.category = newValue
      this.categories.forEach((el) => {
        if (el.name == newValue) return (this.subCategories = el.subCategory)
      })
    },
  },
  methods: {
    addProduct() {
      if (this.$refs.form.validate()) {
        this.dialog = false
      }
    },
  },
}
</script>

<style scoped></style>
