<template>
  <div>
    <h2>{{message}}</h2>
    <p>{{count}}</p>
    <p>
      <button @click="onClick">Add +1</button>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Activity name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <el-button>Default</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'sub-component',
    data(){
      return {
        count: 0,
        datetime: '',
        form: {
          name: 'hoge'
        }
      }
    },
    props: ['message'],
    methods: {
      onClick() {
        console.log('クリックされました');
        this.count = this.count + 1;
      }
    }
  };
</script>

<style scoped>
  h2 {
    font-weight: normal;
    font-size: 1.25rem;
  }
</style>