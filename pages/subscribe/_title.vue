<template>
  <div>
    <subscribe-nav v-model="currentNavItem"></subscribe-nav>
    <div class="tag-container">
      <ul v-if="$route.params.title === 'all'" class="nav-list">
        <li class="nav-item" :class="{'nav-item--active': type === 'hot'}" @click="typeChange('hot')">最热</li>
        <li class="nav-item" :class="{'nav-item--active': type === 'new'}" @click="typeChange('new')">最新</li>
        <li class="nav-item nav-item--search"></li>
      </ul>
      <div class="tag-list">
        <div class="tag-item" v-for="item in tagList" :key="item.id">
          <img class="item__icon" :src="item.icon">
          <span class="item__title">{{ item.title }}</span>
          <span class="item__meta">{{ item.subscribersCount }} 关注  {{ item.entryCount }} 文章</span>
          <follow-btn type="tag" :is-follow="item.isSubscribe"></follow-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '../../mixins/reachBottom'
import subscribeNav from '../../components/business/subscribeNav'

export default {
  head () {
    return {
      title: `${this.currentNavItem.name ? this.currentNavItem.name + ' - ' : ''}掘金`
    }
  },
  layout: 'default-white',
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
  components: {
    'subscribe-nav': subscribeNav
  },
  mixins: [reachBottom],
  data() {
    return {
      page: 1,
      pageSize: 40,
      keyword: '',
      type: 'hot',
      currentNavItem: {},
      tagList: []
    }
  },
  methods: {
    reachBottom() {
      this.page++
      this.getTagByAll()
    },
    typeChange(type) {
      if (this.type == type) {
        return
      }
      this.type = type
      this.getTagByAll()
    },
    async getTagByAll() {
      if (this.$route.params.title === 'all') {
        let res = await this.$api.getTagByAll({
          type: this.type,
          page: this.page,
          pageSize: this.pageSize
        })
        if (res.s === 1) {
          this.tagList = this.tagList.concat(res.d.tags)
        }
      }
    },
    async getTagBySearch({ isLoadMore }) {
      if (this.$route.params.title === 'all' && this.keyword) {
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
  margin-top: 60px;
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
}
.tag-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .tag-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 23%;
    line-height: 1.5;
    padding: 30px 5px;
    margin-bottom: 15px;
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