import Vue from 'vue'
import loginModal from './loginModal'

let componentInstance = null

let ModalConstructor = Vue.extend(loginModal)

function createModal() {
  componentInstance = new ModalConstructor()
  document.body.appendChild(componentInstance.$mount().$el)
}

function caller (ctx) {
  // 单例 全局只存在一个登录弹窗
  if (!componentInstance) {
    createModal()
    // 该show方法与组件内的show方法一致  传入的callback在组件销毁时调用
    // 由于手动挂载的组件无法获取原型上的方法 这里需要手动传入上下文ctx
    return componentInstance.show(ctx, () => { componentInstance = null })
  }
}

export default {
  install(Vue) {
    // 调起登录弹窗，方法返回Promise  then为登录成功  catch为关闭弹窗
    Vue.prototype.$loginModal = caller
  }
}