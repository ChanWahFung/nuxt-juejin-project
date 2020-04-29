<template>
  <div class="topic-detail-container">
    <div class="topic-main">
      <div class="nav-list shadow">
        <div class="nav-item">热门</div>
        <div class="nav-item">最新</div>
      </div>
      <div class="pin-item-wrap shadow" v-for="item in pinList" :key="item.objectId">
        <pin-item :item="item"></pin-item>
      </div>
    </div>
    <div class="topic-aside">
      <div class="topic-detail-block shadow">
        <div class="topic-wallpaper">
          <div class="wallpaper" :style="`background-image: url(${topicDetail.icon})`"></div>
        </div>
        <div class="topic-info">
          <div class="topic-icon" :style="`background-image: url(${topicDetail.icon})`"></div>
          <div class="topic-title">{{ topicDetail.title }}</div>
          <follow-btn :is-follow="topicDetail.followed"></follow-btn>
        </div>
        <div class="topic-desc">
          <p class="desc-title">话题介绍:</p>
          <p class="desc-content">{{ topicDetail.description }}</p>
        </div>
        <div class="topic-meta">
          <div class="meta-item">
            <span class="meta-item__count">{{ topicDetail.msgsCount }}</span>
            <span>沸点</span>
          </div>
          <div class="meta-item">
            <span class="meta-item__count">{{ topicDetail.followersCount }}</span>
            <span>关注</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  head() {
    return {
      title: `${this.topicDetail.title} - 话题 - 沸点`
    }
  },
  async asyncData({ app, params }) {
    let [topicDetail, pinList] = await Promise.all([
      app.$api.getTopicDetail({
        topicId: params.id
      }).then(res => res.s === 1 ? res.d : {}),
      app.$api.getTopicPinList({
        topicId: params.id,
        page: 1,
        pageSize: 20
      }).then(res => res.s === 1 ? res.d.list : []),
    ])
    return {
      topicDetail,
      pinList
    }
  },
  mixins: [reachBottom],
  data() {
    return {
      topicDetail: {},
      pinList: [],
      page: 1,
    }
  },
  methods: {
    reachBottom() {
      this.page++
      this.getTopicPinList({ isLoadMore: true })
    },
    async getTopicPinList({ isLoadMore = false } = {}) {
      let res = await this.$api.getTopicPinList({
        topicId: this.$route.params.id,
        page: this.page,
        pageSize: 20,
        sortType: 'rank'
      })
      if (res.s === 1) {
        this.pinList = isLoadMore ? this.pinList.concat(res.d.list) : res.d.list
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.topic-detail-container{
  display: flex;

  .topic-main{
    flex: 1 1 auto;

    .nav-list{
      display: flex;
      justify-content: space-around;
      padding: 10px 80px;
      margin-bottom: 10px;
      border-radius: 2px;
      background: #fff;

      .nav-item{
        font-size: 15px;
        color: #909090;
      }
    }

    .pin-item-wrap{
      margin-bottom: 10px;
    }
  }

  .topic-aside{
    flex: 0 0 300px;
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
      background-position: 50% 0;
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
</style>