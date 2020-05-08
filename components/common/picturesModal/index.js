import Vue from 'vue'
import picturesModal from './picturesModal'

let componentInstance = null

let ModalConstructor = Vue.extend(picturesModal)

function createModal(options) {
  componentInstance = new ModalConstructor()
  // 合并选项
  Object.assign(componentInstance, options)
  document.body.appendChild(componentInstance.$mount().$el)
}

function caller (options) {
  // 单例 全局只存在一个登录弹窗
  if (!componentInstance) {
    createModal(options)
    // 该show方法与组件内的show方法一致  传入的callback在组件销毁时调用
    return componentInstance.show(() => { componentInstance = null })
  }
}

export default {
  install(Vue) {
    // 调起登录弹窗，方法返回Promise  then为登录成功  catch为关闭弹窗
    Vue.prototype.$picturesModal = caller
  }
}