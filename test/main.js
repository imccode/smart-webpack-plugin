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
import App from './apps'

ReactDom.render(<App />, document.getElementById('root'))

// document.getElementById('root').textContent = '1234'