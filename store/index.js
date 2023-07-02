// export const strict = false
export const state = () => ({
  products: [],
  cart: [],
  dialog: false,
  snackbar: {
    show: false,
    content: '',
    color: '',
  },
  editedItem: {},
  defaultItem: {},
  editedIndex: -1,
  driverLocation: [7.1379161, 3.3389562],
})

export const getters = {
  getProducts(state) {
    return state.products
  },
  getCategories(state) {
    let categories = state.products.reduce((acc, cur) => {
      //Check if an entry for the current category already exist in the accumulated objectt
      if (!acc[cur.category]) {
        //if it does not exist create a new element as the key on the accumulated object
        acc[cur.category] = []
      }
      //Push the current element into the array for the curret categories
      acc[cur.category].push(cur)

      return acc
    }, {})
    return categories
  },

  getCart(state) {
    return state.cart
  },

  getEditedItem(state) {
    return state.editedItem
  },

  get_cart_amount(state) {
    let total = 0
    state.cart.forEach((item) => {
      total += item.product.price * item.quantity
    })
    return total
  },
}

//ALL MUTATION FOR THE STORE
export const mutations = {
  SET_PRODUCTS(state, products) {
    return (state.products = products)
  },
  SET_SNACKBAR(state, payload) {
    return (state.snackbar = payload)
  },

  SET_USER_INFO(state, payload) {
    return (state.user = payload)
  },

  SET_EDIT_INDEX(state, payload) {
    state.editedIndex = state.products.indexOf(payload)
    state.editedItem = Object.assign({}, payload)
    console.log(payload)
  },

  SET_DEFAULT_ITEM(state, payload) {
    state.editedItem = Object.assign({}, payload)
    state.editedIndex = -1
  },

  DELETE_ITEM(state, payload) {
    return state.products.splice(payload, 1)
  },

  SET_DRIVER_LOCATION(state, payload) {
    return (state.driverLocation = payload)
  },

  //CART RELATED MUTATIONS
  SET_CART_DIALOG(state) {
    return (state.dialog = true)
  },

  LOAD_CART(state) {
    //Get existing cart in the localstorage
    let cart = localStorage.getItem('myCart')
    if (cart) {
      state.cart = JSON.parse(cart)
    }
  },

  ADD_TO_CART(state, product) {
    //Check if cart already exist
    let itemFound = state.cart.find((p) => {
      return p.product.id === product.id
    })

    //If not found add the product to cart
    if (!itemFound) {
      state.cart.push({ product, quantity: 1 })
    }
    //If found increase the quantity
    if (itemFound) {
      itemFound.quantity += 1
    }

    //Update the localstorage
    localStorage.setItem('myCart', JSON.stringify(state.cart))
    this.$swal({
      toast: true,
      text: 'Cart Updated.',
      icon: 'success',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
    })
  },

  DECREASE_ITEM_COUNT(state, index) {
    let item = state.cart[index]
    if (!item) return
    if (item.quantity === 1) {
      state.cart.splice(index, 1)
    } else {
      item.quantity -= 1
    }
    this.$swal({
      toast: true,
      text: 'Cart Updated.',
      icon: 'success',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
    })

    //Update the localstorage
    localStorage.setItem('myCart', JSON.stringify(state.cart))
  },

  REMOVE_CART_ITEM(state, index) {
    state.cart.splice(index, 1)
    this.$swal({
      toast: true,
      text: 'Cart Updated.',
      icon: 'success',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
    })

    //Update the localstorage
    localStorage.setItem('myCart', JSON.stringify(state.cart))
  },

  INCREASE_ITEM_COUNT(state, index) {
    let item = state.cart[index]
    item.quantity += 1

    //Update the localstorage
    localStorage.setItem('myCart', JSON.stringify(state.cart))
  },

  CLEAR_CART(state) {
    state.cart = []
    //Remove cart from localstorage
    localStorage.removeItem('myCart')
  },
}

export const actions = {
  setProducts({ commit }, products) {
    commit('SET_PRODUCTS', products)
  },

  setCartDialog({ commit }) {
    commit('SET_CART_DIALOG')
  },

  addToCart({ commit }, product) {
    commit('ADD_TO_CART', product)
  },

  setSnackbar({ commit }, payload) {
    commit('SET_SNACKBAR', payload)
  },

  setUserInfo({ commit }, payload) {
    commit('SET_USER_INFO', payload)
  },

  setEditItemIndex({ commit }, payload) {
    commit('SET_EDIT_INDEX', payload)
  },

  setDefaultItem({ commit }, payload) {
    commit('SET_DEFAULT_ITEM', payload)
  },

  deleteItem({ commit }, payload) {
    commit('DELETE_ITEM', payload)
  },

  saveEdits({ commit }, payload) {
    commit('SAVE_EDITS', payload)
  },

  setDriverLocation({ commit }, payload) {
    commit('SET_DRIVER_LOCATION', payload)
  },
}
