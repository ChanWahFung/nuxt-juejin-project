<template>
  <nav class="nav-view">
    <ul class="nav-list">
      <li></li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      this.$api.getCategories()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>