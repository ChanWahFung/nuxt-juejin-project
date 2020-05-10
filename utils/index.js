module.exports = {
  /**
   * json 转 object
   * @param {json} json 
   */
  toObject(json) {
    let res = {}
    try {
      res = JSON.parse(json)
    } catch (error) {
      console.error(error)
    }
    return res
  }
}