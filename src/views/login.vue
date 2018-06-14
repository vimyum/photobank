<template>
    <div>
    <h1>This is a login window</h1>
    <login-form />
    </div>
</template>

<script>
  import LoginForm from "../components/LoginForm.vue";
  export default {
    name: 'login-view',
    components: {
      LoginForm,
    },
    mounted: function() {
      console.log('LoginView is mounted.');
    }
  };
</script>