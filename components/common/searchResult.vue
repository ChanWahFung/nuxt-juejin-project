<template>
  <div class="search-result">
    <div v-for="(item, index) in list" :key="index" class="artic-item--border">
      <artic-item v-if="item.result_type === 2" :has-desc="true" :item.sync="list[index].result_model"></artic-item>
      <user-item v-else-if="item.result_type === 1" :item="item.result_model"></user-item>
      <tag-item v-else-if="item.result_type === 9" :item="item.result_model"></tag-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.search-result{
  background: #fff;

  .artic-item--border:not(:last-child){
    border-bottom: 1px solid #eee;
  }
}
</style>