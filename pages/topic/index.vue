<template>
  <div class="topics-container">
    <div v-if="topicsFollowedList && topicsFollowedList.length" class="topics-list">
      <div class="list__title">我关注的话题</div>
      <div class="list">
        <div class="topics-item" v-for="item in topicsFollowedList" :key="item.topic_id">
          <nuxt-link :to="'/topic/'+item.topic_id" :title="item.topic.description" target="_blank">
            <div class="item__icon" :style="`background-image: url(${item.topic.icon})`">
              <span class="itme__msgs-count">{{ item.topic.msg_count | formatCount }}</span>
            </div>
          </nuxt-link>
          <div class="item__info">
            <nuxt-link class="item__title" :to="'/topic/'+item.topic_id" :title="item.topic.description" target="_blank">{{ item.topic.title }}</nuxt-link>
            <span class="item__meta">{{ item.topic.follower_count }} 关注 · {{ item.topic.msg_count }} 沸点</span>
            <span class="item__followbtn" :class="{'item__followbtn--active': item.user_interact.is_follow}" @click="followTopics(item)">{{ item.user_interact.is_follow ? '已关注' : '+ 关注' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="topicsList && topicsList.length" class="topics-list">
      <div class="list__title">全部话题</div>
      <div class="list">
        <div class="topics-item" v-for="item in topicsList" :key="item.topic_id">
          <nuxt-link :to="'/topic/'+item.topic_id" :title="item.topic.description" target="_blank">
            <div class="item__icon" :style="`background-image: url(${item.topic.icon})`"></div>
          </nuxt-link>
          <div class="item__info">
            <nuxt-link class="item__title" :to="'/topic/'+item.topic_id" :title="item.topic.description" target="_blank">{{ item.topic.title }}</nuxt-link>
            <span class="item__meta">{{ item.topic.follower_count }} 关注 · {{ item.topic.msg_count }} 沸点</span>
            <span class="item__followbtn" :class="{'item__followbtn--active': item.user_interact.is_follow}" @click="followTopics(item)">{{ item.user_interact.is_follow ? '已关注' : '+ 关注' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '话题 - 掘金'
    }
  },
  layout: 'default-white',
  async asyncData({ app }) {
    let [topicsList, topicsFollowedList] = await Promise.all([
      // 全部话题
      app.$api.getTopics({
        limit: 100,
      }).then(res => res.err_no === 0 ? res.data : []),
      // 我关注的话题
      app.$api.getFollowedTopics({
        limit: 100,
      }).then(res => res.err_no === 0 ? res.data : [])
    ])
    return {
      topicsList,
      topicsFollowedList
    }
  },
  data() {
    return {
      topicsFollowedList: [],
      topicsList: []
    }
  },
  filters: {
    formatCount(count) {
      count = count / 1000
      return count >= 1 ? count.toFixed(1) + 'k' : count
    }
  },
  methods: {
    async followTopics(item) {
      if (!this.$store.state.auth.token) {
        this.$loginModal(this)
        return
      }
      let res = await this.$api.followTopic({
        method: item.followed ? 'delete' : 'put',
        topicIds: item.objectId
      })
      if (res.s === 1) {
        item.followed = !item.followed
        !item.followed ? item.attendersCount++ : item.attendersCount--
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.topics-container{
  margin-top: 40px;
}
.topics-list{
  margin: 50px 0;

  .list__title{
    padding: 0 14px;
    text-align: left;
    font-size: 24px;
    color: #0e0e0e;
    font-weight: 600;
    margin: 24px 0;
  }

  .list{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    &:not(:last-child){
      margin-bottom: 20px;
    }
  }
}
.topics-item{
  display: flex;
  padding: 18px 14px;

  .item__icon{
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 12px;
    background-size: cover;
    background-repeat: no-repeat;

    .itme__msgs-count{
      position: absolute;
      top: -12px;
      right: -12px;
      margin: 0;
      padding: 5px 7px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      text-align: center;
      color: #f1f1f1;
      background-color: $theme;
      border-radius: 36px;
      border: 2px solid #fff;
      word-break: normal;
    }
  }

  .item__info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 5%;
    line-height: 1;

    .item__title{
      font-weight: 600;
      color: #2e3135;
      font-size: 17px;

      &:hover{
        color: $theme;
      }
    }

    .item__meta{
      padding-top: 8px;
      font-size: 13px;
      color: #8a9aa9;
    }

    .item__followbtn{
      padding-top: 8px;
      font-size: 13px;
      color: #37c701;
      cursor: pointer;

      &.item__followbtn--active{
        color: #8a9aa9;
      }
    }
  }
}
</style>