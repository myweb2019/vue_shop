<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登录表单区域-->
      <el-form class="login_form" :model="form" :rules="rules" ref="loginFormRef">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"
                    prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" size="small" @click="login">登录</el-button>
          <el-button type="info" size="small" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        //这是登录表单的数据绑定对象
        form: {
          username: 'admin',
          password: '123456'
        },
        //表单验证规则
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 12, message: '长度在 6 到 12 个数字', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //点击重置登录表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(async (valid) => {
          if (!valid) return;
          const {data: res} = await this.$http.post("login", this.form);
          if (res.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功');
          //1.登录成功后将token,保存到客户端sessionStorage中
          //后面的接口都需要带上token,token只有当网址打开时才能生效，所以存到sessionStorage
          window.sessionStorage.setItem('token',res.data.token);
          //跳转后台首页
          this.$router.push('home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avater_box {
      height: 80px;
      width: 80px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
