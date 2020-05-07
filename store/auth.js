export const state = () => ({
  cookieMaxExpires: new Date(Date.now() + 8.64e7 * 365 * 10), // cookies 过期时间
  userinfo: null, // 登录用户信息
})

export const mutations = {
  updateUserinfo(state, payload){
    state.userinfo = payload
  }
}