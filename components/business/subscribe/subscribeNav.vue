<template>
  <div>
    <nav class="nav-view shadow" :class="{'nav-view--sticky': !isTopbarBlock}">
      <ul class="nav-list">
        <li class="nav-item" :class="{'nav-item--active': item.title === currentNavItem.title}" v-for="item in navs" :key="item.id" @click="navItemClick(item)">{{ item.name }}</li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  model: {
    prop: 'currentNavItem',
    event: 'update-item'
  },
  props: {
    currentNavItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      navs: [
        {
          id: 0,
          title: 'subscribed',
          name: '已关注标签'
        },
        {
          id: 1,
          title: 'all',
          name: '全部标签'
        }
      ]
    }
  },
  created() {
    let currentNavItem = this.navs.filter(item => item.title === this.$route.params.title)[0] || this.navs[0]
    this.$emit('update-item', currentNavItem)
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ])
  },
  methods: {
    navItemClick(item) {
      if (this.currentNavItem.id != item.id) {
        this.$router.push({
          name: 'subscribe-title',
          params: {
            title: item.title
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.nav-view{
  z-index: 999;
  position: fixed;
  left: 0;
  top: 60px;
  width: 100vw;
  background: #fff;
  border-top: 1px solid #eee;
  transition: all .2s;

  &.nav-view--sticky{
    top: 0;
  }
}

.nav-list{
  display: flex;
  width: 960px;
  margin: 0 auto;

  .nav-item{
    position: relative;
    padding: 15px 0;
    font-size: 14px;
    font-weight: 600;
    color: #71777c;
    cursor: pointer;

    &.nav-item--active{
      color: $theme;
      border-bottom: 2px solid currentColor;
    }

    &:hover{
      color: $theme;
    }

    &:not(:last-child){
      margin-right: 24px;
    }
  }
}
</style>