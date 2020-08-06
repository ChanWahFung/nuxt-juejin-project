<template>
  <div class="topic-detail-container">
    <div class="topic-main">
      <div class="nav-list shadow">
        <nuxt-link :to="`/topic/${$route.params.id}?sortType=200`" class="nav-item" :class="{'nav-item--active': sortType == 200}">热门</nuxt-link>
        <nuxt-link :to="`/topic/${$route.params.id}?sortType=500`" class="nav-item" :class="{'nav-item--active': sortType == 500}">最新</nuxt-link>
      </div>
      <div class="pin-item-wrap shadow" v-for="(item, index) in pinList" :key="item.msg_id">
        <pin-item :item.sync="pinList[index]"></pin-item>
      </div>
    </div>
    <div class="topic-aside">
      <div class="topic-detail-block shadow">
        <div class="topic-wallpaper">
          <div class="wallpaper" :style="`background-image: url(${topicDetail.topic.icon})`"></div>
        </div>
        <div class="topic-info">
          <div class="topic-icon" :style="`background-image: url(${topicDetail.topic.icon})`"></div>
          <div class="topic-title">{{ topicDetail.topic.title }}</div>
          <follow-btn :is-follow.sync="topicDetail.user_interact.is_follow"></follow-btn>
        </div>
        <div class="topic-desc">
          <p class="desc-title">话题介绍:</p>
          <p class="desc-content">{{ topicDetail.topic.description }}</p>
        </div>
        <div class="topic-meta">
          <div class="meta-item">
            <span class="meta-item__count">{{ topicDetail.topic.msg_count }}</span>
            <span>沸点</span>
          </div>
          <div class="meta-item">
            <span class="meta-item__count">{{ topicDetail.topic.follower_count }}</span>
            <span>关注</span>
          </div>
        </div>
      </div>
      <div class="topic-attender shadow">
        <div class="topic-attender__header">
          <span class="header-count">共有{{ topicDetail.topic.attender_count }}人参加</span>
          <span class="header-allbtn" @click="isShowUserList = true">全部</span>
        </div>
        <div class="topic-attender__list">
          <div class="attender-item" v-for="item in attenderList.slice(0,16)" :key="item.user_id">
            <div class="attender-avatar">
              <user-avatar :url="item.avatar_large" :round="true"></user-avatar>
            </div>
            <span class="attender-name ellipsis">{{ item.user_name }}</span>
          </div>
        </div>
      </div>
    </div>
    <user-list-modal :list="attenderList" :visible.sync="isShowUserList" title="参与话题的人" @reach-bottom="modalReachBottom"></user-list-modal>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app, params, query }) {
    let pinListInfo = {}
    let attenderListInfo = {}
    let [topicDetail, pinList, attenderList] = await Promise.all([
      // 话题详情
      app.$api.getTopicDetail({
        topic_id: params.id
      }).then(res => res.err_no === 0 ? res.data : {}),
      // 沸点列表
      app.$api.getTopicPinList({
        topic_id: params.id,
        limit: 20,
        sort_type: query.sortType || 500
      }).then(res => {
        if (res.err_no == 0) {
          pinListInfo = {
            cursor: res.cursor,
            hasMore: res.has_more
          }
        }
        return res.data || []
      }),
      // 话题参与者
      app.$api.getTopicAttenderList({
        item_id: params.id,
        limit: 20
      }).then(res => {
        if (res.err_no == 0) {
          attenderListInfo = {
            cursor: res.cursor,
            hasMore: res.has_more
          }
        }
        return res.data || []
      }),
    ])
    return {
      topicDetail,
      pinList,
      pinListInfo,
      attenderList,
      attenderListInfo
    }
  },
  head() {
    return {
      title: `${this.topicDetail.topic.title} - 话题 - 沸点`
    }
  },
  validate ({ params }) {
    if (params.id && params.id != 'undefined') {
      return true
    }
    return false
  },
  watchQuery: ['sortType'],
  mixins: [reachBottom],
  data() {
    return {
      topicDetail: {},
      pinList: [],
      pinListInfo: {},
      attenderList: [],
      attenderListInfo: {},
      isShowUserList: false
    }
  },
  computed: {
    sortType() {
      return this.$route.query.sortType || 500
    }
  },
  methods: {
    reachBottom() {
      if (this.pinListInfo.hasMore) {
        this.getTopicPinList({ isLoadMore: true })
      }
    },
    modalReachBottom() {
      if (this.attenderListInfo.hasMore) {
        this.getTopicAttenderList({ isLoadMore: true })
      }
    },
    // 沸点列表
    async getTopicPinList({ isLoadMore = false } = {}) {
      let res = await this.$api.getTopicPinList({
        topic_id: this.$route.params.id,
        limit: 20,
        sort_type: this.sortType,
        cursor: this.pinListInfo.cursor || '0'
      })
      if (res.err_no === 0) {
        this.pinList = isLoadMore ? this.pinList.concat(res.data) : res.data
        this.pinListInfo = {
          cursor: res.cursor,
          hasMore: res.has_more
        }
      }
    },
    // 参与者列表
    async getTopicAttenderList({ isLoadMore = false } = {}) {
      let res = await this.$api.getTopicAttenderList({
        item_id: this.$route.params.id,
        limit: 20,
        cursor: this.attenderListInfo.cursor
      })
      if (res.err_no === 0) {
        this.attenderList = isLoadMore ? this.attenderList.concat(res.data) : res.data
        this.attenderListInfo = {
          cursor: res.cursor,
          hasMore: res.has_more
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.topic-detail-container{
  display: flex;

  .topic-main{
    flex: 1;
    overflow: hidden;

    .nav-list{
      display: flex;
      justify-content: space-around;
      padding: 0 80px;
      margin-bottom: 10px;
      border-radius: 2px;
      background: #fff;

      .nav-item{
        padding: 15px;
        font-size: 15px;
        color: #909090;
        cursor: pointer;
      }

      .nav-item--active{
        position: relative;
        color: $theme;

        &::after{
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          width: 60%;
          height: 3px;
          background: $theme;
          transform: translateX(-50%);
        }
      }
    }

    .pin-item-wrap{
      margin-bottom: 10px;
    }
  }

  .topic-aside{
    flex: 0 0 300px;
    width: 300px;
    margin-left: 20px;
  }
}
.topic-detail-block{
  background: #fff;

  .topic-wallpaper{
    width: 100%;
    height: 110px;
    overflow: hidden;

    .wallpaper{
      width: 100%;
      height: 100%;
      background-size: 120%;
      background-repeat: no-repeat;
      background-position: center;
      filter: blur(6.3px);
      transform: scale(1.1);
    }
  }

  .topic-info{
    z-index: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .topic-icon{
      width: 60px;
      height: 60px;
      margin-top: -32px;
      border: 2px solid hsla(0,0%,100%,.6);
      border-radius: 5px;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .topic-title{
      margin: 10px 0;
      font-size: 15px;
      font-weight: 600;
    }
  }

  .topic-desc{
    padding: 12px;
    font-size: 14px;

    .desc-title{
      font-weight: 600;
    }

    .desc-content{
      line-height: 1.5;
    }
  }

  .topic-meta{
    display: flex;
    padding: 12px 0;
    border-top: 1px solid rgba(92,96,102,.1);

    .meta-item{
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: #8a9aa9;

      &:first-child{
        border-right: 1px solid rgba(92,96,102,.1);
      }

      .meta-item__count{
        margin-bottom: 6px;
        font-size: 19px;
        font-weight: 600;
        color: #2e3135;
      }
    }
  }
}
.topic-attender{
  margin-top: 10px;
  border-radius: 2px;
  background: #fff;

  .topic-attender__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;

    .header-count{
      font-weight: 600;
      font-size: 14px;
    }

    .header-allbtn{
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $theme;
      cursor: pointer;
      
      &:after{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-left: 2px;
        border: 1px solid currentColor;
        border-left-color: transparent;
        border-bottom-color: transparent;
        transform: rotate(45deg);
      }
    }
  }

  .topic-attender__list{
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;

    .attender-item{
      flex: 0 0 25%;
      width: 25%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: rgb(51, 51, 51);
      overflow: hidden;

      .attender-avatar{
        width: 46px;
        height: 46px;
        margin-bottom: 5px;
      }

      .attender-name{
        max-width: 100%;
        line-height: 1.3;
      }
    }
  }
}
</style>