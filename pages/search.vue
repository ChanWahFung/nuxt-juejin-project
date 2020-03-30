<template>
  <div class="container">
    <search-result :list="searchList"></search-result>
  </div>
</template>

<script>
export default {
  async asyncData({ app, query }) {
    let res = await app.$api.searchList({
      type: 'ALL',
      keyword: query.keyword,
      period: 'ALL'
    }).then(res => res.data || {})
    if (res.search) {
      return {
        pageInfo: res.search.pageInfo,
        searchList: res.search.edges
      }
    }
  },
  data() {
    return {
      pageInfo: {},
      searchList: []
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
  }
}
</script>

<style lang='scss' scoped>
.container{
  background: #fff;
  box-shadow: 0 0 4px #eee;
  border-radius: 2px;
}
</style>