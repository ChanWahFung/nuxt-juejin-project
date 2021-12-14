<template>
  <nuxt-link :to="'/tag?name='+item.tag.tag_name" target="_blank">
    <div class="tag-item">
      <img :src="item.tag.icon" class="tag-item__avatar">
      <div class="tag-item__info">
        <p class="tag-item__title" v-html="highlight.title || item.tag.tag_name"></p>
        <p>{{ item.tag.concern_user_count }}关注 · {{ item.tag.post_article_count }}文章</p>
      </div>
      <div class="tag-item__btn">
        <follow-btn type="tag" :is-follow.sync="item.user_interact.is_follow" :followee-id="item.tag_id"></follow-btn>
      </div>
    </div>
  </nuxt-link>
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

   ::v-deep  .tag-item__title em{
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