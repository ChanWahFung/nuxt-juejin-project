<template>
  <ul class="nav-list">
    <li class="nav-item" :class="{'nav-item--active': item.path == $route.path}" v-for="item in navList" :key="item.id">
      <nuxt-link :to="item.path">{{ item.name }}</nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          id: '0',
          name: '推荐',
          path: '/pin/recommended'
        },
        {
          id: '1',
          name: '热门',
          path: '/pin/hot'
        },
        {
          id: '2',
          name: '关注',
          path: '/pin/following'
        },
        {
          id: '5c09ea2b092dcb42c740fe73',
          name: '开源推荐',
          path: '/pin/topic/5c09ea2b092dcb42c740fe73'
        },
        {
          id: '5abb61e1092dcb4620ca3322',
          name: '内推招聘',
          path: '/pin/topic/5abb61e1092dcb4620ca3322'
        },
        {
          id: '5abcaa67092dcb4620ca335c',
          name: '掘金相亲',
          path: '/pin/topic/5abcaa67092dcb4620ca335c'
        },
        {
          id: '5c106be9092dcb2cc5de7257',
          name: '上班摸鱼',
          path: '/pin/topic/5c106be9092dcb2cc5de7257'
        },
        {
          id: '5b514af1092dcb61bd72800d',
          name: '应用安利',
          path: '/pin/topic/5b514af1092dcb61bd72800d'
        },
        {
          id: '5abb67d2092dcb4620ca3324',
          name: '开发工具',
          path: '/pin/topic/5abb67d2092dcb4620ca3324'
        },
        {
          id: '5c46a17f092dcb4737217152',
          name: 'New资讯',
          path: '/pin/topic/5c46a17f092dcb4737217152'
        },
      ]
    }
  },
}
</script>

<style lang='scss' scoped>
.nav-list{
  padding: 16px 12px;
  background: #fff;
  border-radius: 3px;

  .nav-item{
    position: relative;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #2e3135;
    padding: 0 12px;
    border-radius: 3px;
    transition: background-color .2s, color .2s;

    &:nth-of-type(3)::after{
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 1px;
      background: #ddd;
      transform-origin: 0 100%;
      transform: scaleY(.5);
    }

    &:not(:first-child){
      margin-top: 10px;
    }
    
    >a{
      color: #909090;
    }

    &:hover{
      background-color: hsla(0,0%,94.9%,.6);

      >a{
        color: $theme;
      }
    }
  }

  .nav-item--active,.nav-item--active:hover{
    background-color: $theme;
    color: #fff;

    >a{
      color: #fff;
    }
  }
}
</style>