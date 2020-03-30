import Vue from 'vue'
import ElementUI from 'element-ui'
import * as utils from '../utils'

Vue.prototype.$utils = utils
Vue.use(ElementUI)

// 批量注册公用组件
const components = require.context('../components/common', false, /\.vue$/)
components.keys().map(path => {
  const fileName = path.replace(/(.*\/)*([^.]+).*/ig, "$2"); // 获取文件名
  const conpomentName = fileName.replace(/[A-Z]/g, match => "-" + match.toLowerCase()); // 转小驼峰
  Vue.component(conpomentName, components(path).default || components(path))
})

Vue.filter('formatTime', d => utils.formatTime(d))