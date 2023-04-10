<template>
  <div class="userCenter">
    <el-card class="box-card-left">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button> -->
      </div>
      <img src="../assets/image/user.jpg" style="heigth:70px;width:70px;"></img>
      <el-descriptions class="margin-top" title="" :column="1" border>
        <!-- <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template> -->
        <el-descriptions-item v-for="item in userInfo" :key="item.value">
          <template slot="label">
            <i :class="item.icon"></i>
            {{ item.field }}
          </template>
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="basicInfo">
      <div slot="header" class="clearfix">
        <span>基本资料</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button> -->
      </div>
      <el-menu default-active="1" mode="horizontal" @select="userSelect">
        <el-menu-item index="1">基本资料</el-menu-item>
        <el-menu-item index="2">修改密码</el-menu-item>
      </el-menu>
      <el-form v-show="basicFormVisible" :model="userInfoForm" ref="userInfoForm" label-width="100px" class="demo-ruleForm" :rules="infoRules">
  <el-form-item
    :label="item.field"
    :prop="item.value"
    v-for="item in infoArr"
    :key="item.value"
  >
    <el-input v-model="userInfoForm[item.value]" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitBasic('userInfoForm')">提交</el-button>
  </el-form-item>
      </el-form>
      <el-form v-show="!basicFormVisible" :model="passwordForm" ref="passwordForm" label-width="100px" class="demo-ruleForm" :rules="passwordRules">
        <el-form-item
        label="旧密码"
        prop="password"
      >
        <el-input
          type="password"
          v-model="passwordForm.oldPassword"
          auto-complete="off"
          placeholder="请输入旧密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="password"
      >
        <el-input
          type="password"
          v-model="passwordForm.newPassword"
          auto-complete="off"
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="password"
      >
        <el-input
          type="password"
          v-model="passwordForm.confirmPassword"
          auto-complete="off"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitPassword('passwordForm')">提交</el-button>
  </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: [],
      infoArr: [
        { field: "姓名", value: "name" },
        { field: "部门", value: "department" },
        { field: "手机号", value: "phone" },
        { field: "邮箱", value: "mail" },
      ],
      userInfoForm: {
        name: "",
        deparment: "",
        phone: "",
        mail: "",
      },
      infoRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        department: [
          { required: true, message: "请输入部门", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        mail: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
      passwordRules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      basicFormVisible: true, //控制表单可见
    };
  },
  created() {
    let userInfo = sessionStorage.getItem("userInfo").split(",");
    this.userInfo = [
      { icon: "el-icon-s-custom", field: "账号", value: userInfo[0] },
      {
        icon: "el-icon-s-check",
        field: "用户名",
        value: userInfo[1],
      },
      {
        icon: "el-icon-s-management",
        field: "部门",
        value: userInfo[2],
      },
      { icon: "el-icon-mobile-phone", field: "手机号", value: userInfo[3] },
      { icon: "el-icon-message", field: "邮箱", value: userInfo[4] },
    ];
  },
  mounted() {},
  methods: {
    userSelect(index, pathIndex) {
      if (index == "1") {
        this.basicFormVisible = true;
      } else if (index == "2") {
        this.basicFormVisible = false;
      }
    },
    submitBasic(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            account: sessionStorage.getItem("account"),
            password: sessionStorage.getItem("password"),
            basicInfo: this.userInfoForm,
          };
          $axios({
            method: "get",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            url: "/poi_p/modifyinfo",
            // 只有params是可以传递参数的,未在express中引入bodyParser之前
            params: data,
          }).then((res) => {
            console.log(res.data);
          });
        }
      });
    },
    submitPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.userCenter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-top: 30px;
  .box-card-left {
    width: 38%;
  }
  .basicInfo {
    width: 60%;
  }
}
</style>