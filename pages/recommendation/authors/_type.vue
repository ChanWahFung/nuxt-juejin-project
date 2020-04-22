<template>
  <div>
    <div class="authors-main shadow">
      <div class="user-wrap" v-for="item in authors" :key="item.node.id">
        <user-item2 :item="item.node"></user-item2>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
export default {
  async asyncData({ app }) {
    let res = await app.$api.getAuthorRank({
      channel: 'recommend',
      after: '',
      first: 20
    }).then(res => res.s === 1 ? res.d : {})
    return {
      authors: res.edges,
      pageInfo: res.pageInfo
    }
  },
  mixins: [reachBottom],
  data() {
    return {
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
        channel: 'recommend',
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