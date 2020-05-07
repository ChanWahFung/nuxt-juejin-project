import Vue from 'vue'
import loginModal from './loginModal'

let componentInstance = null

let ModalConstructor = Vue.extend(loginModal)

function createModal() {
  componentInstance = new ModalConstructor()
  document.body.appendChild(componentInstance.$mount().$el)
}

export default function () {
  // 单例 全局只存在一个登录弹窗
  if (!componentInstance) {
    createModal()
    // 该show方法与组件内的show方法一致  传入的callback在组件销毁时调用
    return componentInstance.show(vm => { componentInstance = null })
  }
}