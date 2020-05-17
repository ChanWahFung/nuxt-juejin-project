export default function ({ isHMR, app, store, error }) {
  const defaultLocale = app.i18n.fallbackLocale
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) { return }
  // 获取locale
  const locale = app.$cookies.get('lang') || defaultLocale
  if (!store.state.locale.locales.includes(locale)) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  // 设置语言
  store.commit('locale/SET_LANG', locale)
  app.i18n.locale = locale
}
