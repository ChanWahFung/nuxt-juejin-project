export default {
  install(Vue) {
    // 批量注册公用组件
    const components = require.context('~/components/common', false, /\.vue$/)
    components.keys().map(path => {
      const fileName = path.replace(/(.*\/)*([^.]+).*/ig, "$2"); // 获取文件名
      let conpomentName = fileName.replace(/[A-Z]/g, match => "-" + match.toLowerCase()); // 转小驼峰
      if (conpomentName[0] === '-') { conpomentName = conpomentName.slice(1) }
      Vue.component(conpomentName, components(path).default || components(path))
    })
  } 
}