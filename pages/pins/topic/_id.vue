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
    let pinListInfo = {}
    let pinList = await app.$api.getTopicPinList({
      topic_id: params.id,
      limit: 20,
      sort_type: 200
    }).then(res => {
      if (res.err_no === 0) {
        pinListInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
      }
      return res.data || []
    })
    return {
      pinList,
      pinListInfo
    }
  },
  head() {
    return {
      title: `${this.categoryName ? this.categoryName + ' - ' : ''}沸点 - 掘金`
    }
  },
  validate ({ params }) {
    if (params.id && params.id != 'undefined') {
      return true
    }
    return false
  },
  mixins: [reachBottom],
  data() {
    return {
      pinListInfo: {},
      pinList: []
    }
  },
  computed: {
    ...mapState('category', {
      navList: 'pinCategoryList'
    }),
    categoryName() {
      let item = this.navList.filter(item => item.topic_id === this.$route.params.id)[0]
      return  item ? item.title : ''
    }
  },
  methods: {
    reachBottom() {
      if (this.pinListInfo.hasMore) {
        this.getTopicPinList()
      }
    },
    async getTopicPinList() {
      let res = await this.$api.getTopicPinList({
        topic_id: this.$route.params.id,
        limit: 20,
        sort_type: 200,
        cursor: this.pinListInfo.cursor
      })
      if (res.err_no === 0) {
        this.pinList = this.pinList.concat(res.data)
        this.pinListInfo = {
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