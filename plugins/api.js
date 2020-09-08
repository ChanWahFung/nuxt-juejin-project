export default ({ app: { $request } }, inject) => {
  inject('api', {
    /**
     * 登录验证
     * @param {string} password - 密码
     * @param {string} phoneNumber - 手机号码
     */
    loginAuth(data) {
      return $request.post('/v2/auth/login', data)
    },
    /**
     * 身份验证
     */
    isAuth() {
      return $request.get('/v2/auth/authentication')
    },
    /**
     * 获取首页列表
     * @param {string} cate_id - 分类id
     * @param {string} cursor - 分页标识，加载下一页传入
     * @param {string} limit - 条数
     * @param {string} sort_type - 0：全部、3：三天内、7：7天内、30：30天内、200：热门、300：最新
     * @param {string} feed_type - all：推荐，cate：分类
     */
    getIndexList (data = {}) {
      return $request.post('/v2/articles/indexList', data)
    },
    /**
     * 搜索
     * @param {number} id_type - 0：综合、2：文章、9：标签、1：用户
     * @param {number} limit - 条数
     * @param {string} cursor - 分页标识
     * @param {string} key_word - 关键词
     * @param {number} search_type - 0：全部、1：一天内、2：一周内、3：三个月内
     */
    searchList (params = {}) {
      return $request.get('/v2/articles/search', params)
    },
    /**
     * 获取详情页信息
     * @param {string} article_id - 文章id 
     */
    getDetail (params = {}) {
      return $request.get('/v2/articles/detail', params)
    },
    /**
     * 评论列表
     * @param {string} cursor - 分页标识
     * @param {number} item_type - 2: 文章 4：沸点
     * @param {string} item_id - 文章id
     * @param {number} limit - 条数
     */
    getCommentList (params = {}) {
      return $request.get('/v2/comments/entry', params)
    },
    /**
     * 回复列表
     * @param {string} cursor - 分页标识
     * @param {number} item_type - 2: 文章 4：沸点
     * @param {string} item_id - 文章id
     * @param {string} comment_id - 评论id
     * @param {number} limit - 条数
     */
    getReplyList (params = {}){
      return $request.get('/v2/comments/reply', params)
    },
    /**
     * 获取用户信息
     * @param {string} user_id - 用户id
     * @param {string} not_self
     */
    getMultiUser(params = {}){
      return $request.get('/v2/users/multiUser', params)
    },
    /**
     * 获取用户消息
     * @param {string} before - 最后一条消息的 beforeAtString
     */
    getUserNotification(params = {}){
      return $request.get('/v2/users/notification', params)
    },
    /**
     * 获取标签详情
     * @param {string} key_word
     */
    getTagDetail(params = {}){
      return $request.get('/v2/tags/detail', params)
    },
    /**
     * 获取对应标签的文章列表
     * @param {string} cursor - 分页标识
     * @param {number} sort_type - 排序: 0-最热、200-热门，300-最新
     * @param {array} tag_ids - 标签
     */
    getTagEntry(data = {}){
      return $request.post('/v2/tags/entry', data)
    },
    /**
     * 是否关注用户
     * @param {string} ids - 用户id
     */
    isCurrentUserFollowed(params = {}){
      return $request.get('/v2/users/isCurrentUserFollowed', params)
    },
    /**
     * 获取用户专栏文章
     * @param {string} user_id - 用户id
     * @param {string} cursor - 分页
     * @param {number} sort_type - 1：热门、2：最新
     */
    getUserPost(params = {}){
      return $request.get('/v2/articles/userPost', params)
    },
    /**
     * 获取推荐作者
     * @param {number} limit - 条数
     * @param {number} cursor - 分页标识
     * @param {string} category_id - 类目
     */
    getRecommendAuthor(params = {}){
      return $request.get('/v2/recommends/recommendAuthor', params)
    },
    /**
     * 获取相关文章
     * @param {string} item_id - 文章id
     * @param {string} user_id - 用户id
     * @param {array} tag_ids - 标签id
     */
    getRelatedEntry(data = {}){
      return $request.post('/v2/articles/relatedEntry', data)
    },
  /**
   * 根据标签id获取相关推荐文章
   * @param {string} item_id - 文章id
   * @param {string} cursor - 分页标识
   * @param {number} sort_type - 排序
   * @param {array} tag_ids - 标签id
   */
    getRecommendEntryByTagIds(data = {}){
      return $request.post('/v2/articles/recommendEntryByTagIds', data)
    },
    /**
     * 点赞文章
     * @param {string} entryId - 文章objectId
     */
    articleLike(data = {}){
      let method = data.isCollected ? 'put' : 'delete'
      return $request[method]('/v2/users/like', { entryId: data.entryId })
    },
    /**
     * 获取未读消息数量
     */
    getUserNotificationNum(){
      return $request.get('/v2/users/userNotificationNum')
    },
    /**
     * 获取未读消息数量
     */
    setUserNotificationNum(){
      return $request.put('/v2/users/userNotificationNum')
    },
    /**
     * 关注、取消关注
     * @param {string} follower - 关注者id
     * @param {string} followee - 被关注者id
     */
    followUser(data = {}){
      return $request[data.method]('/v2/users/follow', { 
        follower: data.follower, 
        followee: data.followee
      })
    },
    /**
     * 获取类目
     * @param {number} show_type 0：首页 1：作者排行榜 2：小册
     */
    getCategories(params = {}){
      return $request.get('/v2/categories/entry', params)
    },
    /**
     * 获取类目下的标签
     * @param {string} cate_id - 类目id
     */
    getTagByCategories(params = {}){
      return $request.post('/v2/categories/tags', params)
    },
    /**
     * 获取已关注的标签
     */
    getTagBySubscribed(){
      return $request.get('/v2/tags/subscribed')
    },
    /**
     * 获取全部标签
     * @param {string} type - 类型： 最新、最热
     * @param {number} page - 页码
     * @param {number} pageSize - 页数
     */
    getTagByAll(params = {}){
      return $request.get('/v2/tags/all', params)
    },
    /**
     * 搜索标签
     * @param {string} type - 类型： 最新、最热
     * @param {string} keyword - 搜索词
     * @param {number} page - 页码
     * @param {number} pageSize - 页数
     */
    getTagBySearch(params = {}){
      return $request.get('/v2/tags/search', params)
    },
    /**
     * 关注标签
     * @param {string} tagId 
     */
    followTag(data = {}){
      return $request[data.method]('/v2/tags/subscribe', { 
        tagId: data.tagId
      })
    },
    /**
     * 获取话题列表
     * @param {string} cursor - 分页标识
     * @param {number} limit - 条数
     * @param {string} sort_type - 排序
     */
    getTopics(params = {}) {
      return $request.get('/v2/topics/list', params)
    },
    /**
     * 获取推荐话题列表
     * @param {string} cursor - 分页标识
     * @param {number} limit - 条数
     * @param {string} sort_type - 排序
     */
    getRecommendTopics(params = {}) {
      return $request.get('/v2/topics/recommendList', params)
    },
    /**
     * 获取已关注话题列表
     * @param {string} cursor - 分页标识
     * @param {number} limit - 条数
     * @param {string} sort_type - 排序
     */
    getFollowedTopics(params = {}) {
      return $request.get('/v2/topics/followedList', params)
    },
    /**
     * 关注话题
     * @param {string} topicId 
     */
    followTopic(data = {}){
      return $request[data.method]('/v2/topics/follow', { 
        topicIds: data.topicIds
      })
    },
    /**
     * 小册列表
     * @param {string} category_id - 类目id
     * @param {number} limit - 条数
     * @param {string} cursor - 分页条数
     */
    getBooks(params = {}) {
      return $request.get('/v2/books/getBookList', params)
    },
    /**
     * 推荐小册
     */
    getRecommendBook() {
      return $request.get('/v2/recommends/books')
    },
    /**
     * 沸点（推荐、热门、关注）
     * @param {string} type
     * @param {number} limit - 条数
     * @param {string} sort_type - 排序
     * @param {string} cursor - 分页标识
     */
    getPinList(params = {}) {
      return $request.get('/v2/pins/list', params)
    },
    /**
     * 单条沸点
     * @param {string} msg_id
     */
    getPinDetail(params = {}) {
      return $request.get('/v2/pins/pinDetail', params)
    },
    /**
     * 话题详情
     * @param {string} topicId - 话题id
     */
    getTopicDetail(params = {}) {
      return $request.get('/v2/topics/detail', params)
    },
    /**
     * 沸点列表（根据话题获取）
     * @param {string} topic_id - 话题id
     * @param {number} limit - 条数
     * @param {string} cursor - 分页标识
     * @param {number} sort_type - 排序（200: 热门、500: 最新）
     */
    getTopicPinList(params = {}) {
      return $request.get('/v2/topics/pinList', params)
    },
    /**
     * 话题参与者列表
     * @param {string} item_id - 话题id
     * @param {number} limit - 条数
     * @param {string} cursor - 分页标识
     */
    getTopicAttenderList(params = {}) {
      return $request.get('/v2/topics/attenders', params)
    },
    /**
     * 沸点点赞、取消点赞
     */
    likePin(data = {}) {
      return $request[data.method]('/v2/pins/like', { 
        pinId: data.pinId
      })
    },
  })
}