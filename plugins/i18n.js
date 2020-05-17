import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: app.$cookies.get('lang') || 'zh',
    fallbackLocale: 'zh',
    messages: {
      en: require('~/locales/en.json'),
      zh: require('~/locales/zh.json')
    }
  })
}