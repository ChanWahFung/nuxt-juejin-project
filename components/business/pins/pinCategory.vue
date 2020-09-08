<template>
  <ul class="nav-list" :class="{'nav-list--sticky': !isTopbarBlock}">
    <li class="nav-item" :class="{'nav-item--active': item.path == $route.path}" v-for="item in navList" :key="item.topic_id" :title="item.title" @click="changeCategory">
      <nuxt-link :to="item.path">{{ item.title }}</nuxt-link>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('category', {
      navList: 'pinCategoryList'
    }),
    ...mapState([
      'isTopbarBlock'
    ])
  },
  methods: {
    changeCategory() {
      window.scrollTo({ top: 0 })
    }
  },
}
</script>

<style lang='scss' scoped>
.nav-list{
  width: 112px;
  position: fixed;
  top: 80px;
  padding: 16px 12px;
  background: #fff;
  border-radius: 3px;
  transition: all .2s;

  &.nav-list--sticky{
    top: 20px;
  }

  .nav-item{
    position: relative;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #2e3135;
    border-radius: 3px;
    transition: background-color .2s, color .2s;

    &:nth-of-type(2)::after{
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
      width: 100%;
      line-height: 30px;
      padding: 0 5px;
      text-align: center;
      color: #909090;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
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