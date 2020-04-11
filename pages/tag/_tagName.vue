<template>
  <div>
    <div class="tag-info-box">
      <div class="tag-info">
        <div class="tag-title">{{ tagInfo.title }}</div>
        <div class="tag-meta">{{ tagInfo.subscribersCount }} 关注，{{ tagInfo.entryCount }} 文章</div>
      </div>
    </div>
    <main class="main">
      <div class="list-header">
        <img class="list-header__icon" :src="tagInfo.icon" />
        <follow-btn :is-follow="tagInfo.isSubscribe"></follow-btn>
        <div class="list-header__nav">
          <span v-for="item in sortList" :key="item.sort" :class="{'nav--active': sort === item.sort}" @click="changeSort(item.sort)">{{ item.title }}</span>
        </div>
      </div>
      <artic-list :list="articleList"></artic-list>
      <div class="nodata-tip">暂无文章</div>
    </main>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  head(){
    return {
      title: `${this.$route.params.tagName} - 标签 - 掘金`
    }
  },
  layout: 'full',
  validate ({ params }) {
    if (params.tagName) {
      return true
    }
    return false
  },
  async asyncData({ app, params }) {
    // 标签详情
    const tagInfo = await app.$api.getTagDetail({
      tagName: encodeURIComponent(params.tagName)
    }).then(res => res.s === 1 ? res.d : {})
    // 标签下的文章
    const articleList = await app.$api.getTagEntry({
      tagId: tagInfo.id,
      page: 1,
      pageSize: 20,
      sort: 'rankIndex'
    }).then(res => res.s === 1 ? res.d : {})
    return {
      tagInfo,
      articleList
    }
  },
  mixins: [reachBottom],
  data() {
    return {
      articleList: [],
      tagInfo: null,
      sortList: [
        {
          title: '热门',
          sort: 'rankIndex'
        },
        {
          title: '最新',
          sort: 'createdAt'
        },
        {
          title: '最热',
          sort: 'hotIndex'
        }
      ],
      sort: 'rankIndex',
      page: 1,
      pageSize: 20,
      isReachBottomFetching: false,  // 防止触底多次请求
    }
  },
  methods: {
    reachBottom() {
      this.page++
      this.getTagEntry({ isLoadMore: true })
    },
    changeSort(sort) {
      if (this.sort !== sort) {
        this.sort = sort
        this.getTagEntry()
      }
    },
    async getTagEntry({ isLoadMore = false } = {}) {
      if (this.isReachBottomFetching && isLoadMore) {
        return
      }
      this.isReachBottomFetching = true
      let list = await this.$api.getTagEntry({
        tagId: this.tagInfo.id,
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sort
      }).then(res => res.s === 1 ? res.d : [])
      this.articleList = isLoadMore ? this.articleList.concat(list) : list
      this.isReachBottomFetching = false
    }
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
    font-size: 14px;

    span{
      color: #999;
      cursor: pointer;

      &.nav--active{
        color: $theme;
      }

      &:not(:last-child){
        margin-right: 20px;
      }
    }
  }
}
.nodata-tip{
  padding: 20px 0;
  background: #fff;
  text-align: center;
  color: #999;
}
</style>