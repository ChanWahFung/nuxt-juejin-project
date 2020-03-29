<template>
  <header class="container">
    <div class="wrapper">
      <div class="main">
        <nuxt-link to="/" class="logo">
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg" alt="掘金">
        </nuxt-link>
        <ul class="navs">
          <nuxt-link v-for="item in navs" :key="item.id" :to="item.link" tag="li" class="nav-item">{{ item.name }}</nuxt-link>
        </ul>
        <div class="search-form">
          <input class="search-input" type="text" maxlength="32" v-model="keyword" placeholder="搜索" @keydown.enter="sreachHandler" />
          <img src="~/assets/images/search-icon.svg" class="search-icon" />
        </div>
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
      ],
      keyword: ''
    }
  },
  created() {
  },
  methods: {
    sreachHandler () {
      this.$router.push({
        name: 'search',
        query: {
          keyword: this.keyword
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.container{
  z-index: 9999;
  position: relative;
  background-color: #fff;
  height: 60px;
}
.wrapper{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 4px #eee;
}
.main{
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

  .nav-item{
    padding: 0 20px;
    cursor: pointer;

    &:hover,
    &.nuxt-link-active{
      color: $theme;
    }
  }
}
.search-form{
  border: 1px solid hsla(0,0%,59.2%,.2);
  background-color: rgba(227,231,236,.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px;
  margin-left: auto;

  .search-input{
    border: none;
    width: 160px;
    padding: 8px 16px;
    box-shadow: none;
    outline: none;
    font-size: 12px;
    color: #666;
    background-color: transparent;
  }

  .search-icon{
    padding: 0 8px;
    cursor: pointer;
  }
}
</style>