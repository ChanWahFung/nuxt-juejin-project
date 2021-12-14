<template>
  <header class="topbar__wrapper">
    <div class="topbar" :class="['topbar--'+(isTopbarBlock ? 'show' : 'hidden')]">
      <div class="topbar__main">
        <nuxt-link to="/timeline" class="logo">
          <img src="~assets/images/png/logo.svg" alt="掘金">
        </nuxt-link>
        <ul class="navs">
          <nuxt-link v-for="item in navs" :key="item.id" :to="item.link" tag="li" class="nav-item">{{ $t('topbar.'+item.name) }}</nuxt-link>
        </ul>
        <div class="search-form" :class="[searchFormClass]">
          <input class="search-input" type="text" @focus="searchFormClass = 'search-form--focus'" @blur="searchFormClass = ''" maxlength="32" v-model="keyword" :placeholder="$t('topbar.search')" @keydown.enter="sreachHandler" />
          <img v-show="searchFormClass" src="~/assets/images/search-icon-active.svg" class="search-icon" />
          <img v-show="searchFormClass == ''" src="~/assets/images/search-icon.svg" class="search-icon" />
        </div>
        <template v-if="userInfo">
          <nuxt-link to="/notice" class="notice" target="_blank">
            <div class="notice__icon"></div>
            <span class="notice__count" v-if="noticeNum > 0">{{ noticeNumTip }}</span>
          </nuxt-link>
          <div class="user-entry" :style="`background-image:url(${userInfo.avatarLarge})`" @click="isShowNavMenu = !isShowNavMenu">
            <ul v-show="isShowNavMenu" class="nav-menu shadow">
              <li class="nav-item">
                <nuxt-link :to="'/user/'+userInfo.objectId">
                  <img class="nav-item__icon" src="~/assets/images/menu-user.svg" alt="">{{ $t('menu.home') }}
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link to="/subscribe">
                  <img class="nav-item__icon" src="~/assets/images/menu-tag.svg" alt="">{{ $t('menu.label') }}
                </nuxt-link>
              </li>
              <li class="nav-item" @click="switchLocale">
                <img class="nav-item__icon" src="~/assets/images/menu-locale.svg" alt="">
                <span :style="{'font-weight': locale === 'zh' ? '600' : ''}">zh</span>/
                <span :style="{'font-weight': locale === 'en' ? '600' : ''}">en</span>
              </li>
              <li class="nav-item" @click.stop="logout">
                <img class="nav-item__icon" src="~/assets/images/menu-logout.svg" alt="">{{ $t('menu.logout') }}
              </li>
            </ul>
          </div>
        </template>
        <!-- <div v-else class="login-btn" @click="showLoginModal">{{ $t('menu.login') }}</div> -->
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'TopBar',
  data() {
    return {
      navs: [
        {
          name: 'home',
          link: '/timeline'
        },
        {
          name: 'pin',
          link: '/pins/recommend'
        },
        {
          name: 'topic',
          link: '/topic'
        },
        {
          name: 'book',
          link: '/book'
        }
      ],
      keyword: '',
      scrollingElement: null,
      searchFormClass: '',
      noticeNum: 0,
      isShowNavMenu: false,

    }
  },
  mounted() {
    let scrollingElement = document.scrollingElement
    let scrollTop = 0
    window.addEventListener('scroll', () => {
      if (Math.abs(scrollingElement.scrollTop - scrollTop) < 100) {
        return;
      }
      if (scrollingElement.scrollTop < 300) {
        this.isTopbarBlock === false && this.UPDATE_TOPBAR_BLOCK(true)
        return
      }
      if (scrollingElement.scrollTop > scrollTop) {
        this.UPDATE_TOPBAR_BLOCK(false)
      } else if (scrollingElement.scrollTop < scrollTop) {
        this.UPDATE_TOPBAR_BLOCK(true)
      }
      scrollTop = scrollingElement.scrollTop
    })
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ]),
    ...mapState('auth', [
      'userInfo'
    ]),
    ...mapState('locale', [
      'locale'
    ]),
    noticeNumTip(){
      return this.noticeNum > 99 ? '99+' : this.noticeNum
    }
  },
  watch: {
    '$route.path': {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.UPDATE_TOPBAR_BLOCK(true)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      'UPDATE_TOPBAR_BLOCK': 'UPDATE_TOPBAR_BLOCK',
      'SET_LANG': 'locale/SET_LANG'
    }),
    sreachHandler () {
      this.$router.push({
        name: 'search',
        query: {
          keyword: this.keyword
        }
      })
    },
    showLoginModal() {
      this.$loginModal(this)
    },
    // 切换语言
    switchLocale() {
      let locale = this.locale === 'zh' ? 'en' : 'zh'
      this.$i18n.locale = locale
      this.SET_LANG(locale)
      this.$cookies.set('lang', locale)
    },
    // 登出
    logout() {
      this.isShowNavMenu = false
      this.$utils.removeAuthInfo(this)
    }
  }
}
</script>

<style lang='scss' scoped>
.topbar__wrapper{
  z-index: 1000;
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

    img {
        display: block;
        width: 116.82px;
        height: 24px;
    }
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

  &.search-form--focus{
    border-color: $theme;
    background: #fff;
  }

  .search-input{
    border: none;
    width: 130px;
    padding: 8px 16px;
    box-shadow: none;
    outline: none;
    font-size: 12px;
    color: #666;
    background-color: transparent;

    &::placeholder{
      color: #999;
    }
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
    background-image: url(../../assets/images/notice.svg);
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
      background-image: url(../../assets/images/notice-active.svg);
    }
  }
}
.user-entry{
  position: relative;
  margin-left: 30px;
  width: 30px;
  height: 30px;
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: rgb(238, 238, 238);
  border-radius: 50%;
  cursor: pointer;

  .nav-menu{
    z-index: 10;
    position: absolute;
    top: 150%;
    right: 0;
    min-width: 150px;
    padding: 10px 0;
    border-radius: 3px;
    border: 1px solid #ddd;
    background: #fff;

    .nav-item{
      display: flex;
      align-items: center;
      padding: 7px 12px;
      font-size: 16px;
      color: #71777c;
      white-space: nowrap;
      cursor: pointer;

      .nav-item__icon{
        width: 15px;
        height: 15px;
        margin-right: 10px;
      }

      >a{
        display: flex;
        align-items: center;
        width: 100%;
        display: block;
      }
      &:hover{
        background-color: hsla(0,0%,94.9%,.5);
      }
    }
  }
}
.login-btn{
  margin-left: 20px;
  color: $theme;
  cursor: pointer;
}
</style>