<template>
  <header>
    <div class="l-content">
      <el-button
        v-show="!this.$store.state.isHeat"
        @click="handleMenu"
        plain
        :icon="
          this.$store.state.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
        "
        size="medium"
      ></el-button>
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb> -->
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span>
          <img class="user" :src="userImg" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-show="centerVisible == 'true'"
            @click.native="enterUserCenter"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item @click.native="logout">{{
            centerVisible == "true" ? "退出" : "登录"
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
// import {mapState} from 'vuex'
import Cookie from "js-cookie";
export default {
  data: () => {
    return {
      userImg: require("../assets/image/user.jpg"),
      centerVisible: sessionStorage.getItem("isSignIn"),
    };
  },
  mounted() {},
  computed: {
    // ...mapState({
    //     tags:state => state.tab.tabList
    // })
  },
  methods: {
    handleMenu() {
      this.$store.commit("collapseMenu");
    },
    logout() {
      if (this.centerVisible == "true") {
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("isSignIn");
        this.$store.commit("addUserInfo", {});
        Cookie.remove("token");
      }
      this.$router.push("login");
    },
    enterUserCenter() {
      this.$router.push({ name: "userCenter" });
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.r-content {
  cursor: pointer;
  height: 5vh;
  .user {
    width: 5vh;
    height: 5vh;
    border-radius: 50%;
  }
}
</style>