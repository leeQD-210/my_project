<template>
  <div>
    home组件
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout: function() {
      /* 清空浏览器存储的临时token */
      window.sessionStorage.clear()
      /* 跳转登录界面 */
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped></style>
