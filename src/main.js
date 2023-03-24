import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import JwChat from 'jwchat';
import { Message } from 'element-ui';
import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu);
Vue.use(JwChat)
Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.prototype.$Message = Message
// Vue.prototype.baseUrl = 'http://www.test.com:8083/'
Vue.prototype.baseUrl = 'http://150.158.84.153/'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
