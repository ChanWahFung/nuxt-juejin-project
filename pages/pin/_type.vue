<template>
  <div>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    let res = await app.$api.getPinList({
      type: 'recommended',
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
      title: '沸点 - 掘金'
    }
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

</style>