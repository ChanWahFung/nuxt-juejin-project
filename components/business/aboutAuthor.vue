<template>
  <div class="about-author shadow" v-if="info">
    <div class="about-author__title">关于作者</div>
    <div class="author__main">
      <nuxt-link :to="'/user/'+info.uid" class="author__info-block" target="_blank">
        <div class="author__avatar">
          <user-avatar :url="info.avatarLarge" :round="true"></user-avatar>
        </div>
        <div class="author__info">
          <div class="author__username">
            {{ info.username }}
            <level :level="info.level"></level>
          </div>
          <div class="author__job ellipsis">
            {{ info.jobTitle }}
            {{ info.jobTitle && info.company ? '@' : '' }}
            {{ info.company }}
          </div>
        </div>
      </nuxt-link>
      <div class="author__meta">
        <div class="honor-item">
          <img class="honor-item__icon shadow" src="~/assets/images/honor-4.svg" />
          <span class="honor-item__title">获得点赞 {{ info.totalCollectionsCount }}</span>
        </div>
        <div class="honor-item">
          <img class="honor-item__icon shadow" src="~/assets/images/honor-5.svg" />
          <span class="honor-item__title">文章被阅读 {{ info.totalViewsCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang='scss' scoped>
.about-author{
  background: #fff;
  border-radius: 2px;

  .about-author__title{
    padding: 15px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }

  .author__main{
    padding: 15px;
  }

  .author__meta{
    margin-top: 15px;

    .honor-item{
      display: flex;
      align-items: center;
      
      &:not(:last-child){
        margin-bottom: 10px;
      }

      .honor-item__icon{
        width: 25px;
        height: 25px;
        margin-right: 15px;
        border-radius: 50%;
      }

      .honor-item__title{
        font-size: 16px;
        color: #000;
      }
    }
  }
  
  .author__info-block{
    display: flex;
    cursor: pointer;

    .author__avatar{
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      margin-right: 12px;
    }

    .author__info{
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: 1.2;
      overflow: hidden;

      .author__username{
        font-weight: bold;
        fon-size: 16px;
      }

      .author__job{
        font-size: 15px;
        color: #909090;
      }
    }
  }
}
</style>