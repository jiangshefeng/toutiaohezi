<template>
  <div class="login_content">
    <div class="login_title"></div>
    <el-form class="login_form" ref="formName" :model="user" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input prefix-icon="el-icon-phone" v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input prefix-icon="el-icon-message" v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我以阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loginLoading"
          class="login_btn"
          type="primary"
          @click="onLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  name: 'login',
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },

      loginLoading: false,
      formRules: {
        mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin() {
      this.$refs['formName'].validate(async valid => {
        if (!valid) {
          return false
        }
        await login.call(this)
      })
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
.login_content {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url('./login_2.jpg') no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .login_title {
    background: url('./login_tp.jpg') no-repeat;
    width: 480px;
    height: 145px;
    background-size: cover;
  }
  .login_form {
    padding: 40px;
    background-color: white;
    min-width: 480px;
  }
}

.login_btn {
  width: 100%;
}
</style>
