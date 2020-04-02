export default ({ app: { $request } }, inject) => {
  inject('api', {
    /**
     * 获取首页列表
     * @param {string} first - 单页数 默认20
     * @param {string} after - 下一页的标识
     * @param {string} order - POPULAR：热门、NEWEST：最新、THREE_DAYS_HOTTEST：3天内热榜、WEEKLY_HOTTEST：7天内热榜、MONTHLY_HOTTEST：30天内热榜、HOTTEST：全部热榜
     */
    getIndexList (params = {}) {
      return $request.get('/article/indexList', params)
    },
    /**
     * 搜索
     * @param {string} type - ALL：综合、ARTICLE：文章、TAG：标签、USER：用户
     * @param {string} first - 单页数 默认20
     * @param {string} after - 下一页的标识
     * @param {string} keyword - 关键词
     * @param {string} period - ALL：全部、D1：一天内、W1：一周内、M3：三个月内
     */
    searchList (params = {}) {
      return $request.get('/search/entry', params)
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
    },
    /**
     * 获取用户消息
     * @param {string} before - 最后一条消息的 beforeAtString
     */
    getUserNotification(params = {}){
      return $request.get('/user/notification', params)
    },
    /**
     * 获取标签详情
     * @param {string} tagName
     */
    getTagDetail(params = {}){
      return $request.get('/tag/detail', params)
    },
    /**
     * 获取对应标签的文章列表
     * @param {string} tagId - 标签id
     * @param {number} page - 页码
     * @param {number} pageSize - 页数
     * @param {string} sort - rankIndex：热门；createdAt：最新；hotIndex：最热
     */
    getTagEntry(params = {}){
      return $request.get('/tag/entry', params)
    },
    /**
     * 检查是否关注用户
     * @param {staring} currentUid
     * @param {string} targetUids
     */
    isCurrentUserFollowed(params = {}){
      return $request.get('/user/isCurrentUserFollowed', params)
    },
    /**
     * 获取用户专栏文章
     * @param {string} targetUid 
     * @param {string} before - 最后一条的createdAt
     * @param {number} limit - 单次条数
     * @param {string} order - 排序 - rankIndex：热门、createdAt：最新
     */
    getUserPost(params = {}){
      return $request.get('/article/userPost', params)
    }
  })
}