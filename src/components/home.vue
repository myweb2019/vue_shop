<template>
  <el-button type="primary" @click="logout">退出</el-button>
</template>

<script>
  export default {
    name: 'home',
    methods: {
      logout() {
        window.localStorage.clear();
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped>

</style>
