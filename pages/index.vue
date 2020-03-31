<template>
  <div class="container">
    <div class="list-header">
      <ul class="list-nav">
        <li class="list-nav-item" :class="{'list-nav-item__active': item.id == navId}" v-for="item in navs" :key="item.title" @click="changeNav(item)">{{ item.title }}</li>
        <el-select v-if="navTypes.length" size="mini" style="width:100px" v-model="navType" placeholder="请选择" @change="changeNav">
          <el-option
            v-for="item in navTypes"
            :key="item.title"
            :label="item.title"
            :value="item.type">
          </el-option>
        </el-select>
      </ul>
    </div>
    <artic-list :list="list"></artic-list>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app }) {
    let res = await app.$api.getIndexList();
    res = res.data.articleFeed.items
    return {
      list: res.edges,
      pageInfo: res.pageInfo
    };
  },
  mixins: [reachBottom],
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
      list: [],
      pageInfo: {},
      reachBottomDistance: 50,
      isReachBottom: false
    };
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
    changeNav (item) {
      if (item.id && this.navId !== item.id) {
        this.navId = item.id
        this.navType = item.type
        this.navTypes = item.types || []
      }
      this.getArticList()
    },
    async getArticList({ isLoadMore = false } = {}){
      let params = {
        order: this.navType
      }
      if (isLoadMore) {
        params.after = this.pageInfo.endCursor || ''
      }
      let res = await this.$api.getIndexList(params);
      console.log(res)
      res = res.data.articleFeed.items
      this.list = isLoadMore ? this.list.concat(res.edges) : res.edges
      this.pageInfo = res.pageInfo
      return res
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
  background: #fff;
  box-shadow: 0 0 4px #eee;
  border-radius: 2px;

  .list-header{
    padding: 15px 25px;
    border-bottom: 1px solid #eee;
  }

  .list-nav{
    height: 28px;
    display: flex;
    align-items: center;
    
    .list-nav-item{
      display: inline-block;
      font-size: 14px;
      color: #909090;
      cursor: pointer;

      &:hover,
      &.list-nav-item__active{
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
}
</style>
