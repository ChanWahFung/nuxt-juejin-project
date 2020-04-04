<template>
  <div class="search-container">
    <div class="list__header">
      <ul class="list__types">
        <li class="list__type-item list-item" :class="{'list-item--active': item.type == type }" v-for="item in types" :key="item.title" @click="search({type: item.type})">{{ item.title }}</li>
      </ul>
      <ul class="list__periods">
        <li class="list__period-item list-item" :class="{'list-item--active': item.period == period }" v-for="item in periods" :key="item.title" @click="search({period: item.period})">{{ item.title }}</li>
      </ul>
    </div>
    <search-result :list="searchList"></search-result>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  head () {
    return {
      title: `${this.$route.query.keyword} - 搜索 - 掘金`
    }
  },
  watchQuery: ['keyword', 'type', 'period'],
  validate ({ query }) {
    let types = [undefined, 'all', 'article', 'tag', 'user']
    let periods = [undefined, 'all', 'd1', 'w1', 'm3']
    if (types.includes(query.type) && periods.includes(query.period)) {
      return true
    }
    return false
  },
  async asyncData({ app, query }) {
    let res = await app.$api.searchList({
      after: 0,
      first: 20,
      type: query.type ? query.type.toUpperCase() : 'ALL',
      keyword: query.keyword,
      period: query.period ? query.period.toUpperCase() : 'ALL'
    }).then(res => res.data || {})
    if (res.search) {
      return {
        pageInfo: res.search.pageInfo,
        searchList: res.search.edges
      }
    }
  },
  mixins: [reachBottom],
  data() {
    return {
      first: 20, // 一页数量
      pageInfo: {},
      searchList: [],
      types: [
        {
          title: '综合',
          type: 'all'
        },
        {
          title: '文章',
          type: 'article'
        },
        {
          title: '标签',
          type: 'tag'
        },
        {
          title: '用户',
          type: 'user'
        }
      ],
      periods: [
        {
          title: '全部',
          period: 'all'
        },
        {
          title: '一天内',
          period: 'd1'
        },
        {
          title: '一周内',
          period: 'w1'
        },
        {
          title: '三月内',
          period: 'm3'
        }
      ],
      isReachBottomFetching: false,  // 防止触底多次请求
    }
  },
  computed: {
    type() {
      return this.$route.query.type ? this.$route.query.type : 'all'
    },
    period() {
      return this.$route.query.period ? this.$route.query.period : 'all'
    },
    keyword() {
      return this.$route.query.keyword
    }
  },
  methods: {
    reachBottom(){
      if (this.pageInfo.hasNextPage) {
        this.getSearchList()
      }
    },  
    async getSearchList() {
      if (this.isReachBottomFetching) {
        return
      }
      this.isReachBottomFetching = true
      let res = await this.$api.searchList({
        after: this.pageInfo.endCursor,
        first: this.first,
        type: this.type.toUpperCase(),
        keyword: this.keyword,
        period: this.period.toUpperCase()
      }).then(res => res.data || {})
      if (res.search) {
        this.pageInfo = res.search.pageInfo
        this.searchList = this.searchList.concat(res.search.edges)
      }
      this.isReachBottomFetching = false
    },
    search(item) {
      this.$router.push({
        name: 'search',
        query: {
          type: item.type || this.type,
          keyword: this.keyword,
          period: item.period || this.period
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.search-container{
  background: #fff;
  box-shadow: 0 0 4px #eee;
  border-radius: 2px;

  .list__header{
    display: flex;
    align-items: center;
    padding: 15px 25px;
    border-bottom: 1px solid #eee;
  }

  .list__types{
    height: 28px;
    display: flex;
    align-items: center;
  }

  .list__periods{
    margin-left: auto;
    height: 28px;
    display: flex;
    align-items: center;
  }

  .list-item{
    display: inline-block;
    font-size: 14px;
    color: #909090;
    cursor: pointer;

    &:hover,
    &.list-item--active{
      color: $theme;
    }
  }

  .list__type-item{
    margin-right: 30px;
  }

  .list__period-item{
      font-size: 12px;

      &:not(:last-child){
        &::after{
          content: '·';
          color: #909090;
          margin: 0 5px;
        }
      }
    }
}
</style>