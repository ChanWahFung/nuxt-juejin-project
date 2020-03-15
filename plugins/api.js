export default ({ app: { $request } }, inject) => {
  inject('api', {
    /**
     * 获取首页列表
     * @param {string} first - 单页数
     * @param {string} after - 下一页的标识
     * @param {string} order - POPULAR：热门、NEWEST：最新、THREE_DAYS_HOTTEST：3天内热榜、WEEKLY_HOTTEST：7天内热榜、MONTHLY_HOTTEST：30天内热榜、HOTTEST：全部热榜
     */
    getIndexList (params = {}) {
      return $request.get('/list/indexList', params)
    },
    getLabelList (params = {}) {
      return $request.get('/label/labelList', params)
    },
    /**
     * 获取详情页信息
     * @param {string} type - entry：用户等信息，entryView：文章信息
     * @param {string} postId - 文章id 
     */
    getDetail (params = {}) {
      return $request.get('/detail', params)
    },
    /**
     * 获取文章评论
     * @param {*} params 
     */
    getCommentList (params = {}) {
      return $request.get('/comment/list', params)
    }
  })
}