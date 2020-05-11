<template>
  <div>
    <subscribe-nav v-model="currentNavItem"></subscribe-nav>
    <div class="tag-container">
      <ul v-if="$route.params.title === 'all'" class="nav-list">
        <li class="nav-item" :class="{'nav-item--active': type === 'hot'}" @click="typeChange('hot')">最热</li>
        <li class="nav-item" :class="{'nav-item--active': type === 'new'}" @click="typeChange('new')">最新</li>
        <li class="nav-item nav-item--search">
          <input class="search-input" v-model="keyword" @keydown.enter="tagSearch" type="text" maxlength="32" placeholder="搜索标签">
        </li>
      </ul>
      <div class="tag-list">
        <div class="tag-item" v-for="item in tagList" :key="item.id">
          <nuxt-link :to="'/tag?name='+item.title" target="_blank">
            <img class="item__icon" :src="item.icon">
          </nuxt-link>
          <nuxt-link :to="'/tag?name='+item.title" target="_blank">
            <span class="item__title">{{ item.title }}</span>
          </nuxt-link>
          <span class="item__meta">{{ item.subscribersCount }} 关注  {{ item.entryCount }} 文章</span>
          <follow-btn type="tag" :is-follow.sync="item.isSubscribe" :followee-id="item.id"></follow-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
import subscribeNav from '~/components/business/subscribe/subscribeNav'

export default {  
  async asyncData({ app, params }) {
    let tagList = []
    if (!params.title || params.title === 'subscribed') {
      tagList = await app.$api.getTagBySubscribed().then(res => res.s === 1 ? res.d.tagList : [])
    } else if (params.title === 'all') {
      tagList = await app.$api.getTagByAll({
        type: 'hot',
        page: 1,
        pageSize: 40
      }).then(res => res.s === 1 ? res.d.tags : [])
    }
    return {
      tagList
    }
  },
  head () {
    return {
      title: `${this.currentNavItem.name ? this.currentNavItem.name + ' - ' : ''}掘金`
    }
  },
  layout: 'default-white',
  validate ({ params }) {
    const whiteList = ['all', 'subscribed']
    if (params.title === undefined || whiteList.includes(params.title)) {
      return true
    }
    return false
  },
  components: {
    'subscribe-nav': subscribeNav
  },
  mixins: [reachBottom],
  data() {
    return {
      page: 1,
      pageSize: 40,
      keyword: '',
      isSearch: false,
      type: 'hot',
      currentNavItem: {},
      tagList: []
    }
  },
  methods: {
    reachBottom() {
      this.page++
      this.isSearch ? this.getTagBySearch({ isLoadMore: true }) : this.getTagByAll({ isLoadMore: true })
    },
    typeChange(type) {
      if (this.type == type) {
        return
      }
      this.type = type
      this.page = 1
      this.isSearch ? this.getTagBySearch() : this.getTagByAll()
    },
    tagSearch() {
      this.page = 1
      if (this.keyword) {
        this.isSearch = true
        this.getTagBySearch()
      } else {
        this.isSearch = false
        this.getTagByAll()
      }
    },
    async getTagByAll({ isLoadMore = false } = {}) {
      if (this.$route.params.title === 'all') {
        let res = await this.$api.getTagByAll({
          type: this.type,
          page: this.page,
          pageSize: this.pageSize
        })
        if (res.s === 1) {
          this.tagList = isLoadMore ? this.tagList.concat(res.d.tags) : res.d.tags
        }
      }
    },
    async getTagBySearch({ isLoadMore = false } = {}) {
      if (this.$route.params.title === 'all') {
        let res = await this.$api.getTagBySearch({
          keyword: this.keyword,
          type: this.type,
          page: this.page,
          pageSize: this.pageSize
        })
        if (res.s === 1) {
          this.tagList = isLoadMore ? this.tagList.concat(res.d.tags) : res.d.tags
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tag-container{
  margin: 60px 0;
  overflow: hidden;
}
.nav-list{
  display: flex;
  align-items: center;
  padding: 20px 10px;

  .nav-item{
    padding: 10px 15px;
    margin-right: 10px;
    color: #909090;
    cursor: pointer;

    &.nav-item--active,
    &:hover{
      color: $theme;
    }
  }

  .search-input{
    padding: 6px;
    font-size: 14px;
    border: 1px solid hsla(0,0%,59.2%,.2);
    outline: none;
  }
}
.tag-list{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 15px;

  .tag-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.5;
    padding: 30px 5px;
    border: 1px solid #eee;
    border-radius: 2px;

    .item__icon{
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .item__title{
      font-size: 18px;
      line-height: 2;
      color: #333;
    }

    .item__meta{
      margin-bottom: 10px;
      font-size: 14px;
      color: #909090;
    }
  }
}
</style>