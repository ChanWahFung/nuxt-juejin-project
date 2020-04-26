## 配置端口
第一种：
`nuxt.config.js` :

``` js
export default {
    server: {
        port: 8000,
        host: '127.0.0.1'
    }
}
```

第二种：
`package.json` :

``` json
"config": {
  "nuxt": {
    "host": "127.0.0.1",
    "port": "8000"
  }
},
``` 

## plugins

`plugins` 作为全局注入的主要途径，关于一些使用的细节是必须要掌握的

### plugin函数参数

函数接收两个参数分别是 `context` 和 `inject` 

* context

上下文对象，该对象存储很多有用的属性。比如常用的 app 属性，包含所有插件的 Vue 根实例。例如：在使用 axios 的时候，你想获取 $axios 可以直接通过 context.app.$axios 来获取。详细属性介绍：[https://zh.nuxtjs.org/api/context](https://zh.nuxtjs.org/api/context)

* inject

该方法可以将 plugin 同时注入到 context ，Vue 实例， Vuex 中

### plugin调用

当 `plugin` 依赖于其他的 `plugin` 调用时，我们可以访问 `context` 来获取，前提是 `plugin` 需要使用 `context` 注入。

举个例子：封装了一个 `request` 的基础请求 `plugin` ，现在有一个接口 `plugin` 需要调用 `request` 

`plugins/request.js` 
```js
export default ({ app: { $axios } }, inject) => {
  inject('request', {
    get (url, params) {
      return $axios({
        method: 'get',
        url,
        params
      })
    }
  })
}
```

`plugins/api.js` 

``` js
export default ({
    app: {
        $request
    }
}, inject) => {
    inject('api', {
        getIndexList(params) {
            return $request.get('/list/indexList', params)
        }
    })
}
```

值得一提的是，在注册 `plugin` 时要注意顺序，就上面的例子来看， `request` 的注册顺序要在 `api` 之前

``` js
{
    plugins: [
        './plugins/axios.js',
        './plugins/request.js',
        './plugins/api.js',
    ]
}
```

## 全局挂载

有时您希望在整个应用程序中使用某个函数或属性值，此时，你需要将它们注入到 `Vue` 实例（客户端）， `context` （服务器端）甚至 `store(Vuex)` 。按照惯例，新增的属性或方法名使用`## 配置端口
第一种：
`nuxt.config.js` :

``` js
export default {
    server: {
        port: 8000,
        host: '127.0.0.1'
    }
}
```

第二种：
`package.json` :

``` json
"config": {
  "nuxt": {
    "host": "127.0.0.1",
    "port": "8000"
  }
},
``` 

## plugins

`plugins` 作为全局注入的主要途径，关于一些使用的细节是必须要掌握的

### plugin函数参数

函数接收两个参数分别是 `context` 和 `inject` 

* context

上下文对象，该对象存储很多有用的属性。比如常用的 app 属性，包含所有插件的 Vue 根实例。例如：在使用 axios 的时候，你想获取 $axios 可以直接通过 context.app.$axios 来获取。详细属性介绍：[https://zh.nuxtjs.org/api/context](https://zh.nuxtjs.org/api/context)

* inject

该方法可以将 plugin 同时注入到 context ，Vue 实例， Vuex 中

### plugin调用

当 `plugin` 依赖于其他的 `plugin` 调用时，我们可以访问 `context` 来获取，前提是 `plugin` 需要使用 `context` 注入。

举个例子：封装了一个 `request` 的基础请求 `plugin` ，现在有一个接口 `plugin` 需要调用 `request` 

`plugins/request.js` 
```js
export default ({ app: { $axios } }, inject) => {
  inject('request', {
    get (url, params) {
      return $axios({
        method: 'get',
        url,
        params
      })
    }
  })
}
```

`plugins/api.js` 

``` js
export default ({
    app: {
        $request
    }
}, inject) => {
    inject('api', {
        getIndexList(params) {
            return $request.get('/list/indexList', params)
        }
    })
}
```

值得一提的是，在注册 `plugin` 时要注意顺序，就上面的例子来看， `request` 的注册顺序要在 `api` 之前

``` js
{
    plugins: [
        './plugins/axios.js',
        './plugins/request.js',
        './plugins/api.js',
    ]
}
```

## 全局挂载

有时您希望在整个应用程序中使用某个函数或属性值，此时，你需要将它们注入到 `Vue` 实例（客户端）， `context` （服务器端）甚至 `store(Vuex)` 。按照惯例，新增的属性或方法名使用作为前缀

### 注入Vue实例

`plugins/vue-inject.js` 

``` js
import Vue from 'vue'

Vue.prototype.$myInjectedFunction = string => console.log('This is an example', string)
```

`nuxt.config.js` 

``` js
export default {
    plugins: ['~/plugins/vue-inject.js']
}
```

这样在所有 `Vue` 组件中都可以使用该函数

``` js
export default {
    mounted() {
        this.$myInjectedFunction('test')
    }
}
```

### 注入 context

`context` 注入方式和在其它 `vue` 应用程序中注入类似。

`plugins/ctx-inject.js` 

``` js
export default ({
    app
}, inject) => {
    // Set the function directly on the context.app object
    app.myInjectedFunction = string => console.log('Okay, another function', string)
}
```

`nuxt.config.js` 

``` js
export default {
    plugins: ['~/plugins/ctx-inject.js']
}
```

现在，只要您获得 `context` ，你就可以使用该函数（例如在 `asyncData` 和 `fetch` 中）

``` js
export default {
    asyncData(context) {
        context.app.myInjectedFunction('ctx!')
    }
}
```

### 同时注入

如果需要同时在 `context` ， `Vue` 实例，甚至 `Vuex` 中同时注入，可以使用 `inject` 方法，它是 `plugin` 导出函数的第二个参数。系统会自动将添加到方法名的前面。

`plugins/combined-inject.js` :

``` js
export default ({
    app
}, inject) => {
    inject('myInjectedFunction', string => console.log('That was easy!', string))
}
```

`nuxt.config.js` :

``` js
export default {
    plugins: ['~/plugins/combined-inject.js']
}
```

现在您就可以在 `context` ，或者 `Vue` 实例中的 `this` ，或者 `Vuex` 的 `actions` / `mutations` 方法中的 `this` 来调用 `myInjectedFunction` 方法

``` js
export default {
    mounted() {
        this.$myInjectedFunction('works in mounted')
    },
    asyncData(context) {
        context.app.$myInjectedFunction('works with context')
    }
}
```

`store/index.js` :

``` js
export const state = () => ({
    someValue: ''
})

export const mutations = {
    changeSomeValue(state, newValue) {
        this.$myInjectedFunction('accessible in mutations')
        state.someValue = newValue
    }
}

export const actions = {
    setSomeValueToWhatever({
        commit
    }) {
        this.$myInjectedFunction('accessible in actions')
        const newValue = 'whatever'
        commit('changeSomeValue', newValue)
    }
}
```

## 注册组件

`plugins/components.js` :

``` js
import Vue from 'vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
```

`nuxt.config.js` :

``` js
{
    css: [
        'element-ui/lib/theme-chalk/index.css'
    ],
    plugins: [
        './plugins/components.js'
    ]
}
```

## CSS预处理器

以 `scss` 为例子

### 安装

`node-sass` 源在国外，下载很容易失败，使用淘宝镜像下载解决

``` cmd
npm i sass-loader scss-loader --save--dev
npm i node-sass --save--dev sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

### 使用

无需配置，模板内直接使用

``` scss
<style lang="scss" scoped>
</style>
```

### 全局样式

`nuxt.config.js` :

``` js
{
    css: [
        './assets/scss/main.scss'
    ],
}
```

### 全局变量

为页面注入 变量 和 `mixin` 而且不用每次都去导入他们，可以使用 `@nuxtjs/style-resources` 来实现。

安装

``` cmd
npm i @nuxtjs/style-resources --save--dev
```

`nuxt.config.js` :

``` js
{
    modules: [
        '@nuxtjs/style-resources'
    ],
    styleResources: {
        scss: [
            './assets/scss/variable.scss'
        ]
    },
}
```

## Axios

### 安装
`Nuxt` 已为我们集成好 `@nuxtjs/axios` 

``` cmd
npm i @nuxtjs/axios --save--dev
```

`nuxt.config.js` :

``` js
{
    modules: [
        '@nuxtjs/axios'
    ],
}
```

### SSR使用Axios

服务器端获取并渲染数据， `asyncData` 方法可以在渲染组件之前异步获取数据，并把获取的数据返回给当前组件。第一个参数被设定为当前页面的上下文对象（ `context` ）。

``` js
export default {
    async asyncData(context) {
        let data = await context.app.$axios.get("test")
        return {
            list: data
        };
    },
    data() {
        return {
            list: []
        }
    }
}
```

### 非SSR使用Axios

这种使用方式就和我们平常一样

``` js
export default {
    data() {
        return {
            list: []
        }
    },
    async created() {
        let data = await this.$axios.get("test")
        this.list = data
    },
}
```

### 使用二次封装Axios

很多时候，我们都需要对 `axios` 做二次封装，这时可以通过配置 `plugins` 来引入。

`plugins/axios.js` :

``` js
export default function({
    app: {
        $axios
    }
}) {
    $axios.defaults.baseURL = 'http://127.0.0.1:8000/'
    $axios.onRequest(config => {
        return config
    })
    $axios.onError(error => {
        console.error(error)
    })
    $axios.interceptors.response.use(response => {
        let res = response.data
        if (res.code === 0) {
            return Promise.reject(res.msg)
        }
        return res
    })
}
```

`nuxt.config.js` :

``` js
{
    plugins: [
        './plugins/axios.js'
    ],
}
```

完成后，使用方式也和上面的一样，但是 `axios` 是使用我们二次封装过的。

## 缓存优化

接口缓存：

``` js
const CACHED = new LRU({
    max: 100, // 缓存队列长度
    maxAge: 1000 * 60 // 缓存时间
})
export default {
    async asyncData({
        app
    }) {
        let list = {}
        if (CACHED.has('indexList')) {
            let data = CACHED.get('indexList') // 获取缓存
            data = JSON.parse(data)
            list = data.list
        } else {
            const res = await app.$api.getIndexList();
            list = res.data
            CACHED.set('indexList', JSON.stringify({
                list
            }))
        }
        return {
            list
        };
    }
}
```


## 路由配置
在`Nuxt.js`中，路由是基于文件结构自动生成，无需配置

### 命名路由
在`Vue`中是这样配置命名路由的
```js
const router = new VueRouter({
  routes: [
    {
      path: '/users/:id',
      name: 'user',
      component: User
    }
  ]
})
```
`Nuxt.js`中需要创建对应的以下划线作为前缀的 `Vue` 文件 或 目录

以下面目录为例：
```
pages/
--| users/
-----| _id.vue
--| index.vue
```
自动生成的路由配置如下:
```js
router:{
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'users-id',
      path: '/users/:id?',
      component: 'pages/users/_id.vue'
    }
  ]
}
```

### 嵌套路由

以下面目录为例， 我们需要一级页面的`vue`文件，以及和该文件同名的文件夹（用于存放子页面）
```
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```
自动生成的路由配置如下:
```js
router: {
  routes: [
    {
      path: '/users',
      component: 'pages/users.vue',
      children: [
        {
          path: '',
          component: 'pages/users/index.vue',
          name: 'users'
        },
        {
          path: ':id',
          component: 'pages/users/_id.vue',
          name: 'users-id'
        }
      ]
    }
  ]
}
```

然后在一级页面中使用`<nuxt-child>`来显示子页面，就像使用`<router-view>`一样
```html
<template>
  <div>
    <nuxt-child />
  </div>
</template>
```