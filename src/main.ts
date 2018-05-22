import Vue from 'vue';
import Bookshelf from './Bookshelf.vue';
import router from './router';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(Bookshelf),
}).$mount('#app');
