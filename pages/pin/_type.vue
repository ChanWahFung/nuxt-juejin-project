<template>
  <div>
    <div class="pin-item-wrap shadow" v-for="{node} in pinList" :key="node.id">
      <pin-item :item="node.targets ? node.targets : node"></pin-item>
    </div>
  </div>
</template>

<script>
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
  validate({ params }) {
    let whiteList = ['recommended', 'hot', 'following']
    return whiteList.includes(params.type)
  },
  data() {
    return {
      pinList: [],
      pageInfo: {}
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