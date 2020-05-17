export const state = () => ({
  locales: ['zh', 'en'],
  locale: 'zh'
})

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  }
}
