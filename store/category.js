export const state = () => ({
  tagsList: {}
})

export const mutations = {
  updateTagsList(state, payload){
    state.tagsList[payload.key] = payload.data
  }
}