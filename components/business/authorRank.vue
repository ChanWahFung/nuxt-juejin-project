<template functional>
  <div class="author-block shadow">
    <div class="author-block__title">🎖️ 作者榜</div>
    <nuxt-link tag="div" :to="'/user/'+item.author.id" class="author-item" v-for="item in props.list" :key="item.id">
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
    </nuxt-link>
  </div>
</template>

<style lang='scss' scoped>
.author-block{
  width: 280px;
  background: #fff;

  .author-block__title{
    padding: 15px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
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
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .author__info{
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