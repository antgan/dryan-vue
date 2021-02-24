<template>
  <div>
    <el-form ref="loginForm" label-width="100px" class="login-box">
      <h3 class="login-title">燕教授库存管理后台</h3>
      <el-form-item label="用户名">
        <el-input type="text" placeholder="请输入用户名" v-model="username"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: ''
    }
  },
  methods: {
    onSubmit() {
      this.$axios.post(this.Const.SERVER_URL + `/user/login`, {"name": this.username})
        .then(resp => {
          if (resp.data['code'] == 0) {
            console.log( resp.data)
            this.Const.LOGIN_USER = resp.data.data
            console.log("success")
            this.$router.replace('/mainPanel')
          }else{
            this.$message.error('不存在该用户！')
          }
        });
    }
  }
}
</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 150px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>
