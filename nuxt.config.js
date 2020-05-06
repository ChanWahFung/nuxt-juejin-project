
module.exports = {
  mode: 'universal',
  /*
  ** Server configuration
  */
  server: {
    port: 8000,
    host: '127.0.0.1'
  },
  /*
  ** Environment variable configuration
  */
  env: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'http://test.com' : 'http://127.0.0.1:8000'
  },
  /*
  ** Router configuration
  */
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/',
        redirect: {
          name: 'timeline-title'
        }
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
      { rel: 'stylesheet', href: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/atom-one-light.min.css' },
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
    '~/assets/scss/global.scss'
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
    babel: {
      plugins: [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ],
    },
    extend (config, ctx) {
    }
  }
}
