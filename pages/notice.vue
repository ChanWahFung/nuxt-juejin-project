<template>
  <div>
    <div class="notice-item--wrapper" v-for="item in notices" :key="item.id">
      <notice-item v-if="item.type != 'follow'" :item="item"></notice-item>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
import noticeItem from '~/components/business/noticeItem'

export default {
  head() {
    return {
      title: '用户消息 - 掘金'
    }
  },
  async asyncData({ app }) {
    let notices = await app.$api.getUserNotification().then(res => res.s === 1 ? res.d : [])
    return {
      notices
    }
  },
  mixins: [reachBottom],
  components: {
    'notice-item': noticeItem
  },
  data() {
    return {
      notices: []
    }
  },
  mounted() {
  },
  methods: {
    reachBottom() {
      this.getUserNotification()
    },
    async getUserNotification() {
      let res = await this.$api.getUserNotification({
        before: this.notices[this.notices.length - 1].beforeAtString
      })
      if (res.s === 1) {
        this.notices = this.notices.concat(res.d)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.notice-item--wrapper{
  margin-bottom: 15px;
}
</style>