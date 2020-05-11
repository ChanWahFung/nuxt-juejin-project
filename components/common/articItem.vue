<template>
  <div class="artic-item" @click="toDetail()">
    <div class="artic-item__info">
      <ul class="artic-item__meta">
        <li class="meta-item mate-item--hot" v-if="item.type === 'post' && item.hot">
          <span>荐</span>
        </li>
        <li class="meta-item mate-item--post" v-if="item.type === 'post'">
          <span>专栏</span>
        </li>
        <li class="meta-item">
          <span class="meta-item__username">
            <nuxt-link :to="'/user/'+uid" target="_blank" @click.native="(e) => e.stopPropagation()">{{ item.user.username }}</nuxt-link>
          </span>
        </li>
        <li class="meta-item">{{ item.createdAt | formatTime }}</li>
        <li class="meta-item">
          <span v-if="item.tags.length && item.category" class="meta-item__tag">
            <nuxt-link :to="'/tag?name='+item.tags[0].title" target="_blank" @click.native="(e) => e.stopPropagation()">{{ item.tags[0].title }}</nuxt-link>
          </span>
          <span v-else v-for="tag in item.tags.slice(0, 2)" :key="tag.id" class="meta-item__tag">
            <nuxt-link :to="'/tag?name='+tag.title" target="_blank" @click.native="(e) => e.stopPropagation()">{{ tag.title }}</nuxt-link>
          </span>
          <span v-if="item.category" class="meta-item__tag" :to="'/tag?name='+item.category.name" target="_blank">{{ item.category.name }}</span>
        </li>
      </ul>
      <p class="artic-item__title ellipsis" v-html="highlight.title || item.title"></p>
      <p v-if="hasDesc" class="artic-item__desc" v-html="highlight.description || highlight.text || item.content"></p>
      <ul class="artic-item__action">
        <li class="action-item" :class="{active: item[likeField]}" @click.stop="articleLike">
          <img v-if="item[likeField]" class="action-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan-active.930baa2.svg">
          <img v-else class="action-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg">
          {{ item[likeCountField] }}
        </li>
        <li class="action-item" @click.stop="toDetail('#comment')">
          <img class="action-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg">
          {{ item.commentsCount }}
        </li>
      </ul>
    </div>
    <div v-if="item.screenshot" class="artic-item__cover" :style="'background-image: url('+item.screenshot+')'"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    hasDesc: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 点赞状态和点赞数字段不一致  此处筛选出对应字段
    likeField() {
      let fields = ['isCollected', 'viewerHasLiked', 'liked']
      return fields.filter(key => this.item[key] == undefined ? false : key)[0]
    },
    likeCountField() {
      let fields = ['collectionCount', 'likeCount']
      return fields.filter(key => this.item[key] == undefined ? false : key)[0]
    },
    // 统一 uid值
    uid() {
      return this.item.user.id || this.item.user.objectId
    },
    detailId() {
      return this.item.originalUrl ? this.item.originalUrl.split('/').pop() : ''
    }
  },
  methods: {
    toDetail(hash = '') {
      let routeUrl = this.$router.resolve({
        name: 'detail-id',
        params: {
          id: this.detailId
        }
      })
      window.open(routeUrl.href + hash, '_blank')
    },
    async articleLike() {
      if (!this.$store.state.auth.token) {
        this.$loginModal(this)
        return
      }
      let id = this.item.id
      if (id && this.likeField && this.likeCountField) {
        let res = await this.$api.articleLike({
          entryId: id,
          isCollected: !this.item[this.likeField]
        })
        // 更新视图点赞状态
        if (res.s === 1) {
          this.$emit('update:item', {
            ...this.item, 
            [this.likeField]: !this.item[this.likeField],
            [this.likeCountField]: this.item[this.likeField] ? Number(this.item[this.likeCountField]) - 1 : Number(this.item[this.likeCountField]) + 1 
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.artic-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  cursor: pointer;

  &:hover{
    background: rgba(0,0,0,.01);
  }
}

.artic-item__info {
  flex: 1 1 auto;
  overflow: hidden;
}

.artic-item__cover {
  flex: 0 0 auto;
  width: 60px;
  height: 60px;
  margin-left: 30px;
  background-color: #f4f4f4;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 2px;
}

.artic-item__meta {
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

  .mate-item--hot{
    color: #f70;
  }

  .mate-item--post {
    color: #b71ed7;
  }

  .meta-item__username {
    cursor: pointer;

    &:hover{
      color: $theme;
    }
  }

  .meta-item__tag {
    cursor: pointer;

    &:hover{
      color: $theme;
    }

    &::after {
      content: " / ";
      color: #b2bac2;
    }

    &:last-child::after {
      content: "";
    }
  }
}

.artic-item__title {
  display: block;
  margin: 10px 0 16px;
  line-height: 1.2;
  font-size: 17px;
  font-weight: 700;
  color: inherit;
  text-decoration: none;

  &:hover{
    text-decoration: underline;
  }

  /deep/ em{
    color: #e8001c;
  }
}

.artic-item__desc {
  width: 800px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #5b6169;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  /deep/ em{
    color: #e8001c;
  }
}

.artic-item__action {
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

    .action-item__icon{
      margin-right: 3px;
    }

    &.active{
      color: $success;
    }

    &:last-child {
      border-left: 0;
    }
  }
}
</style>