<template>
  <div>
    hello
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `个人主页 - 掘金`
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  validate ({ params }) {
    if (params.id) {
      return true
    }
    return false
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
</style>