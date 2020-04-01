<template>
  <div class="tag-item" @click="toTag(item.title)">
    <img :src="item.icon" class="tag-item__avatar">
    <div class="tag-item__info">
      <p class="tag-item__title" v-html="highlight.title || item.title"></p>
      <p>{{ item.subscribersCount }}关注 · {{ item.entryCount }}文章</p>
    </div>
    <div class="tag-item__btn">
      <follow-btn :is-follow="item.viewerIsFollowing"></follow-btn>
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
    toTag(tagName) {
      this.$router.push(`/tag/${tagName}`)
    }
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
    font-size: 14px;
    color: #2e3135;

    .tag-item__title{
      font-size: 16px;
      font-weight: bold;
    }
  }

  .tag-item__btn{
    align-self: center;
    margin-left: auto;
  }
}
</style>