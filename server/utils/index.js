exports.dealArticList = function (data_) {
  let data = {}
  let res = JSON.parse(data_)
  if(res.data && res.data.articleFeed){
    data.pageInfo = res.data.articleFeed.items.pageInfo
    // 获取文章id
    data.list = res.data.articleFeed.items.edges.map(item=>{
      let artic_id = item.node.originalUrl.split('/').pop()
      return {
        ...item.node,
        artic_id
      }
    })
  }else{
    data = res
  }
  return data
}