<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="expiring_date"
    class="elevation-1"
    :search="search"
    dense
    :items-per-page="5"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>ALL PRODUCTS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          outlined
          dense
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Product
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="proForm">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.product_name"
                        label="Name"
                        :rules="[
                          (v) => !!v || 'Field is required',
                          (v) =>
                            (!!v && v.trim().length >= 5) ||
                            'Value must not be less than 5',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.manufacturer"
                        label="Manufacturer"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.category"
                        label="category"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.subcategory"
                        label="category"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.price"
                        label="price"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.quantity_in_stock"
                        label="qty_in_stock"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.batch_no"
                        label="batch_no"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        type="date"
                        v-model="editedItem.production_date"
                        label="prod_date"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        type="date"
                        v-model="editedItem.expiring_date"
                        label="exp_data"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="editedItem.base_qty"
                        label="base_qty"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.expiring_date`]="{ item }">
      <v-chip :color="getColor(item.expiring_date)" dark>
        {{ item.expiring_date }}
      </v-chip>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
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
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'product_name',
        },
        { text: 'Manufacturer', value: 'manufacturer' },
        { text: 'Category', value: 'category' },
        { text: 'Subcategory', value: 'subcategory' },
        { text: 'Price (N)', value: 'price' },
        { text: 'Qty_in_stock', value: 'quantity_in_stock' },
        { text: 'Batch_no', value: 'batch_no' },
        { text: 'Prod_date', value: 'production_date' },
        { text: 'exp_date', value: 'expiring_date' },
        { text: 'Base_qty', value: 'base_qty' },

        { text: 'Actions', value: 'actions', sortable: false },
      ],
      products: [],
      editedIndex: -1,
      editedItem: {
        product_name: '',
        manufacturer: '',
        category: '',
        subcategory: '',
        price: '',
        quantity_in_stock: '',
        batch_no: '',
        production_date: '',
        expiring_date: '',
        base_qty: '',
      },
      defaultItem: {
        product_name: '',
        manufacturer: '',
        category: '',
        subcategory: '',
        price: '',
        quantity_in_stock: '',
        batch_no: '',
        production_date: '',
        expiring_date: '',
        base_qty: '',
      },
    }
  },
  computed: {
    formTitle() {
      return this.$store.state.editedIndex === -1
        ? 'Add Product'
        : 'Update Product'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    categorySelection(newValue) {
      this.category = newValue
      this.categories.forEach((el) => {
        if (el.name == newValue) return (this.subCategories = el.subCategory)
      })
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const { data: Products, error } = await this.$supabase
        .from('Products')
        .select('*')
      //   this.$store.dispatch('setProducts', Products)
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Error retrieving products',
          color: 'error',
        })
      }
      this.products = Products
    },
    getColor(expiring_date) {
      let expDate = new Date(expiring_date)
      let currDate = Date.now()
      let difference = Math.ceil((expDate - currDate) / (1000 * 3600 * 24))

      if (difference <= 60) return 'red'
      else if (difference > 60 && difference <= 150) return 'orange'
      else return 'green'
    },

    editItem(item) {
      //call an action on the store to set the editted index and the editted item
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      //call an action on the store to set the editted index and the editted item
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //   this.$store.dispatch('setEditItemIndex', item)

      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      //Dispatch an action for item deletion

      const { data, error } = await this.$supabase
        .from('Products')
        .delete()
        .eq('id', `${this.editedItem.id}`)
      this.products.splice(this.editedIndex, 1)

      this.$store.dispatch('setSnackbar', {
        show: true,
        content: `Product deleted`,
        color: 'success',
      })
      if (error) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: 'Could not delete product',
          color: 'error',
        })
      }

      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        //dispatch an action that set to default
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save(e) {
      if (this.editedIndex > -1) {
        //For editting
        const { data, error } = await this.$supabase
          .from('Products')
          .update(this.editedItem)
          .eq('id', `${this.editedItem.id}`)
        this.$store.dispatch('setSnackbar', {
          show: true,
          content: `Product info updated`,
          color: 'success',
        })
        if (error) {
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: 'Could not update product info',
            color: 'error',
          })
        }

        Object.assign(this.products[this.editedIndex], this.editedItem)
      } else {
        if (this.$refs.proForm.validate()) {
          //new products

          const { data, error } = await this.$supabase
            .from('Products')
            .insert([this.editedItem])
          this.$store.dispatch('setSnackbar', {
            show: true,
            content: `New product added`,
            color: 'success',
          })
          if (error) {
            this.$store.dispatch('setSnackbar', {
              show: true,
              content: 'Could not add new product',
              color: 'error',
            })
          }

          //Dispatch an action for adding new product
          this.products.push(this.editedItem)
        }
      }
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped></style>
