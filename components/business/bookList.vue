<template>
  <div class="books">
    <div class="book-item" v-for="item in list" :key="item._id">
      <div class="book__cover" :style="`background-image: url(${item.img})`"></div>
      <div class="book__info">
        <div class="book__title">{{ item.title }}</div>
        <div class="book__desc ellipsis">{{ item.desc }}</div>
        <div class="book__author">
          <nuxt-link class="author__info" :to="'/user/'+item.userData.uid" target="_blank">
            <div class="author__avatar">
              <user-avatar :url="item.userData.avatarLarge" :round="true"></user-avatar>
            </div>
            <span class="author__name">{{ item.userData.username }}</span>
            <level :level="item.userData.level"></level>
          </nuxt-link>
          <span class="author__desc ellipsis">{{ item.profile }}</span>
        </div>
        <div class="book__data">
          <span class="book__price" :class="{'book__buy': item.isBuy}">{{ item.isBuy ? '已购买' : '￥'+item.price }}</span>
          <span class="book__meta">{{ item.lastSectionCount }}小节 · {{ item.buyCount }}人已购买</span>
        </div>
      </div>
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
  }
}
</script>

<style lang='scss' scoped>
.books{
  background: #fff;
}
.book-item{
  display: flex;
  padding: 30px;
  cursor: pointer;

  &:not(:last-child){
    border-bottom: 1px solid #eee;
  }

  &:hover{
    background: #f7f9f9;
  }

  .book__cover{
    width: 100px;
    height: 140px;
    flex-shrink: 0;
    box-shadow: 3px 4px 12px 0 rgba(0,0,0,.2);
    overflow: hidden;
    background-color: #ccc;
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .book__info{
    position: relative;
    padding-left: 20px;
    font-size: 14px;
    color: #2e3135;
    flex-grow: 1;
    overflow: hidden;

    .book__title{
      font-size: 20px;
    }

    .book__desc{
      margin-top: 5px;
      line-height: 20px;
      height: 20px;
      color: #71777c;
    }

    .book__author{
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-top: 6px;

      .author__info{
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .author__avatar{
        width: 26px;
        height: 26px;
        margin-right: 10px;
        border-radius: 50%;
      }

      .author__name{
        color: #000;
        margin-right: 5px;
      }

      .author__desc{
        padding-left: 10px;
        color: #71777c;
      }
    }

    .book__data{
      margin-top: 8px;

      .book__price{
        color: #ed7b11;
        font-size: 18px;
        margin-right: 10px;
      }

      .book__buy{
        font-size: 14px;
      }

      .book__meta{
        font-size: 13px;
        color: #71777c;
        opacity: .6;
      }
    }
  }
}
</style>