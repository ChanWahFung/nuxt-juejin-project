import { removeAuthInfo } from '~/utils/index'

export default function (context) {
  const { app, store } = context
  const cookiesToken = app.$cookies.get('token')
  if (cookiesToken) {
    // 每次跳转路由 验证登录状态是否过期
    app.$api.isAuth().then(res => {
      if (res.s === 1) {
        if (res.d.isExpired) {   // 过期 移除登陆验证信息
          removeAuthInfo(context)
        } else {                 // 未过期 重新设置存储
          const stateToken = store.state.auth.token
          if (cookiesToken && stateToken === '') {
            store.commit('auth/updateUserInfo', app.$cookies.get('userInfo'))
            store.commit('auth/updateUserId', app.$cookies.get('userId'))
            store.commit('auth/updateClientId', app.$cookies.get('clientId'))
            store.commit('auth/updateToken', app.$cookies.get('token'))
          }
        }
      }
    })
  }
}