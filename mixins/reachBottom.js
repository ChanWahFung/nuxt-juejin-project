export default {
  data() {
    return {
      _scrollingElement: null,
      _isReachBottom: false,
      reachBottomDistance: 80
    }
  },
  mounted() {
    this._scrollingElement = document.scrollingElement
    window.onscroll = () => {
      let scrollHeight = this._scrollingElement.scrollHeight
      let currentHeight = this._scrollingElement.scrollTop + this._scrollingElement.clientHeight + this.reachBottomDistance
      if (currentHeight < scrollHeight && this._isReachBottom) {
        this._isReachBottom = false
      }
      if (this._isReachBottom) {
        return
      }
      if (currentHeight >= scrollHeight) {
        this._isReachBottom = true
        typeof this.reachBottom === 'function' && this.reachBottom()
      }
    }
  }
}