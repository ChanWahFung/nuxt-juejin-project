<template>
  <div class="search-result">
    <div v-for="(item, index) in list" :key="index" class="artic-item--border">
      <artic-item v-if="item.node.type === 'ArticleSearchResultItem'" :has-desc="true" :item.sync="list[index].node.entity" :highlight="item.node.highlight"></artic-item>
      <user-item v-else-if="item.node.type === 'UserSearchResultItem'" :item="item.node.entity" :highlight="item.node.highlight"></user-item>
      <tag-item v-else-if="item.node.type === 'TagSearchResultItem'" :item="item.node.entity" :highlight="item.node.highlight"></tag-item>
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