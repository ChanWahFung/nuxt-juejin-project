# 介绍

使用 Nuxt.js 仿站掘金，练手项目

# 完成

### 首页
  * 文章列表（筛选、分页）
  * 作者榜

### 详情页
  * 内容展示
  * 目录
  * 评论（分页）
  * 关于作者
  * 相关文章
  * 相关推荐（分页）

### 用户页
  * 用户信息
  * 个人成就
  * 专栏（筛选、分页）

### 搜索页
  * 搜索列表（按类型、按时间、分页）
 

持续更新中...

# 使用

创建 `server/request/config.js`, 填入你在掘金的用户信息，用户信息可以打开掘金网站查看接口中的`header`或`query`

```js
module.exports = {
  uid: '',
  deviceId: ''
  token: ''
}
```

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
