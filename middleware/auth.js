export default function ({ app, store, redirect }) {
  app.$api.isAuth().then(res => {
    if (res.s === 1) {
      if (res.d.isExpired) {
        app.$cookies.remove('userinfo')
        app.$cookies.remove('token')
        app.$cookies.remove('clientId')
        app.$cookies.remove('userId')
      } else {
        store.commit('auth/updateUserinfo', app.$cookies.get('userinfo'))
      }
    }
  })
}