<template>
  <div class="user-view">
    <div class="major-area">
      <div class="user-block shadow">
        <div class="user-block__avatar">
          <img v-if="userInfo.avatar_large" :src="userInfo.avatar_large">
          <img v-else src="~/assets/images/default-avatar.svg">
        </div>
        <div class="user-block__info">
          <div class="info__username">
            <h1>
              {{ userInfo.user_name }}
              <level :level="userInfo.level"></level>
            </h1>
          </div>
          <div class="info__position">
            <img src="~/assets/images/position.svg">
            <span>{{ userInfo.job_title }}{{ userInfo.job_title && userInfo.company ? ' | ' : '' }}{{ userInfo.company }}</span>
          </div>
          <div class="info__intro">
            <img src="~/assets/images/intro.svg">
            <span>{{ userInfo.description }}</span>
          </div>
        </div>
        <div class="user-block__action" v-if="$store.state.auth.userId != userInfo.uid">
          <follow-btn :is-follow.sync="isFollowed" type="user" :followee-id="userInfo.uid"></follow-btn>
        </div>
      </div>
      <div class="user-post">
        <div class="list-header">
          <span class="list-header__title">专栏 {{ postListInfo.count }}</span>
          <div>
            <span class="order-item" :class="{'order-item--active': item.order == currentOrder}" v-for="item in orderOptions" :key="item.order" @click="changeOrder(item.order)">{{ item.title }}</span>
          </div>
        </div>
        <post-item v-for="(item, index) in postList" :key="item.article_id" :item.sync="postList[index]"></post-item>
      </div>
    </div>
    <div class="minor-area">
      <div class="honor-block shadow">
        <div class="honor-block__title">个人成就</div>
        <div class="honor-block__list">
          <template>
            <div class="honor-item" v-if="userInfo.builder">
              <img class="honor-item__icon shadow" src="~/assets/images/honor-1.svg" />
              <span class="honor-item__title">掘金共建者</span>
            </div>
            <div class="honor-item" v-if="userInfo.book_author">
              <img class="honor-item__icon shadow" src="~/assets/images/honor-2.svg" />
              <span class="honor-item__title">掘金小册写作权限</span>
            </div>
            <div class="honor-item" v-if="userInfo.favorable_author">
              <img class="honor-item__icon shadow" src="~/assets/images/honor-3.svg" />
              <span class="honor-item__title">掘金优秀作者</span>
            </div>
          </template>
          <div class="honor-item">
            <img class="honor-item__icon shadow" src="~/assets/images/honor-4.svg" />
            <span class="honor-item__title">获得点赞 {{ userInfo.got_digg_count }}</span>
          </div>
          <div class="honor-item">
            <img class="honor-item__icon shadow" src="~/assets/images/honor-5.svg" />
            <span class="honor-item__title">文章被阅读 {{ userInfo.got_view_count }}</span>
          </div>
          <div class="honor-item">
            <img class="honor-item__icon shadow" src="~/assets/images/honor-6.svg" />
            <span class="honor-item__title">掘力值 {{ userInfo.power }}</span>
          </div>
        </div>
      </div>
      <div class="follow-block shadow">
        <div class="follow-item">
          关注了<span class="follow-count">{{ userInfo.followee_count }}</span>
        </div>
        <div class="follow-item">
          关注者<span class="follow-count">{{ userInfo.follower_count }}</span>
        </div>
      </div>
      <div class="more-block">
        <div class="more-item">
          收藏集<span>{{ userInfo.create_collect_set_count }}</span>
        </div>
        <div class="more-item">
          关注标签<span>{{ userInfo.subscribe_tag_count }}</span>
        </div>
        <div class="more-item">
          加入于<span>{{ $utils.formatDate('Y-MM-DD', userInfo.register_time * 1000) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postItem from '~/components/business/user/postItem'
import reachBottom from '~/mixins/reachBottom'
import commonRequest from '~/mixins/commonRequest'

export default {
  async asyncData({ app, params }) {
    let [userInfo, postListRes] = await Promise.all([
      // 用户信息
      app.$api.getMultiUser({
        user_id: params.id,
        not_self: 1
      }).then(res => res.err_no === 0 ? res.data : {}),
      // 专栏
      app.$api.getUserPost({
        user_id: params.id,
        sort_type: 2
      })
    ])
    // 专栏列表、专栏分页信息
    let postList = []
    let postListInfo = {}
    if (postListRes.err_no == 0) {
      postList = postListRes.data
      postListInfo = {
        count: postListRes.count,
        hasMore: postListRes.has_more,
        cursor: postListRes.cursor
      }
    }
    return {
      userInfo,
      postListInfo,
      postList
    }
  },
  head() {
    return {
      title: `${this.userInfo.user_name} 的个人主页 - 掘金`
    }
  },
  validate ({ params }) {
    if (params.id && params.id != 'undefined') {
      return true
    }
    return false
  },
  components: {
    'post-item': postItem
  },
  mixins: [reachBottom, commonRequest],
  data() {
    return {
      postList: [],
      userInfo: {},
      postListInfo: {},
      orderOptions: [
        {
          title: '热门',
          order: 1
        },
        {
          title: '最新',
          order: 2
        }
      ],
      currentOrder: 2,
      isFollowed: false
    }
  },
  mounted() {
    this.isCurrentUserFollowed(this.userInfo.user_id).then(res => (this.isFollowed = res))
  },
  methods: {
    reachBottom() {
      if (this.postListInfo.hasMore) {
        this.getUserPost({ isLoadMore: true })
      }
    },
    changeOrder(order) {
      if (this.currentOrder !== order) {
        this.currentOrder = order
        this.getUserPost()
      }
    },
    async getUserPost({ isLoadMore = false } = {}) {
      let params = {
        user_id: this.$route.params.id,
        sort_type: this.currentOrder,
      }
      if (isLoadMore) {
        params.cursor = this.postListInfo.cursor
      }
      let res = await this.$api.getUserPost(params)
      if (res.err_no === 0){
        this.postList = isLoadMore ? this.postList.concat(res.data) : res.data
        this.postListInfo.hasMore = res.has_more 
        this.postListInfo.cursoe = res.cursor 
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.user-view{
  display: flex;
  margin-bottom: 80px;

  .major-area{
    flex: 1 1 auto;
  }

  .minor-area{
    flex: 0 0 auto;
    width: 240px;
    margin-left: 12px;
  }
}
.user-post{
  margin-top: 12px;
  background: #fff;

  .list-header{
    display: flex;
    justify-content: space-between;
    padding: 20px 30px;

    .list-header__title{
      font-weight: bold;
      font-size: 15px;
      color: #000;
    }

    .order-item{
      font-size: 14px;
      color: #777;
      cursor: pointer;

      &:hover{
        opacity: .95;
      }

      &:first-child::after{
        content: '|';
        display: inline-block;
        margin: 0 10px;
        color: #999;
      }
    }

    .order-item--active{
      color: #333;
    }
  }
}
.user-block{
  display: flex;
  padding: 30px;
  background: #fff;
  border-radius: 2px;

  .user-block__avatar{
    margin-right: 30px;

    >img{
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;

      &:hover{
        transform: rotate(666turn);
        transition-delay: 1s;
        transition-property: all;
        transition-duration: 59s;
        transition-timing-function: cubic-bezier(.34,0,.84,1);
      }
    }
  }

  .user-block__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    font-size: 14px;
    line-height: 1.5;
    color: #72777b;

    .info__username{
      padding-bottom: 5px;
      font-size: 26px;
      font-weight: bold;
      color: #262626;
    }

    .info__position,
    .info__intro{
      display: flex;
      align-items: center;
      margin-top: 5px;

      >img{
        margin-right: 5px;
      }
    }
  }

  .user-block__action{
    margin-left: auto;
  }
}
.honor-block{
  background: #fff;

  .honor-block__title{
    padding: 15px 10px;
    font-weight: bold;
    color: #31445b;
    border-bottom: 1px solid #eee;
  }  

  .honor-block__list{
    padding: 15px 10px;
    color: #000;

    .honor-item{
      display: flex;
      align-items: center;
      
      &:not(:last-child){
        margin-bottom: 10px;
      }
    }

    .honor-item__icon{
      width: 25px;
      height: 25px;
      margin-right: 15px;
      border-radius: 50%;
    }

    .honor-item__title{
      font-size: 15px;
    }
  }
}
.follow-block{
  display: flex;
  margin-top: 12px;
  background: #fff;

  .follow-item{
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    color: #31445b;

    .follow-count{
      margin-top: 5px;
      font-weight: bold;
    }
  }
}
.more-block{
  margin-top: 10px;
  color: #262626;

  .more-item{
    padding: 15px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(230,230,231,.5);

    &:last-child{
      border-bottom: 1px solid rgba(230,230,231,.5);
    }
  }
}
</style>