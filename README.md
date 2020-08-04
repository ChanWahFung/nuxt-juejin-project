# 介绍

`nuxt-juejin-project` 是一个使用 `Nuxt.js` 仿写掘金的学习项目，主要使用 ：`nuxt` + `koa` + `vuex` + `axios` + `element-ui`。该项目所有数据与掘金同步，因为接口都是通过 `koa` 作为中间层转发（找接口真是个累活😅），重新定义接口路由以及对部分接口数据做处理。页面主要数据通过 `asyncData` 在服务端渲染。在写项目时我会尽可能的使用 `Nuxt.js` 提供的配置以及一些技术点（服务端渲染、接口转发、路由配置、权限验证等），希望借此更全面的学习服务端渲染项目的流程。

该项目是我初次使用 `Nuxt.js` 制作的，可能部分流程细节不够好。如果你想学习的话，建议只是用来参考，希望不要误导你。

# 温馨提示

掘金在2020年8月份重构更新后，旧版接口已被关闭。master分支为旧版本，新版本我已放到apinew分支下，如果需要查看，请克隆apinew分支。

# 功能

```
- 登录/登出

- 权限验证
  - 登录状态验证
  - 交互验证

- 首页
  - 文章筛选（分类、热门、最新、热榜）
  - 文章触底分页
  - 作者榜模块
  - 推荐小册模块

- 文章详情
  - 正文
  - 目录跳转
  - 文章评论
  - 文章分享
  - 相关推荐
  - 关于作者模块
  - 相关文章模块

- 作者页
  - 作者信息
  - 文章筛选（热门、最新）
  - 文章触底分页
  - 个人成就模块
  - 头像彩蛋😛

- 搜索
  - 类型筛选（综合、文章、标签、用户）
  - 时间筛选（全部、一天内、一周内、三月内）

- 沸点
  - 沸点筛选（推荐、热门、关注、分类）
  - 沸点触底分页
  - 沸点评论
  - 沸点分享
  - 大图预览
  - 推荐沸点模块
  - 关注的话题模块

- 话题
  - 关注的话题、全部话题
  - 文章筛选（热门、最新）
  - 文章触底分页
  - 话题详情模块
  - 参与者模块

- 标签
  - 标签详情 
  - 文章筛选（热门、最新、最热）
  - 文章触底分页

- 标签管理
  - 已关注标签、全部标签

- 消息
  - 用户消息

- 小册
  - 小册筛选（分类）

- i18n国际化

- 错误页
  - 404

- 交互相关
  - 点赞（文章、沸点）
  - 关注（作者、标签）
```

😶利用摸鱼时间更新中...

# 文件结构描述

为了快速的了解项目，在此对项目文件结构做出描述。

```
├─assets  // 存放静态资源（如：scss）
│
├─layouts // 页面主要布局、自定义错误页面
│
├─components  // 页面组件
│ ├─business  // 业务组件
│ ├─common    // 公用组件
│
├─middleware  // 应用中间件（如：权限验证）
│
├─mixins      // 公用逻辑抽离（如：触底事件）
│
├─pages       // 页面视图
│
├─plugins     // 插件（如：axios、api）
│
├─server      // 服务端
│ ├─middleware  // 服务端使用的中间件
│ ├─request     // 请求方法封装
│ ├─routes      // 接口转发
│
├─store       // vuex
│
├─utils       // 工具方法
│
│nuxt.config.js   // Nuxt.js应用配置
```

# 部分效果截图

* 首页

![](https://s1.ax1x.com/2020/05/10/Y39ysU.gif)

* 详情

![](https://s1.ax1x.com/2020/05/10/Y39Lod.gif)

* 搜索

![](https://s1.ax1x.com/2020/05/10/Y3CuOU.gif)

* 沸点

![](https://s1.ax1x.com/2020/05/10/Y3CxAJ.gif)

* 话题

![](https://s1.ax1x.com/2020/05/10/Y3C3k9.gif)

# 项目启动

``` bash
# 克隆项目
git clone https://github.com/ChanWahFung/nuxt-juejin-project.git

# 进入项目目录
cd nuxt-juejin-project

# 安装依赖
npm install

# 服务启动
npm run dev
```

访问 http://localhost:8000

# 补充

* 国内 github 克隆会比较慢，你可以选择从码云克隆 https://gitee.com/ChanWahFung/nuxt-juejin-project.git

# License

[MIT](https://github.com/ChanWahFung/nuxt-juejin-project/blob/master/LICENSE)
