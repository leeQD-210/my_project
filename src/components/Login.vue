<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="login_form">
        <el-form status-icon class="demo-ruleForm" :model="form" :rules="rules" ref="loginForm">
          <el-form-item class="ipt_username" prop="username">
            <el-input type="text" prefix-icon="iconfont icon-Serviceusers" placeholder="请输入用户名" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="iconfont icon-password" placeholder="请输入密码" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button type="primary" @click="formValidate">提交</el-button>
            <el-button type="info" plain @click="formReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      /* 登录表单数据绑定对象 */
      form: {
        username: '',
        password: ''
      },
      /* 登录表单数据验证规则 */
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 12, message: '请输入2-12字符用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-16位密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formReset: function() {
      // console.log(this)
      // this中refs对象指向表单实例对象，名为上方定义loginForm
      /* element-ui中表单实例对象下有resetFields方法，可以重置表单数据 */
      this.$refs.loginForm.resetFields()
    },
    formValidate: function() {
      this.$refs.loginForm.validate(async valid => {
        /* 如果valid存在，表示验证成功 */
        if (!valid) return console.log('验证失败')
        /* 验证成功后，发送axios请求，这里因为在vue原型上用$http定义了axios，所以可以在所有组件中直接访问 */
        const { data: result } = await this.$http.post('/login', this.form)
        if (result.meta.status === 400) {
          /* element-ui提供message方法用来进行弹窗提示，这里以在vue原型全局配置 */
          return this.$message.error('用户名不存在或密码错误')
        } else {
          // console.log(result)
          /* 登录成功后向sessionStorage存储token，sessionStorage是短期会话存储，localStorage是长期本地存储 */
          window.sessionStorage.setItem('token', result.data.token)
          /* 弹出成功登陆窗 */
          this.$message.success('登录成功')
          /* 跳转home主页路由 */
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 550px;
  height: 350px;
  border-radius: 15px;
  background-color: #fff;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    left: 50%;
    width: 180px;
    height: 180px;
    border-radius: 200px;
    border: 15px solid #fff;
    overflow: hidden;
    transform: translate(-50%, -50%);
    background-color: #eee;
    box-shadow: 0 0 5px rgba(202, 200, 200, 0.822);
    text-align: center;
    vertical-align: middle;
    img {
      width: 150px;
      height: 150px;
    }
  }
  .login_form {
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 20px;
    .ipt_username {
      margin-bottom: 40px;
    }
    .login_btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
