<template>
  <div class="tag-item">
    <img :src="item.icon" class="tag-item__avatar">
    <div class="tag-item__info">
      <p class="tag-item__title" v-html="highlight.title || item.title"></p>
      <p>{{ item.subscribersCount }}关注 · {{ item.entryCount }}文章</p>
    </div>
    <div class="tag-item__btn">
      <follow-btn :isFollow="item.viewerIsFollowing"></follow-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    highlight: {
      type: Object,
      default: () => ({})
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
.tag-item{
  display: flex;
  padding: 20px 25px;
  cursor: pointer;

  &:hover{
    background: rgba(0,0,0,.01);
  }

  /deep/ .tag-item__title em{
    color: #e8001c;
  }

  .tag-item__avatar{
    position: relative;
    width: 42px;
    height: 42px;
    margin-right: 15px;
    object-fit: contain;
  }

  .tag-item__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    color: #2e3135;

    .tag-item-title{
      font-weight: bold;
    }
  }

  .tag-item__btn{
    align-self: center;
    margin-left: auto;
  }
}
</style>