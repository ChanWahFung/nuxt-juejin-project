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
      <p class="info__entry">
        <span class="info__type">{{ item.type | type }}：</span>
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
    type(val) {
      switch (val) {
        case 'collection':
          return '赞了'

        case 'pin-like': 
          return '赞了你的沸点'

        case 'comment':
          return '评论了'

        case 'pin-reply':
          return '回复了你在沸点里的评论'

        case 'pin-comment':
          return '回复了你的沸点'

        case 'comment-like':
          return '赞了你的评论'

        case 'pin-comment-like':
          return '赞了你的沸点评论'

        default:
          return ''
      }
    },
    content(item) {
      switch (item.type) {
        case 'collection':
          return item.entry.title

        case 'pin-like': case 'pin-comment':
          return item.pin.content

        case 'comment':
          return item.entry.title

        case 'pin-reply':
          return item.pinComment.content

        case 'comment-like':
          return item.comment.content

        case 'pin-comment-like':
          return item.pinComment.content

        default:
          return ''
      }
    },
    reply(item) {
      switch (item.type) {
        case 'comment':
          return item.comment.content

        case 'pin-reply':
          return item.pinReply.content

        case 'pin-comment': 
          return item.pinComment.content

        default:
          return ''
      }
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