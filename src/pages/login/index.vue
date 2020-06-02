<template>
  <div class="content">
    <div class="loginBox">
      <h2 class="loginH2">网优大数据平台</h2>
      <div class="loginCon">
        <div class="titleDiv">
          <h3>账号登录</h3>
          <p>输入账号密码登录，有问题联系请管理员</p>
          <i class="el-icon-key"></i>
        </div>
        <el-form ref="loginForm" :rules="rules" :model="ruleForm">
          <el-form-item prop="user">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="ruleForm.user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="ruleForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="loginBtn"
            @click="loginYz('loginForm')"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifyObj: null,
      text: '向右滑动',
      showSlide: false,
//    ruleForm: {
//      user: 'admin',
//      password: '123456'
//    },
      ruleForm: {
        user: '',
        password: ''
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
  },
  methods: {
    onSuccess() {
      this.showSlide = false
      // this._login()
    },
    onFail() {
      this.$message.error('验证失败')
    },
    refresh() {
      this.$refs.slideDiv.reset()
    },
    loginYz(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          // this.showSlide = true
          this._login()
        } else {
          return
        }
      })
    },
    // _login() {
    //   this.$store
    //     .dispatch('user/_login', this.ruleForm)
    //     .then(res => {
    //       if (!res.data.success) {
    //         this.refresh()
    //       } else {
    //         this.$router.push(this.$route.query.redirect)
    //         if (this.notifyObj) {
    //           this.notifyObj.close()
    //         }
    //         this.notifyObj = null
    //       }
    //     })
    //     .catch(error => {
    //       this.refresh()
    //       this.$message.error(error)
    //     })
    // },
    _login() {
      this.$store
        .dispatch('user/_login', this.ruleForm)
        .then(res => {
          if (!res) {
            this.refresh()
          } else {
            this.$router.push({
              path: '/dashbord'
            })
          }
        })
        .catch(error => {
          this.refresh()
          this.$message.error(error)
        })
    }
  }
}
</script>
<style scoped lang="scss">
.login {
  height: 100%;
  width: 100%;
  // background: url(../../assets/pageBg/loginBg.jpg) no-repeat center center;
  // background-size: 100% 100%;
  overflow: hidden;
}
.loginBox {
  height: 455px;
  width: 450px;
  margin: 0 auto;
  position: absolute;
  z-index: 9;
  top: 50%;
  left: 50%;
  margin-top: -287px;
  margin-left: -225px;
}
.loginH2 {
  font-size: 38px;
  color: #fff;
  text-align: center;
}
.loginCon {
  margin-top: 30px;
  background: #eee;
  border-radius: 4px;
  .titleDiv {
    padding: 0 28px;
    background: #fff;
    position: relative;
    height: 120px;
    border-radius: 4px 4px 0 0;
    h3 {
      font-size: 22px;
      color: #555;
      font-weight: initial;
      padding-top: 23px;
    }
    p {
      font-size: 16px;
      color: #888;
      padding-top: 12px;
    }
    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
  }
  .el-form {
    padding: 25px 25px 30px 25px;
    background: #eee;
    border-radius: 0 0 4px 4px;
  }
}
.loginBtn {
  width: 100%;
  background: #19b9e7;
}
.slideShadow {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}
.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  i:last-child {
    margin-left: 7px;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}
.slideSty .slide-verify-slider {
  width: 100% !important;
}
.slideSty .slide-verify-refresh-icon {
  display: none;
}
</style>
