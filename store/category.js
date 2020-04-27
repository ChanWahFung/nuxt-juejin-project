export const state = () => ({
  timelineCategoryList: [],  // 首页分类列表
  recommendCategoryList: [], // 作者榜单分类列表
  bookCategoryList: [],      // 小册分类列表
  pinCategoryList: [         // 沸点分类列表
    {
      id: 'recommended',
      name: '推荐',
      path: '/pin/recommended'
    },
    {
      id: 'hot',
      name: '热门',
      path: '/pin/hot'
    },
    {
      id: 'following',
      name: '关注',
      path: '/pin/following'
    },
    {
      id: '5c09ea2b092dcb42c740fe73',
      name: '开源推荐',
      path: '/pin/topic/5c09ea2b092dcb42c740fe73'
    },
    {
      id: '5abb61e1092dcb4620ca3322',
      name: '内推招聘',
      path: '/pin/topic/5abb61e1092dcb4620ca3322'
    },
    {
      id: '5abcaa67092dcb4620ca335c',
      name: '掘金相亲',
      path: '/pin/topic/5abcaa67092dcb4620ca335c'
    },
    {
      id: '5c106be9092dcb2cc5de7257',
      name: '上班摸鱼',
      path: '/pin/topic/5c106be9092dcb2cc5de7257'
    },
    {
      id: '5b514af1092dcb61bd72800d',
      name: '应用安利',
      path: '/pin/topic/5b514af1092dcb61bd72800d'
    },
    {
      id: '5abb67d2092dcb4620ca3324',
      name: '开发工具',
      path: '/pin/topic/5abb67d2092dcb4620ca3324'
    },
    {
      id: '5c46a17f092dcb4737217152',
      name: 'New资讯',
      path: '/pin/topic/5c46a17f092dcb4737217152'
    },
  ]
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