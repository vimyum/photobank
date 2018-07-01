<template>
  <div class="app">
    <div><h1>App.vue</h1></div>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'subapp',
    mounted: function() {
      console.log('App is mounted.');
      const email = 'sagaratoon@gmail.com';
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
    display: flex;
  }
</style>