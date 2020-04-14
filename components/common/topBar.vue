<template>
  <header class="topbar__wrapper">
    <div class="topbar" :class="['topbar--'+wheelClass]">
      <div class="topbar__main">
        <nuxt-link to="/timeline" class="logo">
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg" alt="掘金">
        </nuxt-link>
        <ul class="navs">
          <nuxt-link v-for="item in navs" :key="item.id" :to="item.link" tag="li" class="nav-item">{{ item.name }}</nuxt-link>
        </ul>
        <div class="search-form" :class="[searchFormClass]">
          <input class="search-input" type="text" @focus="searchFormClass = 'search-form--focus'" @blur="searchFormClass = ''" maxlength="32" v-model="keyword" placeholder="搜索" @keydown.enter="sreachHandler" />
          <img v-show="searchFormClass" src="~/assets/images/search-icon-active.svg" class="search-icon" />
          <img v-show="searchFormClass == ''" src="~/assets/images/search-icon.svg" class="search-icon" />
        </div>
        <nuxt-link to="/notice" class="notice">
          <div class="notice__icon"></div>
          <span class="notice__count" v-if="noticeNum > 0">{{ noticeNumTip }}</span>
        </nuxt-link>
      </div>
    </div>
  </header>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TopBar',
  data() {
    return {
      navs: [
        {
          name: '首页',
          link: '/timeline'
        },
        {
          name: '沸点',
          link: '/pins'
        }
      ],
      keyword: '',
      wheelClass: 'show',
      scrollingElement: null,
      searchFormClass: '',
      noticeNum: 0
    }
  },
  mounted() {
    this.scrollingElement = document.scrollingElement
    window.onwheel = (e) => {
      if (this.scrollingElement.scrollTop < 300) {
        return
      }
      if (e.wheelDeltaY > 0 && this.wheelClass == 'hidden') {
        this.wheelClass = 'show'
        this.updateTopbarBlock(true)
      }
      if (e.wheelDeltaY < 0 && this.wheelClass == 'show') {
        this.wheelClass = 'hidden'
        this.updateTopbarBlock(false)
      }
    }
  },
  computed: {
    noticeNumTip(){
      return this.noticeNum > 99 ? '99+' : this.noticeNum
    }
  },
  watch: {
    '$route.path': {
      handler: function (newVal, oldVal) {
        this.getUserNotificationNum()
        if (newVal != oldVal) {
          // 当前页面为消息页时 更新未读消息状态
          if (newVal.includes('/notice')) {
            this.$api.setUserNotificationNum()
            this.getUserNotificationNum()
          }
          this.wheelClass = 'show'
          this.updateTopbarBlock(true)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations([
      'updateTopbarBlock'
    ]),
    sreachHandler () {
      this.$router.push({
        name: 'search',
        query: {
          keyword: this.keyword
        }
      })
    },
    async getUserNotificationNum(){
      let res = await this.$api.getUserNotificationNum()
      if (res.s === 1) {
        this.noticeNum = res.d.notification_num
        document.title = `${this.noticeNum > 0 ? `(${this.noticeNumTip}) ` : ''}${document.title}`
      }
    },
  }
}
</script>

<style lang='scss' scoped>
.topbar__wrapper{
  z-index: 9999;
  position: relative;
  height: 60px;
}
.topbar{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 4px #eee;
  transition: all .2s;

  &.topbar--show{
    transform: translateY(0);
  }
  &.topbar--hidden{
    transform: translateY(-100%);
  }
}
.topbar__main{
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
    &.nuxt-link-exact-active{
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

  &.search-form--focus{
    border-color: $theme;
    background: #fff;
  }

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
.notice{
  position: relative;
  width: 24px;
  height: 24px;
  margin-left: 30px;

  .notice__icon{
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-image: url(../../assets/images/notice.png);
  }

  .notice__count{
    position: absolute;
    left: 50%;
    bottom: 43%;
    margin: 0;
    padding: 5px 8px;
    font-size: 12px;
    line-height: 1;
    text-align: center;
    color: #f1f1f1;
    background-color: $theme;
    border-radius: 36px;
    border: 2px solid #fff;
    word-break: normal;
  }

  &.nuxt-link-exact-active,
  &:hover{
    .notice__icon{
      background-image: url(../../assets/images/notice-active.png);
    }
  }
}
</style>