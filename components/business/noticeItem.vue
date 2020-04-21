<template>
  <div class="notice-item shadow">
    <nuxt-link v-if="item.users[0]" :to="`/user/${item.users[0].uid}`" class="notice-item__avatar">
      <user-avatar :url="item.users[0].avatarLarge" :round="true"></user-avatar>
    </nuxt-link>
    <div class="notice-item__info">
      <nuxt-link class="info__username" v-if="item.users[0]" :to="`/user/${item.users[0].uid}`">{{ item.users[0].username }}</nuxt-link>
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
        <span class="info__content" @click="toDetail(item.entry.originalUrl)">{{ item | content }}</span>
      </p>
    </div>
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
  methods: {
    toDetail(originalUrl) {
      if (!originalUrl) { 
        return 
      }
      let href = originalUrl.includes('juejin') ? `/detail/${originalUrl.split('/').pop()}` : originalUrl
      window.open(href, '_blank', 'noopener noreferrer')
    }
  }
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

    .info__username{
      font-weight: 600;
      color: #2e3135;
      text-decoration: none;
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