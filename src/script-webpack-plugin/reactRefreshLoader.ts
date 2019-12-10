const ReactRefreshLoader = function(content) {
  this.cacheable()
  return content + '\nif (module.hot) module.hot.accept();'
}

export default ReactRefreshLoader
module.exports = ReactRefreshLoader
