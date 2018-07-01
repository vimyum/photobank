import Vue from 'vue';
import App from './components/App.vue';
import VueRouter from 'vue-router'
import MainView from './views/main.vue';
import AuthView from './views/auth.vue';
import LoginView from './views/login.vue';
import NotFound from './views/notFound.vue';
import * as firebase from 'firebase/app';
import config from '../firebase.secret';

firebase.initializeApp(config);

Vue.use(VueRouter)

const routes = [
  { path: '/', component: LoginView },
  { path: '/mlogin', component: AuthView },
  { path: '/main', component: MainView },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

window.onload = function() {
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}