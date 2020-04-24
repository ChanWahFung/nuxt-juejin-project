export const state = () => ({
  timelineCategoryList: [],  // 首页分类列表
  recommendCategoryList: [], // 作者榜单分类列表
  bookCategoryList: [],     // 小册分类列表
  topicCategoryList: [      // 沸点分类列表
    {
      id: '5c09ea2b092dcb42c740fe73',
      name: '开源推荐'
    },
    {
      id: '5abb61e1092dcb4620ca3322',
      name: '内推招聘'
    },
    {
      id: '5abcaa67092dcb4620ca335c',
      name: '掘金相亲'
    },
    {
      id: '5c106be9092dcb2cc5de7257',
      name: '上班摸鱼'
    },
    {
      id: '5b514af1092dcb61bd72800d',
      name: '应用安利'
    },
    {
      id: '5abb67d2092dcb4620ca3324',
      name: '开发工具'
    },
    {
      id: '5c46a17f092dcb4737217152',
      name: 'New资讯'
    },
  ],
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