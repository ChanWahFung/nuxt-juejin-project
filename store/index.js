export const state = () => ({
  isTopbarBlock: true, // 顶部栏是否显示
})

export const mutations = {
  updateTopbarBlock(state, payload){
    state.isTopbarBlock = payload
  }
}