<template>
    <div>
       <h1>auth.vue--> {{title}}</h1>
       <section>
        <b-modal :active.sync="isComponentModalActive">
          <div class="download-modal">
            <h1>写真をまとめてダウンロード</h1>
            <p>合計{{confirmMessage}}の写真をダウンロードします</p>
            <a class="button is-primary is-rounded" v-on:click="closeModal">Cancel</a>
            <a class="button is-primary is-rounded" v-on:click="bulkDownload">OK</a>
          </div>
        </b-modal>
        </section>
       <div class="container">
       <template v-for="image in images">
         <div v-bind:key="image.src" class="image-container">
           <div style="position: relative">
          <img v-bind:src="image.src" v-on:click="showFullImage(image)"/>
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
       <div id="download-button" >
       <a class="button is-primary is-rounded"
       v-on:click="downloadFiles">まとめてダウンロード</a>
       </div>
    <div id="loading-background" v-bind:class="{
      'display-none': !this.loading,
    }"><div class="loader">Loadking...</div></div>
    </div>
</template>

<script>
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/functions';

const MyConfirmMordal = {
        props: [],
        template: `<form action=""><div class="modal-card" style="width: 320px">
                    <section class="modal-card-body">
                    HOGE.. 
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" type="button" >Cancel</button>
                        <button class="button" type="button" >OK</button>
                    </footer>
                </div></form>`,
}

  export default {
    components: {
      'my-confirm-modal': MyConfirmMordal,
    },
    name: 'login-view',
    data: function () { return {
      title: 'hello',
      images: [],
      loading: false,
      isComponentModalActive: true,
    };
    },
    computed: {
      isStaredClass: function(image) {
          return {
            'mdi-star-outline': !image.stared,
            'mdi-star': image.stared,
          }
        },
      confirmMessage: function() {
        return this.images.filter(e => e.stared).length;
      }
    },
    methods: {
      handleStar: function (image) {
        console.log('star is clicked. %o', image)
        image.stared = !image.stared;
      },
      downloadFiles: function () {
        this.isComponentModalActive = true;
      },
      showFullImage: function (image) {
        this.loading = true;
        const storage = firebase.storage();
        var ref = storage.ref(image.path);
        ref.getDownloadURL().then(url => {
        console.log('url is ' + url);
        this.$modal.open(
                    `<p class="image">
                        <img src="${url}">
                    </p>`
         );
        this.loading = false;
        });
      },
      closeModal: function () {
        this.isComponentModalActive = false;
      },
      bulkDownload: function () {
        console.log('bulkDownload is called.');
        const bulkDownloadFunction = firebase.functions().httpsCallable('bulkDownload');
        bulkDownloadFunction({text: 'sample message'}).then((result) => {
          console.log(`result of cloud function: %o`, result);
        }).catch( error => {
          console.log('catch the error: %o', error);
        });
      },
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

    return;

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
  bottom: 4em;
  font-size: 1.5em;
  width: 100%;
  text-align: center;
}

.download-modal {
  height: 240px;
   border-radius: 10px;
   -webkit-border-radius: 10px;
   background-color: #ffffff;
}

#loading-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.86);
}

.display-none {
  display: none;
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 15em;
  height: 15em;
}
.loader {
  /* margin: 60px auto; */
  top: 50%;
  left: 50%;
  font-size: 10px;
  position: fix;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>