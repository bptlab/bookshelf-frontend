import Vue from 'vue';
import Router from 'vue-router';
import Booklist from './views/Booklist.vue';
import Bookwish from './views/Bookwish.vue';
import About from './views/About.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'booklist',
      component: Booklist,
    },
    {
      path: '/wish',
      name: 'wish',
      component: Bookwish,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
});
