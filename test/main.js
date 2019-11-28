// import Vue from 'vue'
// import App from './app.vue'

// const app = new Vue({
//   components: {
//     App
//   },
//   template: '<App/>'
// })

// app.$mount('#root')

import React from 'react'
import ReactDom from 'react-dom'
import App from './app.tsx'

ReactDom.render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./app.tsx', () => {
    const App = require('./app.tsx').default
    ReactDom.render(<App />, document.getElementById('root'))
  })
}
