<template>
  <div class="notice-item shadow">
    <nuxt-link v-if="item.users[0]" class="notice-item__avatar" :to="`/user/${item.users[0].uid}`" target="_blank">
      <user-avatar :url="item.users[0].avatarLarge" :round="true"></user-avatar>
    </nuxt-link>
    <div class="notice-item__info">
      <div class="info__header">
        <nuxt-link v-if="item.users[0]" class="info__username" :to="`/user/${item.users[0].uid}`" target="_blank">{{ item.users[0].username }}</nuxt-link>
        <span v-if="item.count > 1" class="info__user-count">等 {{ item.count }} 人</span>
        <span v-if="item.count > 1" class="info__look-btn" @click="isShowUserList = !isShowUserList">查看列表</span>
      </div>
      <div class="info__meta">
        <span v-if="item.users[0]" class="info__job">
          {{ item.users[0].jobTitle }}
          {{ item.users[0].jobTitle && item.users[0].company ? ' @ ' : '' }}
          {{ item.users[0].company }}
          {{ item.users[0].jobTitle || item.users[0].company ? ' · ' : '' }}
        </span>
        <span class="info__time">{{ item.createdAtString | formatTime }}</span>
      </div>
      <p class="info__reply" v-if="item.type == 'comment' || item.type == 'pin-reply' || item.type == 'pin-comment'">{{ item | reply }}</p>
      <p class="info__entry ellipsis">
        <span class="info__type">{{ item | type }}:</span>
        <nuxt-link v-if="detailId" class="info__content" :to="'/detail/'+detailId" target="_blank">{{ item | content }}</nuxt-link>
        <nuxt-link v-else class="info__content" :to="'/pin/'+pinId" target="_blank">{{ item | content }}</nuxt-link>
      </p>
    </div>
    <template v-if="item.count > 1">
      <user-list-modal :list="item.users" :visible.sync="isShowUserList" title="用户列表"></user-list-modal>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isShowUserList: false
    }
  },
  computed: {
    detailId() {
      return this.item.entry.originalUrl ? this.item.entry.originalUrl.split('/').pop() : ''
    },
    pinId() {
      return this.item.pin.objectId
    }
  },
  filters: {
    type(item) {
      let typeDesc = {
        'collection': '赞了',
        'pin-like': '赞了你的沸点',
        'comment': item.reply.content ? '回复了你的评论' : '评论了',
        'pin-reply': '回复了你在沸点里的评论',
        'pin-comment': '回复了你的沸点',
        'comment-like': '赞了你的评论',
        'pin-comment-like': '赞了你的沸点评论',
      }
      return typeDesc[item.type] || ''
    },
    content(item) {
      let contentDesc = {
        'collection': item.entry.title,
        'pin-like': item.pin.content,
        'pin-comment': item.pin.content,
        'comment': item.reply.content ? item.comment.content : item.entry.title,
        'pin-reply': item.pinComment.content,
        'comment-like': item.comment.content,
        'pin-comment-like': item.pinComment.content,
      }
      return contentDesc[item.type] || ''
    },
    reply(item) {
      let replyDesc = {
        'comment': item.reply.content || item.comment.content,
        'pin-reply': item.pinReply.content,
        'pin-comment': item.pinComment.content
      }
      return replyDesc[item.type] || ''
    }   
  },
}
</script>

<style lang='scss' scoped>
.notice-item{
  display: flex;
  padding: 25px;
  background: #fff;

  .notice-item__avatar{
    width: 45px;
    height: 45px;
    margin-right: 15px;

    >img{
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .notice-item__info{
    flex: 1;
    overflow: hidden;

    .info__header{
      display: flex;
      align-items: center;

      .info__username{
        font-weight: 600;
        color: #2e3135;
        text-decoration: none;
      }

      .info__user-count{
        margin-left: 5px;
        font-size: 14px;
      }

      .info__look-btn{
        margin-left: auto;
        color: $theme;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .info__meta{
      padding: 8px 0;
      font-size: 14px;
      color: #8a9aa9;
    }

    .info__reply{
      font-size: 15px;
      padding-bottom: 8px;
      line-height: 1.3;
    }
  }

  .info__entry{
    padding: 10px;
    background: #f8f8f8;
    font-size: 15px;
    line-height: 1.3;

    .info__type{
      color: #999;
    }

    .info__content{
      color: #262626;
      cursor: pointer;

      &:hover{
        color: $theme;
      }
    }
  }
}
</style>