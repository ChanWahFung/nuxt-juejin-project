<template>
  <header class="header">
    <div class="wrap">
      <div class="container">
        <nuxt-link to="/" class="logo">
          <!-- <img src="https://b-gold-cdn.xitu.io/v3/static/img/simplify-logo.3e3c253.svg" alt="掘金"> -->
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg" alt="掘金">
        </nuxt-link>
        <ul class="navs">
          <nuxt-link v-for="item in navs" :key="item.id" :to="item.link" tag="li" class="nav-item">{{ item.name }}</nuxt-link>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        {
          name: '首页',
          link: '/'
        },
        {
          name: '沸点',
          link: '/a'
        },
        {
          name: '话题',
          link: '/b'
        },
        {
          name: '小册',
          link: '/c'
        },
        {
          name: '活动',
          link: '/d'
        }
      ]
    }
  },
  created() {
  }
}
</script>

<style lang='scss' scoped>
.header{
  z-index: 9999;
  position: relative;
  background-color: #fff;
  height: 60px;
}
.wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 4px #eee;
}
.container{
  display: flex;
  align-items: center;
  max-width: 960px;
  height: 100%;
  margin: 0 auto;

  .logo{
    margin-right: 20px;
  }
}
.navs{
  display: flex;
  line-height: 60px;
  font-size: 16px;
  color: #71777c;
}
.nav-item{
  padding: 0 20px;
  cursor: pointer;

  &:hover,
  &.nuxt-link-active{
    color: $theme;
  }
}
</style>