<template>
  <div class="container">
    <div class="list-header">
      <ul class="list-types">
        <li class="list-type-item list-item" :class="{'list-item__active': item.type == type }" v-for="item in types" :key="item.title" @click="changeType(item)">{{ item.title }}</li>
      </ul>
      <ul class="list-periods">
        <li class="list-period-item list-item" :class="{'list-item__active': item.period == period }" v-for="item in periods" :key="item.title" @click="changePeriod(item)">{{ item.title }}</li>
      </ul>
    </div>
    <search-result :list="searchList"></search-result>
  </div>
</template>

<script>
export default {
  async asyncData({ app, query }) {
    let res = await app.$api.searchList({
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
  beforeRouteUpdate (to, from, next) {
    next()
    this.getSearchList()
  },
  data() {
    return {
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
      ]
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
  created() {
  },
  head () {
    return {
      title: `${this.$route.query.keyword} - 搜索 - 掘金`
    }
  },
  methods: {
    async getSearchList() {
      let res = await this.$api.searchList({
        type: this.type.toUpperCase(),
        keyword: this.keyword,
        period: this.period.toUpperCase()
      }).then(res => res.data || {})
      if (res.search) {
        this.pageInfo = res.search.pageInfo
        this.searchList = res.search.edges
      }
    },
    changeType(item) {
      this.$router.push({
        name: 'search',
        query: {
          type: item.type,
          keyword: this.keyword,
          period: this.period
        }
      })
    },
    changePeriod(item) {
      this.$router.push({
        name: 'search',
        query: {
          type: this.type,
          keyword: this.keyword,
          period: item.period
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.container{
  background: #fff;
  box-shadow: 0 0 4px #eee;
  border-radius: 2px;

  .list-header{
    display: flex;
    align-items: center;
    padding: 15px 25px;
    border-bottom: 1px solid #eee;
  }

  .list-types{
    height: 28px;
    display: flex;
    align-items: center;
  }

  .list-periods{
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
    &.list-item__active{
      color: $theme;
    }
  }

  .list-type-item{
    margin-right: 30px;
  }

  .list-period-item{
      font-size: 12px;

      &:not(:last-child){
        &::after{
          content: '·';
          margin: 0 5px;
        }
      }
    }
}
</style>