<template>
  <div>
    <recommend-category :channels="categoryList"></recommend-category>
    <div class="authors-main shadow">
      <div class="user-wrap" v-for="item in authors" :key="item.node.id">
        <user-item2 :item="item.node"></user-item2>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
import recommendCategory from '~/components/business/recommendCategory'

export default {
  async asyncData({ app, params, store }) {
    let categoryList = []
    // 分类
    if (store.state.category.recommendCategoryList.length) {
      categoryList = store.state.category.recommendCategoryList
    } else {
      categoryList = await app.$api.getAuthorChannel().then(res => res.s === 1 ? res.d : [])
      store.commit('category/updateRecommendCategoryList', categoryList)
    }
    // 作者榜单
    let res = await app.$api.getAuthorRank({
      channel: params.name,
      after: '',
      first: 20
    }).then(res => res.s === 1 ? res.d : {})
    return {
      categoryList,
      authors: res.edges,
      pageInfo: res.pageInfo
    }
  },
  validate({ params }) {
    return params.name
  },
  mixins: [reachBottom],
  components: {
    'recommend-category': recommendCategory
  },
  data() {
    return {
      categoryList: [],
      authors: [],
      pageInfo: {}
    }
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.hasNextPage) {
        this.getAuthorRank({ isLoadMore: true })
      }
    },
    async getAuthorRank({ isLoadMore = false } = {}) {
      let res = await this.$api.getAuthorRank({
        channel: this.$route.params.name,
        after: this.pageInfo.endCursor,
        first: 20
      })
      if (res.s === 1) {
        this.authors = isLoadMore ? this.authors.concat(res.d.edges) : res.d.edges
        this.pageInfo = res.d.pageInfo
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.authors-main{
  width: 700px;
  background: #fff;
  border-radius: 2px;
}
.user-wrap{
  
  &:not(:last-child){
    border-bottom: 1px solid #eee;
  }
}
</style>