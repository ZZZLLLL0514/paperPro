<template>
  <div>
    <el-container>
      <el-aside v-permission="'dsg'" :width="this.$store.state.isCollapse?'64px':'200px'">
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="this.$store.state.isCollapse"
          >
            <h2>功能面板</h2>
            <el-submenu
              v-for="item in menuList"
              :index="item.label"
              :key="item.label"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span style="color: #9eefef; font-size: 20px">{{
                  item.label
                }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child"
                :index="child"
                @click="asideClick(child)"
                >{{ child }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
      <el-container class="container">
        <el-header v-permission="'dsg'" height="5vh">
          <common-header></common-header>
        </el-header>
        <el-main>
          <!-- <heatmap
              ref="main"
              :tableData="tableDatas"
              :drawerVisible.sync="vendorInfoVisible"
              :violatedrawerVisible.sync="violatedrawerVisible"
              :columnList="columnList"
              :drawerTitle="drawerTitle"
            ></heatmap> -->
          <keep-alive>
            <router-view
              ref="main"
              :tableData="tableDatas"
              :drawerVisible.sync="vendorInfoVisible"
              :isHeat.sync="isHeat"
              :violatedrawerVisible.sync="violatedrawerVisible"
              :columnList="columnList"
              :drawerTitle="drawerTitle"
            >
            </router-view>
          </keep-alive>
          <layer-manager v-show="this.$route.name=='map'" :prop-tree="layerTree" :checkeds="[1,2]"></layer-manager>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import commonAside from "./commonAside.vue";
import heatmap from "./heatmap.vue";
import { asideOperate } from "@/mixins/asideOperate";
import layerManager from "./layerManager.vue";
import commonHeader from "./commonHeader.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Main",
  components: { commonAside, heatmap, layerManager,commonHeader },
  mixins: [asideOperate],
  provide() {
    return {
      typeList: this.typeList,
    };
  },
  data() {
    return {
      menuList: [
        {
          label: "数据管理",
          icon: "el-icon-wallet",
          children: ["摊贩信息面板", "城管信息面板", "部门信息面板"],
        },
        {
          label: "数据统计",
          icon: "el-icon-date",
          children: ["摊贩统计"],
        },
        {
          label: "数据分析",
          icon: "el-icon-data-analysis",
          children: ["摊贩热点分析", "动态位置展示"],
        },
      ],
      columnList: [], //表格列
      vendorInfoVisible: false, //合法摊贩信息
      violatedrawerVisible: false, //违规摊贩信息
      tableDatas: [],
      typeList: [],
      drawerTitle: "", //抽屉标题
      isHeat: false, //记录是否在展示热力图
      layerTree: [
        {
          id: 1,
          label: "华农边界",
        },
        {
          id:2,
          label:"华农学生公寓"
        }
      ],
    };
  },
  methods: {
    handleClose() {},
    handleOpen() {},
    openDrawer(title, columnList, typeList, url) {
      //抽屉标题，表格头，类型数组
      this.vendorInfoVisible = true;
      this.drawerTitle = title;
      if (!this.$refs.main.filterPois.length) {
        this.$refs.main.currentPage = 1;
        $axios.get(url).then((res) => {
          let propertiesArr = [];
          res.data.allData.forEach((item) => {
            item.properties._id = item._id;
            item.properties.lngLat = item.geometry.coordinates;
            propertiesArr.push(item.properties);
          });
          this.$refs.main.totalPoi = res.data.totalPoi;
          this.$refs.main.gridData = propertiesArr;
          this.columnList = columnList;
          this.typeList.splice(0, this.typeList.length);
          typeList.forEach((item) => {
            this.typeList.push(item);
          });
        });
      }

      this.$nextTick(() => {
        this.$refs.main.loading = false;
      });
    },
    asideClick(item) {
      console.log("当前路由", this.$route);
      if (this.$route.name == "statistics"||this.$route.name==='userCenter') {
        this.$router.push({name:"map"});
        // this.$nextTick(() => {
        setTimeout(() => {
          this.switchFun(item);
        }, 300);

        // });
      } else {
        this.switchFun(item);
      }
    },
    switchFun(item) {
      switch (item) {
        case "摊贩热点分析":
          this.heatAnalysis();
          break;
        case "动态位置展示":
          this.DTdiplay(this.$store.state.minTime, this.$store.state.maxTime);
          break;
        case "摊贩信息面板":
          this.openDrawer(
            "摊贩信息面板",
            [
              {
                width: "85",
                label: "id",
                property: "id",
              },
              {
                width: "80",
                label: "类型",
                property: "type",
              },
              {
                width: "100",
                label: "日期",
                property: "date",
              },
              {
                width: "160",
                label: "地址",
                property: "addr",
              },
              {
                width: "80",
                label: "摊主",
                property: "name",
              },
            ],
            [
              "熟食小吃",
              "缝补维修",
              "水产肉类",
              "甜品饮料",
              "宠物销售",
              "蔬菜瓜果",
              "占道经营",
              "其他",
            ],
            "/poi_p/pagequery/1"
          );
          break;
        case "违规摊贩信息":
          let title = "违规摊贩信息";
          let column = [
            {
              width: "85",
              label: "id",
              property: "id",
            },
            {
              width: "80",
              label: "违规类型",
              property: "type",
            },
            {
              width: "100",
              label: "日期",
              property: "date",
            },
            {
              width: "150",
              label: "地址",
              property: "addr",
            },
            {
              width: "80",
              label: "处理人",
              property: "name",
            },
            {
              width: "160",
              label: "处理部门",
              property: "department",
            },
          ];
          let typeList = [
            "卫生问题",
            "违规占道",
            "制假售假",
            "叫卖扰民",
            "不合理定价",
            "其他",
          ];
          this.openDrawer(title, column, typeList, "/poi_p/violate/pagequery/1");
          break;
        case "城管信息面板":
          this.openDrawer(
            "城管信息面板",
            [
              {
                width: "85",
                label: "id",
                property: "id",
              },
              {
                width: "90",
                label: "姓名",
                property: "name",
              },
              {
                width: "90",
                label: "性别",
                property: "sex",
              },
              {
                width: "220",
                label: "部门",
                property: "department",
              },
            ],
            [],
            "/poi_p/urban/pagequery/1"
          );
          break;
        case "部门信息面板":
          this.openDrawer(
            "部门信息面板",
            [
              {
                width: "65",
                label: "id",
                property: "id",
              },
              {
                width: "140",
                label: "部门",
                property: "department",
              },
              {
                width: "170",
                label: "地址",
                property: "addr",
              },
              {
                width: "90",
                label: "区域",
                property: "region",
              },
            ],
            [],
            "/poi_p/departmentInfo/pagequery/1"
          );
          break;
        case "摊贩统计":
          this.$router.push({ name: "statistics" });
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
}
.el-header {
  // height: 12vh;
  // background-color: rgb(235, 231, 231);
  // background-image: url(../assets/image/header.jpg);
  // background-repeat: no-repeat;
  // background-size: 100%;
}
.el-aside {
  // background-color: aquamarine;
  transition :width 1s;
  .el-menu {
    height: 100%;
    border: none;

    h2 {
      color: #fff;
      text-align: center;
      line-height: 48px;
    }
  }
}
.el-main {
  padding: 0;
  overflow: overlay;
  position: relative;
  // overflow-x: scroll; /* 设置溢出滚动 */
  // white-space: nowrap;
}
</style>