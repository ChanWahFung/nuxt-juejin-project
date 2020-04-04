<template>
  <div class="index-container">
    <div class="index-main shadow">
      <div class="list__header">
        <ul class="list__nav">
          <li class="list__nav-item" :class="{'list__nav-item--active': item.id == navId}" v-for="item in navs" :key="item.title" @click="changeNav(item)">{{ item.title }}</li>
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
    <div class="index-side">
      <div class="author-block shadow">
        <div class="author-block__title">🎖️ 作者榜</div>
        <nuxt-link tag="div" :to="'/user/'+item.author.id" class="author-item" v-for="item in recommendAuthors" :key="item.id">
          <div class="author__avatar">
           <user-avatar :url="item.author.avatarLarge" :round="true"></user-avatar>
          </div>
          <div class="author__info">
            <div class="author__name">
              {{ item.author.username }}
              <level :level="item.author.level"></level>
            </div>
            <div>
              {{ item.author.jobTitle }}
              {{ item.author.jobTitle && item.author.company ? '@' : '' }}
              {{ item.author.company }}
            </div>
            <div>{{ item.description }}</div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app }) {
    let res = await app.$api.getIndexList();
    res = res.data.articleFeed.items
    let recommendAuthors = await app.$api.getRecommendCard({ 
      limit: 3
    }).then(res => res.data.recommendationCard.items)
    return {
      list: res.edges,
      pageInfo: res.pageInfo,
      recommendAuthors
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
      recommendAuthors: [],
      isReachBottomFetching: false,  // 防止触底多次请求
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
      if (this.isReachBottomFetching) {
        return
      }
      this.isReachBottomFetching = true
      let params = {
        order: this.navType
      }
      if (isLoadMore) {
        params.after = this.pageInfo.endCursor || ''
      }
      let res = await this.$api.getIndexList(params);
      res = res.data.articleFeed.items
      this.list = isLoadMore ? this.list.concat(res.edges) : res.edges
      this.pageInfo = res.pageInfo
      this.isReachBottomFetching = false
    }
  }
};
</script>

<style lang="scss" scoped>
.index-container{
  display: flex;

  .index-main{
    margin-right: 20px;
    background: #fff;
    border-radius: 2px;
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

.author-block{
  width: 280px;
  background: #fff;

  .author-block__title{
    padding: 15px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }

  .author-item{
    display: flex;
    padding: 15px;
    cursor: pointer;

    &:hover{
      background: hsla(0,0%,84.7%,.1);
    }
  }

  .author__avatar{
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .author__info{
    font-size: 12px;
    color: #909090;
    line-height: 1.5;
    
    .author__name{
      font-size: 15px;
      color: #262626;
    }
  }
}
</style>
