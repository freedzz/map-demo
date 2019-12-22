import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import VueAMap from 'vue-amap';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '921e2358541cba8c8f474c25b5dda5ff',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  uiVersion: '1.0', // ui库版本，不配置不加载,
  v: '1.4.4'
});



new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
