export default ({ app: { $request } }, inject) => {
  inject('api', {
    /**
     * 获取首页列表
     * @param {string} first - 单页数
     * @param {string} after - 下一页的标识
     * @param {string} order - POPULAR：热门、NEWEST：最新、THREE_DAYS_HOTTEST：3天内热榜、WEEKLY_HOTTEST：7天内热榜、MONTHLY_HOTTEST：30天内热榜、HOTTEST：全部热榜
     */
    getIndexList (params = {}) {
      return $request.get('/article/indexList', params)
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
      return $request.get('/article/detail', params)
    },
    /**
     * 获取文章评论
     * @param {string} entryId - 在文章详情内获取
     * @param {string} createdAt
     * @param {string} rankType - new
     * @param {number} pageSize - 评论条数
     */
    getCommentList (params = {}) {
      return $request.get('/comment/entry', params)
    },
    /**
     * 获取回复列表
     * @param {string} entryId - 在文章详情内获取
     * @param {string} commentId - 评论id
     * @param {number} pageNum - 页码
     * @param {number} pageSize - 页数
     */
    getReplyList (params = {}){
      return $request.get('/comment/reply', params)
    },
    /**
     * 获取用户信息（通用）
     * @param {string} ids - 需要获取的用户id（多个以|分割）
     */
    getMultiUser(params = {}){
      return $request.get('/user/multiUser', params)
    }
  })
}