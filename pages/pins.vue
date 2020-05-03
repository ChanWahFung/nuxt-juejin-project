<template>
  <div class="pin-container">
    <div class="pin-nav">
      <pin-category v-model="currentCategory"></pin-category>
    </div>
    <nuxt-child class="pin-main" />
    <div class="pin-aside">
      <recommend-pin :list="recommendPins"></recommend-pin>
      <div v-if="followTopicList.length" class="followed-topics shadow">
        <div class="followed-topics__header">
          <div class="title">关注的话题</div>
          <nuxt-link to="/topic" class="all-btn" target="_blank">全部</nuxt-link>
        </div>
        <nuxt-link :to="'/topic/'+item.objectId" class="topic-item" v-for="item in followTopicList" :key="item.objectId" target="_blank">
          <div class="topic-icon" :style="`background-image: url(${item.icon})`"></div>
          <div class="topic-info">
            <span class="topic-title">{{ item.title }}</span>
            <span class="topic-mate">{{ item.followersCount }} 关注 · {{ item.msgsCount }} 沸点</span>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import pinCategory from '~/components/business/pinCategory'
import recommendPin from '~/components/business/recommendPin'

export default {
  async asyncData({ app }) {
    let [recommendPins, followTopicList] = await Promise.all([
      app.$api.getPinListByRecommend().then(res => res.s === 1 ? res.d.list.slice(0, 3) : []),
      app.$api.getFollowedTopics({ page: 1, pageSize: 3 }).then(res => res.s === 1 ? res.d.list : [])
    ])
    return {
      recommendPins,
      followTopicList
    }
  },
  head() {
    return {
      title: '沸点 - 掘金'
    }
  },
  components: {
    'pin-category': pinCategory,
    'recommend-pin': recommendPin
  },
  data() {
    return {
      currentCategory: {},
      recommendPins: [],
      followTopicList: []
    }
  },
}
</script>

<style lang='scss' scoped>
.pin-container{
  display: flex;

  .pin-nav{
    flex: 0 0 112px;
    width: 112px;
  }

  .pin-main{
    flex: 1;
    margin: 0 15px;
    border-radius: 2px;
    overflow: hidden;
  }

  .pin-aside{
    flex: 0 0 248px;
    width: 248px;
  }

  .followed-topics{
    background: #fff;
    border-radius: 2px;
    margin-top: 10px;

    .followed-topics__header{
      display: flex;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #eee;

      .title{
        font-weight: 600;
        font-size: 15px;
        color: #333;
      }

      .all-btn{
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 13px;
        color: $theme;

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
  }

  .topic-item{
    display: flex;
    align-items: center;
    padding: 15px;

    .topic-icon{
      width: 42px;
      height: 42px;
      border-radius: 6px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }

    .topic-info{
      display: flex;
      flex-direction: column;
      margin-left: 12px;

      .topic-title{
        margin-bottom: 5px;
        color: #333;
        font-size: 15px;
      }

      .topic-mate{
        color: rgb(138, 154, 169);
        font-size: 13px;
      }
    }
  }
}
</style>