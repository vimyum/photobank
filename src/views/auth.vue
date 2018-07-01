<template>
    <h1>This is a auth window</h1>
</template>

<script>
import firebase from 'firebase';
import 'firebase/auth';
  export default {
    name: 'login-view',
    components: {
      // LoginForm,
    },
    mounted: function() {
      console.log('AuthView is mounted.');
      console.log('query is %o', this.$route.query);
      const q = this.$route.query;

      if(q.mode == 'resetPassword') {
        firebase.auth().verifyPasswordResetCode(q.oobCode).then(function(email) {
          var newPassword = Math.random().toString(36).slice(-12)
          firebase.auth().confirmPasswordReset(q.oobCode, newPassword).then(function(){
            firebase.auth().signInWithEmailAndPassword(email, newPassword)
            console.log('ログインしました')
          })
        }).catch(function(error){
          console.log('ログインに失敗しました..')
        })
      }

      if(q.mode == 'dlogin') { // only for local development.
      const user = firebase.auth().currentUser;
      console.log('current user: %o', user);
      if (!user) {
        firebase.auth().signInWithEmailAndPassword(q.mail, q.pass).then(result => {
            console.log('ログインしました')
          }).catch(function(error) {
          console.error(`failed to logn: ${error.code}, ${error.message}`);
        });
      }
    }

    }
  };
</script>

<style scoped>
</style>