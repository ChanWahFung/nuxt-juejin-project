<template>
  <div>
    <div class="pin-item-wrap shadow" v-for="{node} in pinList" :key="node.id">
      <pin-item :actors="node.actors" :item="node.targets ? node.targets[0] : node" :action="node.action"></pin-item>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app, params }) {
    let res = await app.$api.getPinList({
      type: params.type,
      first: 20,
      after: ''
    }).then(res => res.s === 1 ? res.d : {})
    return {
      pinList: res.edges,
      pageInfo: res.pageInfo
    }
  },
  head() {
    return {
      title: `${this.categoryName ? this.categoryName + ' - ' : ''}沸点 - 掘金`
    }
  },
  validate({ params }) {
    let whiteList = ['recommended', 'hot', 'following']
    return whiteList.includes(params.type)
  },
  mixins: [reachBottom],
  data() {
    return {
      pinList: [],
      pageInfo: {}
    }
  },
  computed: {
    ...mapState('category', {
      navList: 'pinCategoryList'
    }),
    categoryName() {
      let item = this.navList.filter(item => item.id === this.$route.params.type)[0]
      return  item ? item.name : ''
    }
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.hasNextPage) {
        this.getPinList()
      }
    },
    async getPinList() {
      let res = await this.$api.getPinList({
        type: this.$route.params.type,
        first: 20,
        after: this.pageInfo.endCursor
      })
      if (res.s) {
        this.pinList = this.pinList.concat(res.d.edges)
        this.pageInfo = res.d.pageInfo
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.pin-item-wrap{
  margin-bottom: 10px;
}
</style>