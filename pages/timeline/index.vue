<template>
  <div>
    <index-nav-list @nav-item-click="navItemClick"></index-nav-list>
    <div class="index-container">
      <div class="index-main shadow">
        <div class="list__header">
          <ul class="list__nav">
            <li class="list__nav-item" :class="{'list__nav-item--active': item.id == navId}" v-for="item in navs" :key="item.title" @click="changeNavType(item)">{{ item.title }}</li>
            <el-select v-if="navTypes.length" size="mini" style="width:100px" v-model="navType" placeholder="请选择" @change="changeNavType">
              <el-option v-for="item in navTypes" :key="item.title" :label="item.title" :value="item.type">
              </el-option>
            </el-select>
          </ul>
        </div>
        <artic-list :list="list"></artic-list>
      </div>
      <div class="index-side">
        <author-rank :list="recommendAuthors"></author-rank>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import reachBottom from '~/mixins/reachBottom'
import authorRank from '~/components/business/authorRank'
import indexNavList from '~/components/business/indexNavList'

export default {
  async asyncData({ app }) {
    // 文章列表
    let indexData = await app.$api.getIndexList({
      first: 20,
      order: 'POPULAR'
    }).then(res => res.s == 1 ? res.d : {})
    // 推荐作者
    let recommendAuthors = await app.$api.getRecommendCard({ 
      limit: 5
    }).then(res => res.s == 1 ? res.d : [])
    return {
      list: indexData.edges || [],
      pageInfo: indexData.pageInfo || {},
      recommendAuthors
    };
  },
  mixins: [reachBottom],
  components: {
    'author-rank': authorRank,
    'index-nav-list': indexNavList
  },
  data() {
    return {
      navs: [
        {
          id: 1,
          title: '热门',
          type: 'POPULAR'
        },
        {
          id: 2,
          title: '最新',
          type: 'NEWEST'
        },
        {
          id: 3,
          title: '热榜',
          type: 'THREE_DAYS_HOTTEST',
          types: [
            {
              title: '3天内',
              type: 'THREE_DAYS_HOTTEST'
            },
            {
              title: '7天内',
              type: 'WEEKLY_HOTTEST'
            },
            {
              title: '30天内',
              type: 'MONTHLY_HOTTEST'
            },
            {
              title: '全部',
              type: 'HOTTEST'
            }
          ]
        }
      ],
      navId: 1,
      navType: 'POPULAR',
      navTypes: [],
      categoryId: 0,
      tags: [],
      list: [],
      pageInfo: {},
      recommendAuthors: [],
      isReachBottomFetching: false,  // 防止触底多次请求
    };
  },
  computed: {
    ...mapState('category', [
      'tagsList'
    ])
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.hasNextPage) {
        this.getArticList({
          isLoadMore: true
        })
      } else {
        this.$message.info('没有更多文章了')
      }
    },
    // 热门 最新 热榜
    changeNavType (item) {
      if (item.id && this.navId !== item.id) {
        this.navId = item.id
        this.navType = item.type
        this.navTypes = item.types || []
      }
      this.getArticList()
    },
    // 切换类目
    navItemClick(item) {
      this.categoryId = item.id
      this.getArticList()
    },
    async getArticList({ isLoadMore = false } = {}){
      if (this.isReachBottomFetching) {
        return
      }
      this.isReachBottomFetching = true
      let params = {
        first: 20,
        after: '',
        order: this.navType,
        tags: this.tags,
        category: this.categoryId || ''
      }
      if (isLoadMore) {
        params.after = this.pageInfo.endCursor || ''
      }
      let res = await this.$api.getIndexList(params);
      if (res.s == 1) {
        this.list = isLoadMore ? this.list.concat(res.d.edges) : res.d.edges
        this.pageInfo = res.d.pageInfo
        this.isReachBottomFetching = false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.index-container{
  display: flex;
  margin-top: 60px;

  .index-main{
    width: 700px;
    margin-right: 20px;
    background: #fff;
    border-radius: 2px;
  }

  .index-side{
    width: 240px;
  }
}
.list__header{
  padding: 15px 25px;
  border-bottom: 1px solid #eee;
}

.list__nav{
  height: 28px;
  display: flex;
  align-items: center;
  
  .list__nav-item{
    display: inline-block;
    font-size: 14px;
    color: #909090;
    cursor: pointer;

    &:hover,
    &.list__nav-item--active{
      color: $theme;
    }

    &:not(:last-child){
      &::after{
        content: '|';
        margin: 10px;
        color: #eee;
      }
    }
  }
}
</style>
