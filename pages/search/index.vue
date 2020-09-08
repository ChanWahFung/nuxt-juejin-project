<template>
  <div class="search-container">
    <div class="list__header">
      <ul class="list__types">
        <li class="list__type-item list-item" :class="{'list-item--active': item.idType == idType }" v-for="item in types" :key="item.title" @click="search({idType: item.idType})">{{ item.title }}</li>
      </ul>
      <ul class="list__periods">
        <li class="list__period-item list-item" :class="{'list-item--active': item.searchType == searchType }" v-for="item in searchTypes" :key="item.title" @click="search({searchType: item.searchType})">{{ item.title }}</li>
      </ul>
    </div>
    <search-result :list="searchList"></search-result>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app, query }) {
    let res = await app.$api.searchList({
      limit: 20,
      id_type: query.idType || 0,
      key_word: query.keyword,
      search_type: query.searchType || 0
    })
    let pageInfo = {}
    let searchList = []
    if (res.err_no === 0) {
      searchList = res.data
      pageInfo = {
        hasMore: res.has_more,
        cursor: res.cursor
      }
    }
    return {
      pageInfo,
      searchList,
    }
  },
  head () {
    return {
      title: `${this.$route.query.keyword} - 搜索 - 掘金`
    }
  },
  validate ({ query }) {
    let types = [0, 2, 9, 1]
    let searchTypes = [0, 1, 2, 3]
    if (query.idType !== undefined && !types.includes(Number(query.idType))) {
      return false
    }
    if (query.searchTypes !== undefined && !searchTypes.includes(Number(query.searchType))) {
      return false
    }
    return true
  },
  watchQuery: ['keyword', 'idType', 'searchType'],
  mixins: [reachBottom],
  data() {
    return {
      pageInfo: {},
      searchList: [],
      types: [
        {
          title: '综合',
          idType: 0
        },
        {
          title: '文章',
          idType: 2
        },
        {
          title: '标签',
          idType: 9
        },
        {
          title: '用户',
          idType: 1
        }
      ],
      searchTypes: [
        {
          title: '全部',
          searchType: 0
        },
        {
          title: '一天内',
          searchType: 1
        },
        {
          title: '一周内',
          searchType: 2
        },
        {
          title: '三月内',
          searchType: 3
        }
      ],
      isReachBottomFetching: false,  // 防止触底多次请求
    }
  },
  computed: {
    idType() {
      return this.$route.query.idType || 0
    },
    searchType() {
      return this.$route.query.searchType || 0
    },
    keyword() {
      return this.$route.query.keyword
    }
  },
  methods: {
    reachBottom(){
      if (this.pageInfo.hasMore) {
        this.getSearchList()
      }
    }, 
    async getSearchList() {
      if (this.isReachBottomFetching) {
        return
      }
      this.isReachBottomFetching = true
      let res = await this.$api.searchList({
        cursor: this.pageInfo.cursor,
        limit: 20,
        id_type: this.idType,
        key_word: this.keyword,
        search_type: this.searchType
      })
      if (res.err_no == 0) {
        this.searchList = this.searchList.concat(res.data || [])
        this.pageInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
      }
      this.isReachBottomFetching = false
    },
    search(item) {
      this.$router.push({
        name: 'search',
        query: {
          idType: item.idType === undefined ? this.idType : item.idType,
          keyword: this.keyword,
          searchType: item.searchType  === undefined ? this.searchType : item.searchType
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