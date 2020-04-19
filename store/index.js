export const state = () => ({
  isTopbarBlock: true
})

export const mutations = {
  updateTopbarBlock(state, payload){
    state.isTopbarBlock = payload
  }
}