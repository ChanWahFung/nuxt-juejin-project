export const state = () => ({
  cookieMaxExpires: new Date(Date.now() + 8.64e7 * 365 * 10), // cookies 过期时间
  userInfo: null, // 登录用户信息
  userId: '',
  clientId: '',
  token: ''
})

export const mutations = {
  UPDATE_USERINFO(state, payload){
    state.userInfo = payload
  },
  UPDATE_USERID(state, payload){
    state.userId = payload
  },
  UPDATE_CLIENTID(state, payload){
    state.clientId = payload
  },
  UPDATE_TOKEN(state, payload){
    state.token = payload
  }
}