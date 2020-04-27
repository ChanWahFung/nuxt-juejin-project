<template>
  <div>
    <div class="pin-item-wrap shadow" v-for="item in pinList" :key="item.objectId">
      <pin-item :item="item"></pin-item>
    </div>
  </div>
</template>

<script>
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
  validate({ params }) {
    return params.id
  },
  data() {
    return {
      pinList: []
    }
  },
  created() {
  },
  methods: {
  },
}
</script>

<style lang='scss' scoped>
.pin-item-wrap{
  margin-bottom: 10px;
}
</style>