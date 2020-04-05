# 介绍

使用 Nuxt.js 仿站掘金，练手项目

# 完成
1. 文章展示
2. 文章筛选
3. 搜索
4. 详情页
5. 用户页
6. 用户消息页
7. 文章评论区
8. 文章相关信息（相关文章、推荐文章）

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
