<template>
  <div class="artic-list">
    <div v-for="item in list" :key="item.id" class="artic-item--border">
      <artic-item :item="item.node || item"></artic-item>
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