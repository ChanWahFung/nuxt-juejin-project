export const state = () => ({
  isTopbarBlock: true,
  layoutBgColor: '#f4f4f4'
})

export const mutations = {
  updateTopbarBlock(state, payload){
    state.isTopbarBlock = payload
  }
}