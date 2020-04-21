<template>
  <div class="topics-container">
    <div v-if="topicsFollowedList.length" class="topics-list">
      <div class="list__title">我关注的话题</div>
      <div class="list">
        <div class="topics-item" v-for="item in topicsFollowedList" :key="item.objectId">
          <nuxt-link :to="'/topics/'+item.objectId" :title="item.description" target="_blank" rel="noopener noreferrer">
            <div class="item__icon count" :data-count="item.msgsCount" :style="`background-image: url(${item.icon})`"></div>
          </nuxt-link>
          <div class="item__info">
            <nuxt-link class="item__title" :to="'/topics/'+item.objectId" :title="item.description" target="_blank" rel="noopener noreferrer">{{ item.title }}</nuxt-link>
            <span class="item__meta">{{ item.attendersCount }} 关注 · {{ item.msgsCount }} 沸点</span>
            <span class="item__followbtn" :class="{'item__followbtn--active': item.followed}" @click="followTopics(item)">{{ item.followed ? '已关注' : '+ 关注' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="topicsList.length" class="topics-list">
      <div class="list__title">全部话题</div>
      <div class="list">
        <div class="topics-item" v-for="item in topicsList" :key="item.objectId">
          <nuxt-link :to="'/topics/'+item.objectId" :title="item.description" target="_blank" rel="noopener noreferrer">
            <div class="item__icon count" :data-count="item.msgsCount" :style="`background-image: url(${item.icon})`"></div>
          </nuxt-link>
          <div class="item__info">
            <nuxt-link class="item__title" :to="'/topics/'+item.objectId" :title="item.description" target="_blank" rel="noopener noreferrer">{{ item.title }}</nuxt-link>
            <span class="item__meta">{{ item.attendersCount }} 关注 · {{ item.msgsCount }} 沸点</span>
            <span class="item__followbtn" :class="{'item__followbtn--active': item.followed}" @click="followTopics(item)">{{ item.followed ? '已关注' : '+ 关注' }}</span>
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
    let topicsList = await app.$api.getTopicsList({
      sortType: 'hot',
      page: 1,
      pageSize: 100
    }).then(res => res.s === 1 ? res.d.list : [])
    let topicsFollowedList = await app.$api.getTopicsFollowedList({
      after: 0,
      page: 1,
      pageSize: 100
    }).then(res => res.s === 1 ? res.d.list : [])
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
  methods: {
    async followTopics(item) {
      let res = await this.$api.followTopics({
        method: item.followed ? 'delete' : 'put',
        topicId: item.objectId
      })
      if (res.s === 1) {
        item.followed = !item.followed
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