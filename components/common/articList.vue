<template>
  <div class="artic-list">
    <div v-for="(item, index) in list" :key="item.article_id || item.item_info.article_id" class="artic-item--border">
      <template v-if="item.item_type == 2">
        <artic-item :item.sync="list[index].item_info"></artic-item>
      </template>
      <template v-else-if="item.item_type == undefined">
        <artic-item :item.sync="list[index]"></artic-item>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasDesc: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
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
.artic-list {
  background-color: #fff;

  .artic-item--border:not(:last-child){
    border-bottom: 1px solid #eee;
  }
}
</style>