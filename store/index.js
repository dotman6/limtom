import data from '~/assets/data'

export const state = () => ({
  products: [],
  cart: [],
  dialog: false,
})

export const getters = {
  getSubCategories(state) {
    const subCategory = {}
    for (let i = 0; i < state.products.length; i++) {
      subCategory[state.products[i].subcategory] = true
    }
    let allCategories = Object.keys(subCategory)
    return allCategories
  },

  getCart(state) {
    return state.cart
  },
}

export const mutations = {
  SET_PRODUCTS(state, products) {
    return (state.products = products)
  },

  SET_CART_DIALOG(state) {
    return (state.dialog = true)
  },

  ADD_TO_CART(state, { product, quantity }) {
    return state.cart.push({ product, quantity })
  },
}

export const actions = {
  setProducts({ commit }, products) {
    commit('SET_PRODUCTS', products)
  },

  setCartDialog({ commit }) {
    commit('SET_CART_DIALOG')
  },

  addToCart({ commit }, { product, quantity }) {
    commit('ADD_TO_CART', { product, quantity })
  },
}
