export default ({ app: { $request } }, inject) => {
  inject('api', {
    /**
     * 获取首页列表
     * @param {string} first - 单页数 默认20
     * @param {string} after - 下一页的标识
     * @param {string} order - POPULAR：热门、NEWEST：最新、THREE_DAYS_HOTTEST：3天内热榜、WEEKLY_HOTTEST：7天内热榜、MONTHLY_HOTTEST：30天内热榜、HOTTEST：全部热榜
     */
    getIndexList (data = {}) {
      return $request.post('/v1/article/indexList', data)
    },
    /**
     * 搜索
     * @param {string} type - ALL：综合、ARTICLE：文章、TAG：标签、USER：用户
     * @param {string} first -条数
     * @param {string} after - 下一页的标识
     * @param {string} keyword - 关键词
     * @param {string} period - ALL：全部、D1：一天内、W1：一周内、M3：三个月内
     */
    searchList (params = {}) {
      return $request.get('/v1/search/entry', params)
    },
    /**
     * 获取详情页信息
     * @param {string} type - entry：用户等信息，entryView：文章信息
     * @param {string} postId - 文章id 
     */
    getDetail (params = {}) {
      return $request.get('/v1/article/detail', params)
    },
    /**
     * 获取文章评论
     * @param {string} entryId - 在文章详情内获取
     * @param {string} createdAt - 最后一条的createdAt，下一页时传入
     * @param {string} rankType - new
     * @param {number} pageSize - 条数
     */
    getCommentList (params = {}) {
      return $request.get('/v1/comment/entry', params)
    },
    /**
     * 获取回复列表
     * @param {string} entryId - 在文章详情内获取
     * @param {string} commentId - 评论id
     * @param {number} pageNum - 页码
     * @param {number} pageSize - 页数
     */
    getReplyList (params = {}){
      return $request.get('/v1/comment/reply', params)
    },
    /**
     * 获取用户信息
     * @param {string} ids - 需要获取的用户id（多个以|分割）
     */
    getMultiUser(params = {}){
      return $request.get('/v1/user/multiUser', params)
    },
    /**
     * 获取用户消息
     * @param {string} before - 最后一条消息的 beforeAtString
     */
    getUserNotification(params = {}){
      return $request.get('/v1/user/notification', params)
    },
    /**
     * 获取标签详情
     * @param {string} tagName
     */
    getTagDetail(params = {}){
      return $request.get('/v1/tag/detail', params)
    },
    /**
     * 获取对应标签的文章列表
     * @param {string} tagId - 标签id
     * @param {number} page - 页码
     * @param {number} pageSize - 页数
     * @param {string} sort - rankIndex：热门；createdAt：最新；hotIndex：最热
     */
    getTagEntry(params = {}){
      return $request.get('/v1/tag/entry', params)
    },
    /**
     * 检查是否关注用户
     * @param {staring} currentUid
     * @param {string} targetUids
     */
    isCurrentUserFollowed(params = {}){
      return $request.get('/v1/user/isCurrentUserFollowed', params)
    },
    /**
     * 是否点赞文章
     * @param {string} entryId - 文章entryId
     */
    isArticleLike(params = {}){
      return $request.get('/v1/user/isArticleLike', params)
    },
    /**
     * 获取用户专栏文章
     * @param {string} targetUid 
     * @param {string} before - 最后一条的createdAt
     * @param {number} limit - 单次条数
     * @param {string} order - 排序 - rankIndex：热门、createdAt：最新
     */
    getUserPost(params = {}){
      return $request.get('/v1/article/userPost', params)
    },
    /**
     * 获取推荐作者
     * @param {number} limit - 条数
     */
    getRecommendAuthor(params = {}){
      return $request.get('/v1/recommend/recommendAuthor', params)
    },
    /**
     * 获取相关文章
     * @param {number} limit - 条数
     * @param {string} entryId - 文章objectId
     */
    getRelatedEntry(params = {}){
      return $request.get('/v1/article/relatedEntry', params)
    },
    /**
     * 根据标签id获取相关推荐文章
     * @param {string} tagIds - 多个id以|分隔
     * @param {number} before - 最后一条的rankIndex，下一页时传入
     */
    getRecommendEntryByTagIds(params = {}){
      return $request.get('/v1/article/recommendEntryByTagIds', params)
    },
    /**
     * 点赞文章
     * @param {string} entryId - 文章objectId
     */
    articleLike(data = {}){
      let method = data.isCollected ? 'put' : 'delete'
      return $request[method]('/v1/user/like', { entryId: data.entryId })
    },
    /**
     * 获取未读消息数量
     */
    getUserNotificationNum(){
      return $request.get('/v1/user/userNotificationNum')
    },
    /**
     * 获取未读消息数量
     */
    setUserNotificationNum(){
      return $request.put('/v1/user/userNotificationNum')
    },
    /**
     * 关注、取消关注
     * @param {string} follower - 关注者id
     * @param {string} followee - 被关注者id
     */
    followUser(data = {}){
      return $request[data.method]('/v1/user/follow', { 
        follower: data.follower, 
        followee: data.followee
      })
    },
    /**
     * 获取类目
     */
    getCategories(){
      return $request.get('/v1/category/entry')
    },
    /**
     * 获取类目下的标签
     * @param {string} categoryId 
     * @param {number} limit 
     */
    getTagByCategories(params = {}){
      return $request.post('/v1/category/tags', params)
    },
    /**
     * 获取已关注的标签
     */
    getTagBySubscribed(){
      return $request.get('/v1/tag/subscribed')
    },
    /**
     * 获取全部标签
     * @param {string} type - 类型： 最新、最热
     * @param {number} page - 页码
     * @param {number} pageSize - 页数
     */
    getTagByAll(params = {}){
      return $request.get('/v1/tag/all', params)
    },
    /**
     * 搜索标签
     * @param {string} type - 类型： 最新、最热
     * @param {string} keyword - 搜索词
     * @param {number} page - 页码
     * @param {number} pageSize - 页数
     */
    getTagBySearch(params = {}){
      return $request.get('/v1/tag/search', params)
    },
    /**
     * 关注标签
     * @param {string} tagId 
     */
    followTag(data = {}){
      return $request[data.method]('/v1/tag/subscribe', { 
        tagId: data.tagId
      })
    },
    /**
     * 获取话题列表
     * @param {string} sortType - 排序
     * @param {number} page - 页码
     * @param {number} pageSize - 条数
     */
    getTopics(params = {}) {
      return $request.get('/v1/topic/list', params)
    },
    /**
     * 获取已关注话题列表
     * @param {string} after
     * @param {number} page - 页码
     * @param {number} pageSize - 条数
     */
    getFollowedTopics(params = {}) {
      return $request.get('/v1/topic/followedList', params)
    },
    /**
     * 关注话题
     * @param {string} topicId 
     */
    followTopic(data = {}){
      return $request[data.method]('/v1/topic/follow', { 
        topicIds: data.topicIds
      })
    },
  })
}