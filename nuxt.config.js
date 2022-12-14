import colors from 'vuetify/es5/util/colors'
require('dotenv').config()
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Smart Supply Chain',
    title: 'Smart Supply Chain App.',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'The main page of the application',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~plugins/client.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/snipcart',
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    [
      'nuxt-mail',
      {
        message: [
          { name: 'contact', to: process.env.CONTACT_MAIL },
          // { name: 'support', to: 'support@foo.de' },
        ],
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
      },
    ],
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  snipcart: {
    // Options available
    key:
      'NTMzNzZkNzctM2E1ZS00MGQxLTgyYWYtZjlmMzEyMmRkODdjNjM4MDU3ODQ1ODgzMDIxMzU4',
    locals: {
      en: {
        cart_summary: {
          total: "We're Total en",
        },
      },
    },
  },

  attributes: [
    ['data-config-modal-style', 'side'],
    // ['data-config-add-product-behavior', 'none']
  ],
  env: {
    supabaseUrl: process.env.SUPABASE_URL,
    apiKey: process.env.API_KEY,
    serviceRole: process.env.SERVICE_ROLE,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    contactMail: process.env.CONTACT_MAIL,
  },
}
