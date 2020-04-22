<template>
  <div class="author-block shadow">
    <div class="author-block__title">🎖️ 作者榜</div>
    <nuxt-link :to="'/user/'+item.author.id" target="_blank" v-for="item in list" :key="item.id">
      <div class="author-item">
        <div class="author__avatar">
          <user-avatar :url="item.author.avatarLarge" :round="true"></user-avatar>
        </div>
        <div class="author__info">
          <div class="author__name">
            {{ item.author.username }}
            <level :level="item.author.level"></level>
          </div>
          <div class="ellipsis">
            {{ item.author.jobTitle }}
            {{ item.author.jobTitle && item.author.company ? '@' : '' }}
            {{ item.author.company }}
          </div>
          <div class="ellipsis">{{ item.description }}</div>
        </div>
      </div>
    </nuxt-link>
    <nuxt-link to="/recommendation/authors/recommended">
      <div class="author-block__footer">
        完整榜单
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
.author-block{
  background: #fff;
  border-radius: 2px;

  .author-block__title{
    padding: 15px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }

  .author-block__footer{
    padding: 15px;
    font-size: 14px;
    text-align: center;
    border-top: 1px solid #eee;
    color: $theme;
    cursor: pointer;

    &:after{
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-left: 3px;
      border: 2px solid currentColor;
      border-left-color: transparent;
      border-bottom-color: transparent;
      transform: rotate(45deg);
    }
  }

  .author-item{
    display: flex;
    padding: 15px;
    cursor: pointer;

    &:hover{
      background: hsla(0,0%,84.7%,.1);
    }
  }

  .author__avatar{
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .author__info{
    flex: 1 1 auto;
    font-size: 12px;
    color: #909090;
    line-height: 1.5;
    overflow: hidden;
    
    .author__name{
      font-size: 15px;
      color: #262626;
    }
  }
}
</style>