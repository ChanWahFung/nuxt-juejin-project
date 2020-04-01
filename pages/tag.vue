<template>
  <div>
    <div class="tag-info-box">
      <div class="tag-info">
        <div class="tag-title">{{ tagInfo.title }}</div>
        <div class="tag-meta">{{ tagInfo.subscribersCount }} 关注，{{tagInfo.entryCount }} 文章</div>
      </div>
    </div>
    <main class="main">
      <div class="list-header">
        <img class="list-header__icon" :src="tagInfo.icon" />
        <follow-btn :is-follow="tagInfo.isSubscribe"></follow-btn>
        <div class="list-header__nav">
          <span>热门</span>
          <span>最新</span>
          <span>最热</span>
        </div>
      </div>
      <artic-list :list="articleList"></artic-list>
    </main>
  </div>
</template>

<script>
export default {
  layout: 'full',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  validate ({ params }) {
    if (params.id) {
      return true
    }
    return false
  },
  async asyncData({ app, params }) {
    const tagInfo = await app.$api.getTagDetail()
      .then(res => res.s === 1 ? res.d : {})
    const articleList = await app.$api.getTagEntry({
      page: 1,
      pageSize: 20,
      tagId: params.id,
      sort: 'rankIndex'
    }).then(res => res.s === 1 ? res.d.entrylist : {})
    return {
      tagInfo,
      articleList
    }
  },
  data() {
    return {
      articleList: [],
      tagInfo: null
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.tag-info-box{
  position: relative;
  height: 150px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tag-info{
  color: #666;
  text-align: center;

  .tag-title{
    font-size: 25px;
    line-height: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .tag-meta{
    font-size: 14px;
  }
}
.list-header{
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .list-header__icon{
    width: auto;
    height: 24px;
    margin-right: 20px;
  }

  .list-header__nav{
    margin-left: auto;

    span{
      color: #999;

      &:not(:last-child){
        margin-right: 20px;
      }
    }
  }
}
</style>