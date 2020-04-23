export const state = () => ({
  timelineCategoryList: [], // 首页分类列表
})

export const mutations = {
  updateTimelineCategoryList(state, payload){
    state.timelineCategoryList = payload
  }
}