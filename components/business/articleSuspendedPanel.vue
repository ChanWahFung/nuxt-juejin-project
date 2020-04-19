<template>
  <div class="article-suspended-panel">
    <ul class="btn-list">
      <li class="panel-btn panel-btn-count" :class="[isLike ? 'panel-like-btn--active' : 'panel-like-btn']" @click="$emit('setgood-handler')" :data-count="likeCount">
      </li>
      <li class="panel-btn panel-comment-btn panel-btn-count" @click="scrollIntoComment" :data-count="commentCount">
      </li>
      <li class="panel-btn panel-collect-btn">
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    isLike: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ])
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    scrollIntoComment() {
      let offsetTop = document.querySelector('.detail-block .comment-area').offsetTop
      window.scrollTo({
        top: offsetTop + (this.isTopbarBlock ? -80 : 0)
      })
    }
  },
}
</script>

<style lang='scss' scoped>
.article-suspended-panel{
  position: fixed;
  top: 200px;
  left: 120px;

  .panel-btn{
    position: relative;
    width: 36px;
    height: 36px;
    margin-bottom: 12px;
    border-radius: 50%;
    background-color: #fff;
    background-repeat: no-repeat;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.04);
    cursor: pointer;

    &.panel-like-btn{
      background-position: 53% 46%;
      background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan.b4bb964.svg);

      &:hover{
        background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan-hover.91657d6.svg);
      }
    }

    &.panel-comment-btn{
      background-position: 50% 55%;
      background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/comment.7fc22c2.svg);

      &:hover{
        background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/comment-hover.1074e67.svg);
      }
    }

    &.panel-collect-btn{
      background-position: 50%;
      background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/collect.1db122b.svg);

      &:hover{
        background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/collect-hover.5d446a7.svg);
      }
    }

    &.panel-btn-count:after{
      content: attr(data-count);
      position: absolute;
      top: 0;
      left: 75%;
      padding: 1px 4px;
      font-size: 12px;
      text-align: center;
      line-height: 1;
      white-space: nowrap;
      color: #fff;
      background-color: #b2bac2;
      border-radius: 8px;
      transform-origin: left top;
      transform: scale(.75);
    }

    &.panel-like-btn--active{
      background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan-active.337b9a0.svg);

      &:after{
        color: #fff;
        background-color: $lighSuccess;
      }
    }
  }
}
</style>