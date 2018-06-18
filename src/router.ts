import Vue from 'vue';
import Router, { Route } from 'vue-router';
import Booklist from './views/Booklist.vue';
import Bookwish from './views/Bookwish.vue';
import Login from './views/Login.vue';
import Admin from '@/views/Admin.vue';
import Authentification from '@/apis/Authentification';

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
      path: '/admin',
      component: Admin,
      beforeEnter: requireAuth,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/logout',
      beforeEnter(to, from, next) {
        Authentification.logout();
        next('/');
      },
    },
  ],
});

function requireAuth(to: Route, from: Route, next: any) {
  if (!Authentification.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}
