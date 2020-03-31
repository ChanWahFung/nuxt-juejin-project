
module.exports = {
  mode: 'universal',
  server: {
    port: 8000,
    host: '127.0.0.1'
  },
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'detail',
        path: '/detail/:id',
        component: resolve(__dirname, 'pages/detail.vue'),
        props: true
      })
    }
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '掘金',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'referrer', content: 'never'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/default.min.css' },
    ],
    script: [
      { src: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/highlight.min.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { 
    color: '#007fff'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/scss/reset.scss',
    '~/assets/scss/global.scss',
    '~/assets/highlight/atom-one-light.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/request.js',
    '~/plugins/api.js',
    '~/plugins/vue-global.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: [
      '~/assets/scss/variable.scss'
    ]
  },
  serverMiddleware: [	
    { path: '/', handler: '~/middleware/page-cache.js' },	
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
