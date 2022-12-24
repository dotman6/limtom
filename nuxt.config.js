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
  css: ['@sweetalert2/theme-material-ui', '~/assets/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~plugins/client.js' }, { src: '~plugins/cart.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    API_KEY: process.env.API_KEY,
    SERVICE_ROLE: process.env.SERVICE_ROLE,
    SMTP_HOST: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    CONTACT_MAIL: process.env.CONTACT_MAIL,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    DOMAIN: process.env.DOMAIN,
    MAILGUN_URL: process.env.MAILGUN_URL,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    'nuxt-leaflet',
    'vue-sweetalert2/nuxt/no-css',
    'nuxt-webfontloader',
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
  webfontloader: {
    google: {
      families: ['DM+Sans:wght@400;500;700&display=swap'],
    },
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: {
        family: 'DM Sans',
        size: 15,
      },
    },
    treeShake: true,
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.deepPurple.darken1,
          bg: '#ffffff',
          surface: '#ffffff',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        dark: {
          primary: colors.deepPurple.darken1,
          bg: '#0a0514',
          surface: '#130a24',
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
}
