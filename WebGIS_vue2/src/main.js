import Vue from 'vue'
import App from './App.vue'
import './main.css'
// import 'cesium/Widgets/widgets.css'
import router from './router'



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
