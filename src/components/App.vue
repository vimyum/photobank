<template>
  <div class="app">
    <h1>Hello Vue.js!</h1>
    <sub-component message="My Counter for Vue.js with Babel"></sub-component>
    <router-view />
  </div>
</template>

<script>
  import SubComponent from "./SubComponent.vue";
  export default {
    name: 'subapp',
    components: {
      SubComponent
    },
    mounted: function() {
      console.log('App is mounted.');
const email = 'sagaratoon@gmail.com';
   // firebase.auth().sendPasswordResetEmail(email);
   console.log('ログイン用のメールを送信しました。メール内のリンクをクリックしてログインしてください。');
    }
  };
</script>

<style scoped>
  h1 {
    font-weight: normal;
  }
  .app {
    text-align: center;
    font-family: 'Roboto', sans-serif;
  }
</style>