export default function ({ store }, inject) {
  store.commit('LOAD_CART')

  inject('formatMoney', (money) => {
    return new Intl.NumberFormat('en-us', {
      currency: 'NGN',
      style: 'currency',
    }).format(money)
  })
}
