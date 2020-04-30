<template>
  <div class="user-list-modal" v-show="visible">
    <div class="modal__close-btn" @click="closeUserListModal"></div>
    <div class="modal-main">
      <div class="modal-title">{{ title }}</div>
      <ul class="user-list">
        <li v-for="userItem in list" :key="userItem.uid">
          <nuxt-link class="user-item" :to="'/user/'+userItem.uid">
            <div class="user-item__avatar">
              <user-avatar :url="userItem.avatarLarge" :round="true"></user-avatar>
            </div>
            <div class="user-item__info">
              <div class="user-item__name">
                <span>{{ userItem.username }}</span>
                <level :level="userItem.level"></level>
              </div>
              <div class="user-item__job">
                {{ userItem.jobTitle }}
                {{ userItem.jobTitle && userItem.company ? ' @ ' : '' }}
                {{ userItem.company }}
              </div>
            </div>
            <div class="user-item__follow">
              <follow-btn :is-foloow="userItem.isFollowerFollowed" :followee-id="userItem.uid"></follow-btn>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '用户列表'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      _scrollTarget: 'component'
    }
  },
  watch: {
    visible(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : ''
    }
  },
  methods: {
    closeUserListModal() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.user-list-modal{
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: hsla(0,0%,100%,.96);
  overflow-y: auto;

  .modal__close-btn{
    position: fixed;
    top: 40px;
    right: 40px;
    width: 20px;
    height: 20px;
    cursor: pointer;

    &::before,
    &::after{
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 12px;
      background: #333;
    }

    &::before{
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &::after{
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  .modal-main{
    width: 540px;
    margin: 72px auto 48px;
  }

  .modal-title{
    margin-bottom: 36px;
    font-size: 24px;
    font-weight: 600;
    color: #393939;
    text-align: center;
  }

  .user-item{
    display: flex;
    align-items: center;
    padding: 30px;

    .user-item__avatar{
      width: 45px;
      height: 45px;
      margin-right: 20px;
    }

    .user-item__name{
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #393939;

      >span{
        margin-right: 3px;
      }
    }

    .user-item__job{
      margin-top: 10px;
      font-size: 12px;
      color: #b9c0c8;
    }

    .user-item__follow{
      margin-left: auto;
    }
  }
}
</style>