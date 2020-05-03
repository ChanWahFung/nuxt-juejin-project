<template>
  <div class="about-article shadow">
    <div class="about-article__title">相关文章</div>
    <nuxt-link v-for="item in list" :key="item.objectId" :to="'/detail/'+item.originalUrl.split('/').pop()" target="_blank">
      <div class="article-item">
        <div class="article__title">{{ item.title }}</div>
        <div class="article__meta">
          <div class="meta-item">
            <img class="meta-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg">
            {{ item.collectionCount }}
          </div>
          <div class="meta-item">
            <img class="action-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg">
            {{ item.commentsCount }}
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang='scss' scoped>
.about-article{
  margin-top: 20px;
  background: #fff;
  border-radius: 2px;

  .about-article__title{
    padding: 15px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }
  
  .article-item{
    padding: 15px;
    font-size: 14px;
    line-height: 1.3;
    color: #333;
    cursor: pointer;

    &:hover{
      background: hsla(0,0%,84.7%,.1);
    }

    .article__meta{
      display: flex;
      align-items: center;
      margin-top: 10px;
      color: #b2bac2;
      font-size: 14px;

      .meta-item{
        display: flex;
        align-items: center;

        &:not(:last-child){
          margin-right: 20px;
        }

        .meta-item__icon{
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>