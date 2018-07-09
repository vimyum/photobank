<template>
    <div>
       <h1>auth.vue--> {{title}}</h1>
       <div class="container">
       <template v-for="image in images">
         <div v-bind:key="image.src" class="image-container">
           <div style="position: relative">
          <img v-bind:src="image.src"/>
          <span class="image-header" v-on:click="handleStar(image)">
           <i class="mdi yellow-star"
              v-bind:class="{
                'mdi-star-outline': !image.stared,
                'mdi-star': image.stared,
              }"
           ></i>
          </span>
          </div>
        </div>
       </template>
       </div>
       <a id="download-button" class="button is-primary is-rounded">ダウンロード</a>
    </div>
</template>

<script>
import firebase from 'firebase';
import 'firebase/auth';

  export default {
    name: 'login-view',
    data: function () { return {
      title: 'hello',
      images: [],
      stared: [],
    };
    },
    computed: {
      isStaredClass: function(image) {
          return {
            'mdi-star-outline': !image.stared,
            'mdi-star': image.stared,
          }
        },
    },
    methods: {
      handleStar: function (image) {
        console.log('star is clicked. %o', image)
        image.stared = !image.stared;
      },
      downloadFiles: function () {
        const targetImages = this.images.filter(image => image.stared);
        const text = `合計${targetImages.length}枚の写真をダウンロードします`;
      },
    },
    components: {
      // LoginForm,
    },
    created: function() {
      console.log('AuthView is mounted.');
      console.log('query is %o', this.$route.query);
      console.log('this title: %o', this.title);
      const user = firebase.auth().currentUser;
      console.log('current user: %o', user);
      
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
      if (!user) {
        firebase.auth().signInWithEmailAndPassword(q.mail, q.pass).then(result => {
            console.log('ログインしました')
          }).catch(function(error) {
          console.error(`failed to logn: ${error.code}, ${error.message}`);
        });
      }
    }

    var database = firebase.database();
    firebase.database().ref('/images/').once('value').then((snapshot) => {
      console.log('snapshot %o', snapshot.val());
      if (!snapshot.val()) {
        return;
      }

      const storage = firebase.storage();
      const images = snapshot.val();
      Object.keys(images).forEach(key => {
        const path = images[key].path;
        const thumbPath = images[key].thumbPath;
        var ref = storage.ref(thumbPath);
        ref.getDownloadURL().then(url => {
        console.log('url is ' + url);

        this.images.push({
          src: url,
          stared: false,
          path: path,
          thumbPath: thumbPath,
        });
      });
    });

    });
    }
  };
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
.image-container {
  margin: 2px;
  display: flex;
  align-items: center;
  text-align: left;
}

.image {
  position: relative;
}

.image-header {
  position: absolute;
  color: white;
  background-color: rgba(10, 10, 10, 0.7);
  height: 1.5rem;
  padding-left: 0.5em;
  width: 100%;
  top: 0px;
  left: 0px;
}

.yellow-star {
  color: #CCFF88;
}

#download-button {
  position: fixed;
  bottom: 1em;
  left: 50%;
}

</style>