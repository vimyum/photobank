import Vue from 'vue';
import App from './components/App.vue';
// import lang from 'element-ui/lib/locale/lang/ja';
// import locale from 'element-ui/lib/locale';
//import 'element-ui/lib/theme-chalk/icon.css'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import MainView from './views/main.vue';
import AuthView from './views/auth.vue';
import LoginView from './views/login.vue';
import * as firebase from 'firebase/app';
import config from '../firebase.secret';
import 'element-ui/lib/theme-chalk/index.css';

firebase.initializeApp(config);

Vue.use(ElementUI);
Vue.use(VueRouter)

const routes = [
  { path: '/auth', component: AuthView },
  { path: '/main', component: MainView },
  { path: '/', component: LoginView }
]

const router = new VueRouter({
  routes // `routes: routes` の短縮表記
})

window.onload = function() {
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}
