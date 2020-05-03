<template>
  <div>
    <div class="pin-item-wrap shadow" v-for="item in pinList" :key="item.objectId">
      <pin-item :item.sync="item"></pin-item>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app, params }) {
    let pinList = await app.$api.getPinListByTopic({
      topicId: params.id,
      page: 1,
      pageSize: 20
    }).then(res => res.s === 1 ? res.d.list : [])
    return {
      pinList
    }
  },
  head() {
    return {
      title: `${this.categoryName ? this.categoryName + ' - ' : ''}沸点 - 掘金`
    }
  },
  validate({ params }) {
    return params.id
  },
  mixins: [reachBottom],
  data() {
    return {
      page: 1,
      pinList: []
    }
  },
  computed: {
    ...mapState('category', {
      navList: 'pinCategoryList'
    }),
    categoryName() {
      let item = this.navList.filter(item => item.id === this.$route.params.id)[0]
      return  item ? item.name : ''
    }
  },
  methods: {
    reachBottom() {
      this.page++
      this.getPinListByTopic()
    },
    async getPinListByTopic() {
      let res = await this.$api.getPinListByTopic({
        topicId: this.$route.params.id,
        page: this.page,
        pageSize: 20
      })
      if (res.s === 1) {
        this.pinList = this.pinList.concat(res.d.list)
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