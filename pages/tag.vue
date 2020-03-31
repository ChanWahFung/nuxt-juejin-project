<template>
  <div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  validate ({ params }) {
    console.log(params)
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
    this.$api.getTagDetail()
    this.$api.getTagEntry({
      tagId: this.id
    })
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>

</style>