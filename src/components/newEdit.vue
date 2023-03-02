<template>
  <div>
    <el-dialog
      :title="isNewAdd ? '新增摊贩' : '编辑摊贩信息'"
      :visible.sync="newAddDialogVisible"
      :before-close="newAddClose"
    >
      <el-form
        ref="newAddForm"
        inline
        size="mini"
        :rules="drawerTitle == '摊贩信息面板' ? legalRules : WFRules"
        label-width="80px"
        :model="newAddForm"
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="newAddForm.type" placeholder="请选择一个类型">
            <el-option
              v-for="item in typeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="id">
          <el-col :span="24">
            <el-input
              v-model="newAddForm.id"
              placeholder="请输入编号"
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-col :span="24">
            <el-date-picker
              v-model="newAddForm.date"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item prop="addr" label="地址">
          <el-input
            v-model="newAddForm.addr"
            placeholder="请输入地址"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="lngLat" label="经纬度">
          <el-input
            v-model="newAddForm.lngLat"
            placeholder="输入经纬度,如113.34923,23.158"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名字">
          <el-input
            v-model="newAddForm.name"
            placeholder="请输入名字"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="newAddForm.hasOwnProperty('department')"
          prop="department"
          label="部门"
        >
          <el-input
            v-model="newAddForm.department"
            placeholder="请输入部门"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button size="mini" type="primary" @click="pickUp">拾取</el-button>
      <div id="pickMap"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClick">取 消</el-button>
        <el-button type="primary" @click="submitpoi('newAddForm')"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "newEdit",
  props: {
    newAddDialogVisible: {
      default: false,
    },
    isNewAdd: Boolean,
    newAddForm: Object,
    currentPage: Number,
    gridData: Array,
    filterPois: Array,
    isFilter: Boolean,
    drawerTitle: String,
  },
  inject: ["typeList"],
  data() {
    return {
      legalRules: {
        type: [{ required: true, message: "请输入类型", trigger: "change" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        date: [{ required: true, message: "请输入日期", trigger: "change" }],
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        addr: [{ required: true, message: "请输入地址", trigger: "blur" }],
        lngLat: [{ required: true, message: "请输入经纬度", trigger: "blur" }],
      },
      WFRules: {
        type: [{ required: true, message: "请输入类型", trigger: "change" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        date: [{ required: true, message: "请输入日期", trigger: "change" }],
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        addr: [{ required: true, message: "请输入地址", trigger: "blur" }],
        lngLat: [{ required: true, message: "请输入经纬度", trigger: "blur" }],
        department: [
          { required: true, message: "请输入部门", trigger: "blur" },
        ],
      },
      pickMap: null,
    };
  },
  mounted() {},
  methods: {
    pickUp() {
      //   this.$nextTick(() => {
      console.log("到底也没有1", document.getElementById("map1"));

      this.pickMap = new mapboxgl.Map({
        container: document.getElementById("pickMap"), //容器id
        crs: "EPSG:4326",
        center: [113.3510703661961, 23.15997477686446], // starting position
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        zoom: 14, //地图等级
        maxZoom: 22, //最大等级
        attributionControl: false,
      });
      let geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: "zh-Hans", // Specify the language as German.
        mapboxgl: mapboxgl,
      });
      this.pickMap.addControl(geocoder);
      geocoder.on("result", (e) => {
        console.log("解析结果", e);
        this.newAddForm.lngLat = [e.lngLat.lng, e.lngLat.lat];
      });
      let language = new MapboxLanguage({ defaultLanguage: "zh-Hans" });
      this.pickMap.addControl(language);
      this.pickMap.getCanvas().style.cursor = "crosshair";
      this.pickMap.on("click", this.pickLocation);
      //   });
    },
    pickLocation(e) {
      let location = [e.lngLat.lng, e.lngLat.lat];
      this.newAddForm.lngLat = location;
    },
    newAddClose() {
      //新增摊贩信息弹出框关闭回调
      this.$emit("update:newAddDialogVisible", false);
      if (this.newAddForm.date)
        this.newAddForm.date =
          this.newAddForm.date.getFullYear() +
          "-" +
          (this.newAddForm.date.getMonth() + 1) +
          "-" +
          this.newAddForm.date.getDate();
      this.pickMap = null;
    },
    cancelClick() {
      this.$emit("update:newAddDialogVisible", false);
      if (this.newAddForm.date)
        this.newAddForm.date =
          this.newAddForm.date.getFullYear() +
          "-" +
          (this.newAddForm.date.getMonth() + 1) +
          "-" +
          this.newAddForm.date.getDate();
      this.pickMap = null;
    },
    againSetSource() {
      let sourceUrl;
      switch (this.drawerTitle) {
        case "摊贩信息面板":
          sourceUrl = `/poi/getFeatures`;
          break;
        case "违规摊贩信息":
          sourceUrl = `/poi/violate/getFeatures`;
          break;
        case "城管信息面板":
          sourceUrl = `/poi/urban/getFeatures`;
          break;
        case "部门信息面板":
          sourceUrl = `/poi/departmentInfo/getFeatures`;
          break;
      }
      $axios.get(sourceUrl).then((res) => {
        res.data.map((item) => {
          delete item._id;
          delete item.__v;
        });
        this.totalPoi = res.data.length;
        let sourceID;
        switch (this.drawerTitle) {
          case "摊贩信息面板":
            sourceID = "vendorPois";
            break;
          case "违规摊贩信息":
            sourceID = "violaterPois";
            break;
        }
        map.getSource(sourceID).setData({
          type: "FeatureCollection",
          features: res.data,
        });
      });
    },
    submitpoi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pickMap?.off("click", this.drawAreaClickHandler);
          this.pickMap = null;
          let d = this.newAddForm.date;
          this.newAddForm.date =
            d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
          console.log("表单", this.newAddForm);
          console.log("时间戳", d.getTime());
          console.log("时间戳类型", typeof d.getTime());

          let data = {
            // _id: this.newAddForm._id,
            type: "Feature",
            properties: {
              id: this.newAddForm.id,
              type: this.newAddForm.type,
              date: this.newAddForm.date,
              name: this.newAddForm.name,
              time: d.getTime(), //时间戳
              hour:d.getHours(),
              addr: this.newAddForm.addr,
            },
            geometry: {
              type: "Point",
              coordinates: this.newAddForm.lngLat,
            },
          };
          if (this.isNewAdd) {
            //新增
            $axios({
              method: "post",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              url: "http://127.0.01:3005/newadd",
              // 只有params是可以传递参数的,未在express中引入bodyParser之前
              params: data,
            }).then((res) => {
              console.log(res);
              if (res.data == "成功") {
                this.$emit("update:newAddDialogVisible", false);
                this.$emit("updateForm");
                $axios.get("/poi/pagequery/1").then((respois) => {
                  let propertiesArr = [];

                  respois.data.allData.forEach((item) => {
                    item.properties._id = item._id;
                    propertiesArr.push(item.properties);
                  });
                  this.$emit("updateTable", {
                    totalPoi: respois.data.totalPoi,
                    gridData: propertiesArr,
                  });
                });
                if (
                  this.drawerTitle == "违规摊贩信息" ||
                  this.drawerTitle == "摊贩信息面板"
                ) {
                  this.againSetSource();
                }
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
              }
            });
          } else {
            //编辑
            $axios({
              method: "post",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              url: "http://127.0.01:3005/poi/update",
              // 只有params是可以传递参数的,未在express中引入bodyParser之前
              params: data,
            }).then((res) => {
              console.log(res);
              if (res.data.success) {
                this.$emit("update:newAddDialogVisible", false);
                this.gridData.forEach((item, index) => {
                  if (item._id == data._id) {
                    data.properties._id = data._id;
                    this.gridData[index] = data.properties;
                  }
                });
                this.$emit("update:gridData", this.gridData);
                if (this.isFilter) {
                  this.filterPois.forEach((item, index) => {
                    if (item._id == data._id) {
                      data.properties._id = data._id;
                      this.filterPois[index] = data.properties;
                    }
                  });
                }
                this.$emit("update:filterPois", this.filterPois);
                this.$emit("updateForm");
                $axios
                  .get(`/poi/pagequery/${this.currentPage}`)
                  .then((respois) => {
                    let propertiesArr = [];

                    respois.data.allData.forEach((item) => {
                      item.properties._id = item._id;
                      propertiesArr.push(item.properties);
                    });
                  });

                this.$message({
                  message: "编辑成功",
                  type: "success",
                });
              }
            });
          }
          $axios.get("/poi/getFeatures").then((res) => {
            res.data.map((item) => {
              delete item._id;
              delete item.__v;
            });
            map.getSource("vendorPois").setData({
              type: "FeatureCollection",
              features: res.data,
            });
          });

          return false;
        }
      });
      //提交回调
    },
  },
};
</script>

<style scoped lang="scss">
#pickMap {
  width: 100%;
  height: 300px;
  //   color: #445ba7;
}
</style>
