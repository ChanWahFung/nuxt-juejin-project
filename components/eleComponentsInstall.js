import { Input, Button, Select, Option, Notification, Message } from 'element-ui'

export default {
  install(Vue) {
    Vue.use(Input)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Button)
    Vue.prototype.$message = Message
    Vue.prototype.$notify  = Notification
  }
}