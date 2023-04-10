<template>
  <div class="container">
    <el-form
      :model="form"
      status-form
      :rules="rules"
      ref="form"
      label-width="100px"
      class="login-container"
    >
      <h3 class="login-title">华农周边流动摊贩管理系统</h3>
      <el-form-item
        label="用户名"
        label-width="80px"
        prop="account"
        class="account"
      >
        <el-input
          type="input"
          v-model="form.account"
          auto-complete="off"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        label-width="80px"
        prop="password"
        class="password"
      >
        <el-input
          type="password"
          v-model="form.password"
          auto-complete="off"
          placeholder="请输入密码"
          @change="login"
        ></el-input>
      </el-form-item>
      <el-form-item class="login-submit">
        <el-button
          :icon="isLogin ? 'el-icon-loading' : ''"
          type="primary"
          @click="login"
          >{{ isLogin ? "登录中" : "登录" }}</el-button
        >
      </el-form-item>
      <el-link type="primary" @click="noLogin">普通浏览 </el-link>
    </el-form>

    <router-view></router-view>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import Qs from "qs";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "login",
  data() {
    return {
      form: {
        account: "",
        password: "",
      },

      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            message: "账号长度不能小于3位",
            trigger: "blur",
          },
        ],

        password: [{ required: true, message: "请输入密码", trigger: blur }],
      },
      isLogin: false,
    };
  },
  created() {
    if (sessionStorage.getItem("isSignIn") == "true") {
      this.form.account = sessionStorage.getItem("account");
      this.form.password = sessionStorage.getItem("password");
    }
  },
  methods: {
    login() {
      this.isLogin = true;
      let { account, password } = this.form;
      let params = new FormData();
      params.append("account", account);
      params.append("password", password);
      let url = `/login_p?account=${account}&password=${password}`;
      $axios.get(url).then((res) => {
        this.$nextTick(() => {
          this.isLogin = false;
        });
        let status = res.data.meta.msg;
        if (status == "success") {
          sessionStorage.setItem("isSignIn", "true");
          sessionStorage.setItem("account", res.data.user[0].account);
          sessionStorage.setItem("password", res.data.user[0].password);
          sessionStorage.setItem(
            "userInfo",
            `${res.data.user[0].account},${res.data.user[0].name},${res.data.user[0].department},${res.data.user[0].phone},${res.data.user[0].mail}`
          );
          this.$store.commit("addUserInfo", res.data.user[0]);
          Cookie.set("token", res.data.user.token);
          this.$router.push({ name: "map" });
        } else {
          this.$message.error("登录失败，请检测密码或账号是否正确");
        }
      });
    },
    noLogin() {
      this.$router.replace({ name: "map" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/image/scau.jpg);
  background-repeat: no-repeat;
  background-size: 100%;
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    padding: 35px 35px 15px 35px;
    background-color: rgba($color: #ffffff, $alpha: 0.5);
    border: 1px solid #eaeaea;
    // box-shadow: 0 0 25px #cac6c6;
    .el-link {
      margin-left: 145px;
      font-size: 15px;
      color: #000;
    }
  }

  .login-title {
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login-submit {
    display: flex;
    justify-content: center;
    margin-right: 100px;
  }
}
</style>