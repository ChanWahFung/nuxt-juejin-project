export const state = () => ({
  timelineCategoryList: [], // 首页分类列表
})

export const mutations = {
  update_timelineCategoryList(state, payload){
    state.timelineCategoryList = payload
  }
}