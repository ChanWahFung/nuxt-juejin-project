<template>
  <div>
    <div class="artic-list">
      <div v-for="item in list" :key="item.id" class="artic-item">
        <div class="artic-info">
          <ul class="artic-meta">
            <li class="meta-item post">专栏</li>
            <li class="meta-item">{{ item.user.username }}</li>
            <li class="meta-item">{{ item.createdAt | formatTime }}</li>
            <li class="meta-item">
              <span v-for="(tag) in item.tags" :key="tag.id" class="label">{{ tag.title }}</span>
            </li>
          </ul>
          <nuxt-link class="artic-title" :to="{path: '/detail/'+item.artic_id}">{{ item.title }}</nuxt-link>
          <ul class="artic-action">
            <li class="action-item">
              <img class="icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg">
              {{ item.likeCount }}
            </li>
            <li class="action-item">
              <img class="icon" src="https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg">
              {{ item.commentsCount }}
            </li>
          </ul>
        </div>
        <div v-if="item.screenshot" class="artic-cover" :style="'background-image: url('+item.screenshot+')'"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import LRU from 'lru-cache'
// const CACHED = new LRU({
//   max: 100,
//   maxAge: 1000 * 60
// })
export default {
  async asyncData({ app }) {
    let list = {}
    let pageInfo = {}
    // if (CACHED.has('indexList')) {
    //   let data = CACHED.get('indexList')
    //   data = JSON.parse(data)
    //   list = data.list
    //   pageInfo = data.pageInfo
    // } else {
      const res = await app.$api.getIndexList();
      list = res.list
      pageInfo = res.pageInfo
    //   CACHED.set('indexList', JSON.stringify({ list, pageInfo }))
    // }
    return {
      list,
      pageInfo
    };
  },
  data() {
    return {
      list: [],
      pageInfo: {}
    };
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
.artic-list {
  background-color: #fff;
  box-shadow: 0 0 4px #eee;
  border-radius: 2px;

  .artic-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: 0;
    }
  }

  .artic-info {
    flex: 1 1 auto;
  }

  .artic-cover {
    flex: 0 0 auto;
    width: 60px;
    height: 60px;
    margin-left: 30px;
    background-color: #f4f4f4;
    background-size: cover;
    border-radius: 2px;
  }

  .artic-meta {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #b2bac2;

    .meta-item {
      &::after {
        content: "·";
        margin: 0 5px;
        color: #b2bac2;
      }

      &:last-child::after {
        content: "";
      }
    }

    .post {
      color: #b71ed7;
    }

    .label {
      &::after {
        content: " / ";
      }

      &:last-child::after {
        content: "";
      }
    }
  }

  .artic-title {
    display: block;
    margin: 10px 0 16px;
    line-height: 1.2;
    font-size: 16px;
    font-weight: 700;
    color: inherit;
    text-decoration: none;

    &:hover{
      text-decoration: underline;
    }
  }

  .artic-action {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 13px;
    color: #b2bac2;

    .action-item {
      display: flex;
      align-items: center;
      height: 26px;
      padding: 0 10px;
      border: 1px solid #edeeef;

      .icon{
        margin-right: 3px;
      }

      &:last-child {
        border-left: 0;
      }
    }
  }
}
</style>
