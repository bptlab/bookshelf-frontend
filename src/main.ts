import Vue from 'vue';
import Bookshelf from './Bookshelf.vue';
import router from './router';
import './registerServiceWorker';
import 'uikit/dist/css/uikit.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(Bookshelf),
}).$mount('#app');
