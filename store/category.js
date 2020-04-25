export const state = () => ({
  timelineCategoryList: [],  // 首页分类列表
  recommendCategoryList: [], // 作者榜单分类列表
  bookCategoryList: [],     // 小册分类列表
})

export const mutations = {
  updateTimelineCategoryList(state, payload){
    state.timelineCategoryList = payload
  },
  updateRecommendCategoryList(state, payload){
    state.recommendCategoryList = payload
  },
  updateBookCategoryList(state, payload){
    state.bookCategoryList = payload
  }
}