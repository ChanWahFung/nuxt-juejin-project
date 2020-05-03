<template functional>
  <div class="book-block shadow">
    <div class="book-block__title">你可能感兴趣的小册</div>
    <nuxt-link to="/book" v-for="item in props.list" :key="item._id">
      <div class="book-item">
        <div class="item__cover" :style="`background-image: url(${item.img})`"></div>
        <div class="item__info">
          <div class="item__title">{{ item.title }}</div>
          <div class="item__bought">
            <div>{{ item.buyCount }}人已购买</div>
            <div class="item__raed-btn">试读</div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<style lang='scss' scoped>
.book-block{
  margin-top: 20px;
  background: #fff;
  border-radius: 2px;

  .book-block__title{
    padding: 15px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }
}
.book-item{
  width: 100%;
  display: flex;
  padding: 15px;

  &:hover{
    background-color: #fafafa;
  }

  .item__cover{
    height: 72px;
    width: 52px;
    margin-right: 10px;
    flex-shrink: 0;
    box-shadow: 0 2px 7px 0 rgba(0,0,0,.26);
    background-size: 100%;
    background-repeat: no-repeat;
    background-color: #ccc;
  }

  .item__info{
    flex: 1 1 auto;
  }

  .item__title{
    max-height: 52px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    color: #333;
    margin-bottom: 5px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .item__bought{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #878c90;
    
    .item__raed-btn{
      display: flex;
      align-items: center;
      padding: 3px;
      color: #fff;
      background: $theme;
      border-radius: 2px;

      &:after{
        content: '';
        display: inline-block;
        margin-left: 4px;
        border: 3px solid transparent;
        border-left-color: #fff;
      }
    }
  }
}
</style>