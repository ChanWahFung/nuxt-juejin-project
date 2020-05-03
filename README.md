# 介绍

使用 Nuxt.js 仿掘金，使用技术 ：vue + vuex + koa + axios

爱掘金（超大声！！！）

# 完成功能

### 首页
  * 文章列表
  * 作者榜
  * 推荐小册

### 详情页
  * 内容展示
  * 目录
  * 评论列表
  * 关于作者
  * 相关文章
  * 相关推荐

### 用户页
  * 用户信息
  * 个人成就
  * 专栏

### 搜索页
  * 搜索列表

### 标签页
  * 文章列表

### 标签管理页
  * 标签列表

### 消息页
  * 消息列表

### 话题页
  * 话题列表

### 作者榜单
  * 榜单列表

### 小册页
  * 小册列表

### 沸点页
  * 沸点列表
  * 推荐沸点
  * 评论列表

### 交互相关
  * 文章点赞
  * 作者关注
  * 标签关注
  * 沸点点赞、分享


持续更新中...

# 使用

登录功能暂未做，需要手动创建 `/assets/authConfig.js`, 填入你在掘金的用户信息，用户信息可以打开掘金网站查看接口中的`header`或`query`

```js
export default {
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
