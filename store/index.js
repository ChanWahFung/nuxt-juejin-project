import authConfig from '~/assets/authConfig'

export const state = () => ({
  isTopbarBlock: true,
  ...authConfig
})

export const mutations = {
  updateTopbarBlock(state, payload){
    state.isTopbarBlock = payload
  }
}