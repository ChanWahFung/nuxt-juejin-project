<template>
  <div class="index">
    <div class="artic-list">
      <div v-for="item in list" :key="item.id" class="artic-item">
        <div class="artic-info">
          <ul class="artic-meta">
            <li class="meta-item post">专栏</li>
            <li class="meta-item">{{ item.author }}</li>
            <li class="meta-item">{{ item.create_time | formatTime }}</li>
            <li class="meta-item">
              <span v-for="(label, index) in item.labels" :key="index" class="label">{{ label }}</span>
            </li>
          </ul>
          <nuxt-link class="artic-title" to="/detail">{{ item.title }}</nuxt-link>
          <ul class="artic-action">
            <li class="action-item">
              <img class="icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg">
              {{ item.like_count }}
            </li>
            <li class="action-item">
              <img class="icon" src="https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg">
              {{ item.comment_count }}
            </li>
          </ul>
        </div>
        <div v-if="item.cover" class="artic-cover" :style="'background-image: url('+item.cover+')'"></div>
      </div>
    </div>
  </div>
</template>

<script>
import LRU from 'lru-cache'
const CACHED = new LRU({
  max: 100,
  maxAge: 1000 * 60
})
export default {
  async asyncData({ app }) {
    let list = {}
    if (CACHED.has('indexList')) {
      let data = CACHED.get('indexList')
      data = JSON.parse(data)
      list = data.list
    } else {
      const res = await app.$api.getIndexList();
      list = res.data
      CACHED.set('indexList', JSON.stringify({ list }))
    }
    return {
      list
    };
  },
  data() {
    return {
      list: []
    };
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.artic-list {
  background-color: #fff;
  box-shadow: 0 0 4px #eee;

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
    font-size: 14px;
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
    font-size: 20px;
    font-weight: 600;
    color: inherit;
    text-decoration: none;

    &:hover{
      text-decoration: underline;
    }
  }

  .artic-action {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #b2bac2;

    .action-item {
      display: flex;
      align-items: center;
      height: 26px;
      padding: 0 10px;
      border: 1px solid currentColor;

      &:last-child {
        border-left: 0;
      }
    }
  }
}
</style>
