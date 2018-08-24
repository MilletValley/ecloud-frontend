<template>
  <div class="root">
    <el-row style="height: 140px; display: table-cell; vertical-align: middle;">
      <span class="login-header">
        <img src="../../assets/login-logo.png" class="login-img">
        信服E云
      </span>
    </el-row>
    <el-row :gutter="50">
      <!-- 轮播图 -->
      <el-col :span="14">
        <div class="block">
          <el-carousel style="width: 50%; padding-bottom: 30px;">
            <el-carousel-item v-for="item in [1,2]" :key="item">
              <img :src="`/static/scroll${item}.png`"
                  class="scroll-img">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <!-- 表单 -->
      <el-col :span="10">
        <el-form class="login-form"
                 :rules="rules"
                 :model="loginData"
                 ref="loginForm">
          <el-form-item label="登录账号："
                        class="login-name"
                        prop="loginName">
            <el-input v-model="loginData.loginName"></el-input>
          </el-form-item>
          <el-form-item label="登录密码："
                        class="login-pass"
                        prop="password">
            <el-input v-model="loginData.password"></el-input>
          </el-form-item>
          <el-form-item label="记住密码">
            <el-switch v-model="loginData.rememberMe"
                       :active-value="1"
                       :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="login-button"
                       @click="userLogin('loginForm')"
                       :loading="btnLoading">登&nbsp;&nbsp;录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        this.$message.warning('请输入密码')
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (value === '') {
        this.$message.warning('请输入账号')
      } else {
        callback()
      }
    }
    return {
      loginData: {
        loginName: '',
        password: '',
        rememberMe: 0
      },
      btnLoading: false,
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        loginName: [
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      token: state => state.base.token,
      userId: state => {
        if (state.base.userInfo) {
          return state.base.userInfo.id
        }
        return ''
      }
    })
  },
  methods: {
    ...mapActions(['loginForAll']),
    userLogin (loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.loginForAll(this.loginData)
            .then(res => {
              this.$message.success('登录成功')
              this.$router.push('/dashboard')
            })
            .catch(error => {
              this.$message.error(error)
            })
            .then(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>
<style scoped>
.root {
  background-image: url('../../assets/bg.jpg');
  background-size: 100% 100%;
  background-position: bottom left;
  background-repeat: no-repeat;
  height: 100%;
  overflow: hidden;
}
.el-carousel:first-child {
  margin: 0 auto;
}
.scroll-img {
  height: 100%;
  margin: 0 auto;
  display: block;
}
.login-header {
  font-size: 40px;
  color: #fff;
  display: inline-block;
  margin-top: 2px;
  font-family: 'LiSu';
}
.login-img {
  margin-left: 30px;
  margin-right: 3px;
  vertical-align: middle;
  display: inline-block;
  width: 120px;
}
.login-form {
  background-image: url('../../assets/lg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  display: block;
  width: 254px;
  height: 200px;
  padding:80px 48px 54px;
}
.el-form-item {
  margin: 0 auto;
}
.login-pass {
  margin: 10px 0 10px;
}
.el-input {
  width: 170px;
}
.login-button {
  width: 250px;
  margin: 0 auto;
  margin-top: 10px;
}
@media screen and (min-width: 1460px) {
  .login-form {
    width: 330px;
    height: 255px;
    margin-top: 30px;
  }
  .el-input {
    width: 234px;
  }
  .login-pass {
    margin: 20px 0 20px;
  }
  .login-button {
    margin-top: 20px;
    width: 318px;
  }
  .el-row:nth-child(2) {
    margin-top: 20px;
  }
  .block {
    height: 500px;
  }
}
</style>
<style>
.login-form .el-input .el-input__inner {
  height: 35px;
}
@media screen and (min-width: 1460px) {
  .root .el-carousel__container {
    height: 450px;
  }
  .login-form .el-input .el-input__inner {
    height: 40px;
  }
}
</style>
