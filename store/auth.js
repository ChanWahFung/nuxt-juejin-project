export const state = () => ({
  cookieMaxExpires: new Date(Date.now() + 8.64e7 * 365 * 10), // cookies 过期时间
  userInfo: null, // 登录用户信息
  userId: '',
  clientId: '',
  token: ''
})

export const mutations = {
  updateUserInfo(state, payload){
    state.userInfo = payload
  },
  updateUserId(state, payload){
    state.userid = payload
  },
  updateClientId(state, payload){
    state.clientId = payload
  },
  updateToken(state, payload){
    state.token = payload
  }
}