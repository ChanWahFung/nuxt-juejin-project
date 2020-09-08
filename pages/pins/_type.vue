<template>
  <div>
    <div class="pin-item-wrap shadow" v-for="(item, index) in pinList" :key="item.msg_id">
      <pin-item :item.sync="pinList[index]"></pin-item>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app, params }) {
    let pageInfo = {}
    let pinList = await app.$api.getPinList({
      type: params.type,
      limit: 20,
    }).then(res => {
      if (res.err_no == 0) {
        pageInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
      }
      return res.data || []
    })
    return {
      pinList,
      pageInfo
    }
  },
  head() {
    return {
      title: `${this.categoryName ? this.categoryName + ' - ' : ''}沸点 - 掘金`
    }
  },
  validate({ params }) {
    let whiteList = ['recommend', 'hot', 'follow']
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
      let item = this.navList.filter(item => item.topic_id === this.$route.params.type)[0]
      return  item ? item.title : ''
    }
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.hasMore) {
        this.getPinList()
      }
    },
    async getPinList() {
      let res = await this.$api.getPinList({
        cursor: this.pageInfo.cursor,
        type: this.$route.params.type,
        limit: 20,
      })
      if (res.err_no === 0) {
        this.pinList = this.pinList.concat(res.data)
        this.pageInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
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