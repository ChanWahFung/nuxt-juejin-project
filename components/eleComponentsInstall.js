import { Input, Select, Option, Notification } from 'element-ui'

export default {
  install(Vue) {
    Vue.use(Input)
    Vue.use(Select)
    Vue.use(Option)
    Vue.prototype.$notify  = Notification
  }
}