<template>
  <div class="pictures-modal-container">
    <div v-show="isShowPrev" class="arrow prev-arrow" @click="prev"></div>
    <div v-show="isShowNext" class="arrow next-arrow" @click="next"></div>
    <div class="cancel-btn" @click="cancel"></div>
    <div class="picture-index">{{ currentIndex+1 }} / {{ urls.length }}</div>
    <div class="picture">
      <img :src="currentUrl" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '',  // 当前图片链接
      urls: ''  // 图片链接数组
    }
  },
  computed: {
    currentUrl() {
      return this.url || this.urls[0]
    },
    currentIndex() {
      return this.urls.indexOf(this.currentUrl)
    },
    isShowPrev() {
      if (this.urls.length <= 1) {
        return false
      }
      return this.currentIndex > 0
    },
    isShowNext() {
      if (this.urls.length <= 1) {
        return false
      }
      return this.currentIndex < this.urls.length - 1
    },
  },
  methods: {
    show(cb) {
      this.cb = cb
      return new Promise((resolve, reject) => {
        document.body.style.overflow = 'hidden'
        this.resolve = resolve
        this.reject = reject
      })
    },
    // 销毁弹窗
    hideModal() {
      typeof this.cb === 'function' && this.cb()
      document.body.removeChild(this.$el)
      document.body.style.overflow = ''
      this.$destroy()
    },
    cancel() {
      this.reject()
      this.hideModal()
    },
    prev() {
      this.url = this.urls[this.currentIndex - 1]
    },
    next() {
      this.url = this.urls[this.currentIndex + 1]
    }
  }
}
</script>

<style lang='scss' scoped>
.pictures-modal-container{
  z-index: 1100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #222;

  .picture{
    max-width: 90vw;

    >img{
      max-width: 100%;
      max-height: 100vh;
    }
  }

  .picture-index{
    position: absolute;
    bottom: 1%;
    left: 50%;
    color: #fff;
    transform: translateX(-50%);
  }

  .cancel-btn{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(105, 105, 105, 0.2);
    transition: .2s;
    border-radius: 50%;
    cursor: pointer;

    @mixin line(){
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 40%;
      background-color: #999;
    }

    &::before{
      @include line;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    
    &::after{
      @include line;
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &:hover{
      transform: rotate(-90deg);
    }
  }

  .arrow{
    position: absolute;
    top: 0;
    width: 30vw;
    height: 100vh;
  }

  .prev-arrow{
    left: 0;
    cursor: url(https://b-gold-cdn.xitu.io/v3/static/img/left.906c5c1.cur),auto;
  }

  .next-arrow{
    right: 0;
    cursor: url(https://b-gold-cdn.xitu.io/v3/static/img/right.6275260.cur),auto;
  }
}
</style>