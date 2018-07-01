<template>
<div class="container">
    <form ref="form" :model="form" label-width="240px">
    <p class="control has-icons-left has-icons-right">
    <input v-model="form.email" class="input" type="email" placeholder="Email">
    <span class="icon is-small is-left">
      <i class="mdi mdi-email-outline"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-check"></i>
    </span>
  </p>
      </form>
      <button class="button is-link is-outlined is-rounded" 
        v-bind:disabled="isValidMailAddr" v-on:click="onClick">ログインメールを送る</button>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

const MailCheck = (mail) => {
    var mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
    var mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
    if( mail.match( mail_regex1 ) && mail.match( mail_regex2 ) ) {
        if( mail.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) { return false; }
        if( !mail.match( /\.[a-z]+$/ ) ) { return false; }
        return true;
    } else {
        return false;
    }
}

export default {
  name: 'login-form',
   data () {
      return {
        form: {
          email: ''
        }
      };
   },
   computed: {
     isValidMailAddr: function() {
       return !MailCheck(this.form.email);
     },
   },
   methods: {
      onClick() {
        console.log(`send email to ${this.form.email}`);
        firebase.auth().sendPasswordResetEmail(this.form.email);
        console.log('ログイン用のメールを送信しました。メール内のリンクをクリックしてログインしてください。');
      },
   },
}
</script>

<style scoped>
.container {
    display: flex;
}
  .box-card {
    display: flex;
    justify-content: center;
    width: 80%;
  }
</style>