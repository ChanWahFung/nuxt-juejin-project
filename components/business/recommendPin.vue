<template>
  <div class="pin-recommend-block shadow">
    <div class="pin-recommend__title">推荐沸点</div>
    <nuxt-link :to="'/pin/'+item.objectId" class="pin-recommend-item" v-for="item in list" :key="item.objectId" :title="item.content" target="_blank">
      <div class="item-info">
        <div class="item-content" :class="{'with-picture': item.pictures.length}">{{ item.content }}</div>
        <div class="item-meta">{{ item.likedCount }} 赞 · {{ item.commentCount }} 评论</div>
      </div>
      <div v-if="item.pictures.length" class="item-cover" :style="`background-image: url(${item.pictures[0]})`"></div>
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
  },
  data() {
    return { 
    }
  },
}
</script>

<style lang='scss' scoped>
.pin-recommend-block{
  background: #fff;
  border-radius: 2px;

  .pin-recommend__title{
    padding: 15px;
    font-size: 15px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
  }
}
.pin-recommend-item{
  display: flex;
  height: 70px;
  padding: 15px 0;
  margin: 0 15px;
  overflow: hidden;
  box-sizing: content-box;

  &:not(:last-child){
    border-bottom: 1px solid #eee;
  }

  .item-info{
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .item-content{
      font-size: 13px;
      color: rgb(46, 49, 53);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;

      &.with-picture{
        max-width: 130px;
      }
    }

    .item-meta{
      font-size: 12px;
      color: #777;
    }
  }

  .item-cover{
    flex: 0 0 70px;
    width: 100%;
    height: 100%;
    margin-left: 12px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 4px;
  }
}
</style>