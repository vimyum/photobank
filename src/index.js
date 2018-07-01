import Vue from 'vue';
import App from './components/App.vue';
import VueRouter from 'vue-router'
import MainView from './views/main.vue';
import AuthView from './views/auth.vue';
import LoginView from './views/login.vue';
import NotFound from './views/notFound.vue';
import firebase from 'firebase';
// import firebase from 'firebase/app';
// import 'firebase/auth';
import config from '../firebase.secret';

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
Vue.use(Buefy)

firebase.initializeApp(config);

Vue.use(VueRouter)

const routes = [
  { path: '/', component: LoginView },
  { path: '/mlogin', component: AuthView, props: true },
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
