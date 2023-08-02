<template>
  <div class="full">
    <div id="mapContain"></div>
    <div class="bottomBar"  @click="barClick" ref="bottomBar">
      <div v-for="(item, index) in operateArray" :key="index">
        <el-tooltip
          :content="item.title"
          placement="right"
          popper-class="changeToolTipStyle"
        >
          <img :src="item.img" alt="" :data-index="index" />
        </el-tooltip>
      </div>
    </div>
    <div v-permission="'dsg'" v-show="!isHeat" class="topBar" ref="topBar">
      <div class="butnContian">
        <el-button size="small" round
          ><a :href="href" download="map.png" @click="exportMap()"
            >导出地图</a
          ></el-button
        >
      </div>
      <div
        v-for="(item, index) in topoperateArray"
        :key="index"
        class="butnContian"
      >
        <el-button
          :type="item.active ? 'primary' : ''"
          @click="topBarClick(index)"
          size="small"
          round
          >{{ item.title }}</el-button
        >
      </div>
    </div>
    <el-slider
      v-show="isHeat"
      @change="sliderchange"
      v-model="timeSlider"
      range
      show-stops
      :max="24"
    >
    </el-slider>
    <el-button
      @click="cancelHeat"
      v-show="isHeat"
      type="primary"
      icon="el-icon-back"
      round
      class="cancelHeat"
      >取消热力图</el-button
    >
    <keep-alive>
      <el-drawer
        :title="drawerTitle"
        :before-close="vendorInfoClose"
        direction="ltr"
        :visible.sync="drawerVisible"
        size="47%"
      >
        <div
          style="
            display: flex;
            margin-bottom: 15px;
            justify-content: space-around;
          "
        >
          <div ref="jhg" id="jh">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-download"
              @click="downloadExcel"
              >导出属性表</el-button
            >
            <el-button
              size="mini"
              @click="newAdd"
              type="primary"
              >新增</el-button
            >
            <el-button
              size="mini"
              @click="batchDeletion"
              type="danger"
              >删除选中</el-button
            >
          </div>
          <div style="display: flex; justify-content: space-around">
            <el-button size="mini" @click="searchById" type="primary"
              >搜索</el-button
            >
            <el-input
              style="margin-left: 10px"
              size="mini"
              v-model="searchID"
              placeholder="请输入摊贩id"
              autocomplete="off"
              clearable
            ></el-input>
          </div>
        </div>
        <el-form
          v-if="typeList.length"
          ref="filterForm"
          inline
          size="mini"
          label-width="80px"
          :model="filterForm"
        >
          <el-form-item label="类型">
            <el-select v-model="filterForm.type" placeholder="请选择一个类型">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in typeList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              placeholder="选择日期"
              v-model="filterForm.date"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-button size="mini" @click="filterClick" type="primary"
            >过滤</el-button
          >
        </el-form>
        <el-divider></el-divider>
        <el-table
          height="70vh"
          v-loading="loading"
          @select-all="selectAll"
          @select="selectRow"
          size="medium"
          border
          :data="gridData"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            v-for="item in columnList"
            :key="item.lable"
            align="center"
            :property="item.property"
            :label="item.label"
            :width="item.width"
          ></el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            :width="typeList.length ? '130' : '100'"
          >
            <template slot-scope="scope">
              <el-button
                @click="viewPoiClick(scope.row)"
                v-if="drawerTitle != '城管信息面板'"
                type="text"
                size="small"
                >查看</el-button
              >
              <el-button
                @click="editPOI(scope.row)"
                type="text"
                size="small"
                >编辑</el-button
              >
              <el-button
                @click="deletePOI(scope.row)"
                size="small"
                type="text"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="changePage"
          background
          class="pager"
          layout="prev, pager, next"
          :page-size="10"
          :total="totalPoi"
          :current-page.sync="currentPage"
        >
        </el-pagination>
      </el-drawer>
    </keep-alive>
    <el-drawer
      :title="analysisResultTitle"
      :before-close="ZBvendorClose"
      direction="rtl"
      :visible="ZBdrawerVisible"
      size="37%"
    >
      <div class="vendorStatistics">
        <span>摊贩总数:{{ this.features.length }}</span>
      </div>
      <div v-if="ifBuffer" class="vendorStatistics">
        <span>学生总数:{{ this.$store.state.studentCount }}</span>
      </div>
      <div v-if="ifBuffer" class="vendorStatistics">
        <span>人数摊贩比:{{ Math.round(this.$store.state.studentCount /this.features.length)}}</span>
      </div>
      <div id="timeFB"></div>
      <div id="vendorNumber"></div>
    </el-drawer>
    <new-edit
      :newAddDialogVisible.sync="newAddDialogVisible"
      :filterPois.sync="filterPois"
      :gridData.sync="gridData"
      :isFilter="isFilter"
      :currentPage="currentPage"
      :isNewAdd="isNewAdd"
      :newAddForm="newAddForm"
      @updateTable="updatetable"
      @updateForm="updateform"
      :drawerTitle="drawerTitle"
    >
    </new-edit>
    <el-dialog
      title="缓存分析"
      :visible.sync="bufferDialogVisible"
      width="30%"
      :before-close="bufferClose"
    >
      <el-form
        ref="bufferForm"
        :rules="bufferRules"
        :inline="true"
        :model="bufferForm"
        class="demo-form-inline"
      >
        <el-form-item prop="layer" label="选择图层">
          <el-select v-model="bufferForm.layer" placeholder="选择图层">
            <el-option label="华农学生公寓" value="华农学生公寓"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="distant" label="缓冲距离">
          <el-input
            v-model="bufferForm.distant"
            placeholder="请输入缓冲距离(米)"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bufferClose">取 消</el-button>
        <el-button type="primary" @click="submitBuffer('bufferForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="选择出发部门"
      :visible.sync="departmentDialogVisible"
      width="30%"
      :before-close="departmentClose"
    >
      <el-select v-model="selecDepartment" placeholder="选择部门">
        <el-option
          v-for="item in this.$store.state.departmentInfos"
          :key="item.properties.department"
          :label="item.properties.department"
          :value="item.properties.department"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="departmentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPath(selecDepartment)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <div v-show="isShow" id="coorContainer" class="coorContainer"></div>
  </div>
</template>

<script>
import { operateMap } from "@/mixins/operateMap";
import { addLayer } from "@/mixins/addLayer";
import { topBarOperate } from "@/mixins/topBarOperate";
import newEdit from "./newEdit.vue";
import coordtransform from "coordtransform";
import * as XLSX from "xlsx";
export default {
  name: "Map",
  mixins: [operateMap, addLayer, topBarOperate],
  components: { newEdit },
  props: {
    drawerVisible: {
      //摊贩信息对话框
      default: false,
    },
    violatedrawerVisible: {
      //摊贩信息对话框
      default: false,
    },
    isHeat: {
      default: false,
    },
    columnList: Array,
    drawerTitle: String,
    typeList: Array,
  },
  inject: ["typeList"],
  data() {
    return {
      bufferDialogVisible: false, //缓冲区对话框可见性
      departmentDialogVisible: false,
      selecDepartment: "", //路径规划时选择的出发部门
      destinationCoors: [], //目的地经纬度
      bufferRules: {
        layer: [{ required: true, message: "请输入类型", trigger: "change" }],
        distant: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      bufferForm: {
        layer: "",
        distant: "",
      },
      ifBuffer:false,//记录是否缓冲
      gridData: [],
      timeSlider: [0, 24],
      map: null, //实例地图
      pickMap: null,
      newAddDialogVisible: false, //新增摊贩对话框
      newAddForm: {
        type: "",
        name: "",
        date: "",
        id: "",
        addr: "",
        lngLat: [],
      },
      deleteIds: [], //要删除的id列表
      searchID: "",
      filterForm: {
        //过滤表单
        type: "",
        date: null,
      },
      loading: true,
      totalPoi: 0, //总的摊贩数量
      filterPois: [],
      isFilter: false, //记录是否在过滤
      currentPage: 0,
      isNewAdd: true,
      viewPopup: null,
      topoperateArray: [
        //顶部按钮操作相关
        {
          active: false,
          title: "周边摊贩分析",
          name: "vendorStatistics",
        },
        {
          active: false,
          title: "缓冲区分析 ",
          name: "buff",
        },
      ],
      analysisResultTitle: "", //摊贩分析结果标题
    };
  },
  mounted() {
    this.initMap();
    window.map = this.map;
    document.getElementsByClassName("mapboxgl-canvas")[0].style.width = "100%"; //设置canvas宽度
  },
  methods: {
    vendorInfoClose() {
      //摊贩信息弹出框关闭回调
      this.$emit("update:drawerVisible", false);
    },
    newAddClose(done) {
      //新增摊贩信息弹出框关闭回调
      done();
      this.pickMap = null;
    },
    editPOI(row) {
      this.isNewAdd = false;
      row.date = new Date(row.time);
      this.newAddForm = row;
      this.newAddDialogVisible = true;
    },
    downloadExcel() {
      let tableDatas = [];
      $axios
        .get("/poi_p/getFeatures")
        .then((res) => {
          res.data.forEach((item) => {
            tableDatas.push(item.properties);
          });
          return "";
        })
        .then(() => {
          let data = [
            { a: 123, b: 456 },
            { a: 888, b: 999 },
          ];
          let fileName = "表格数据";
          let ws = XLSX.utils.json_to_sheet(tableDatas);
          let wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, fileName); // 工作簿名称
          XLSX.writeFile(wb, `${fileName}.xlsx`); // 保存的文件名
        });
    },
    deletePOI(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          let url;
          switch (this.drawerTitle) {
            case "摊贩信息面板":
              url = `/poi_p/delete/${row._id}`;
              break;
            case "违规摊贩信息":
              url = `/poi_p/violate/delete/${row._id}`;
              break;
            case "城管信息面板":
              url = `/poi_p/urban/delete/${row._id}`;
            case "部门信息面板":
              url = `/poi_p/departmentInfo/delete/${row._id}`;
              break;
          }
          $axios.delete(url).then((res) => {
            if (res.data.success) {
              this.gridData = [];
              if (this.filterPois.length) {
                for (let i = 0; i < this.filterPois.length; i++) {
                  if (row._id == this.filterPois[i]._id) {
                    this.filterPois.splice(i, 1);
                    break;
                  }
                }
                let prePois = this.currentPage * 10;
                this.totalPoi = this.filterPois.length;
                for (
                  let i = 10 * (this.currentPage - 1);
                  i < prePois && i < this.filterPois.length;
                  i++
                ) {
                  this.gridData.push(this.filterPois[i]);
                }
              } else {
                this.getDataAfterDelete();
              }
              this.$message({
                message: "删除成功",
                type: "success",
              });
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
              this.totalPoi = this.filterPois.length;
              this.$nextTick(() => {
                this.loading = false;
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    viewPoiClick(row) {
      this.viewPopup?.remove();
      this.$emit("update:drawerVisible", false);
      console.log("查看", row);
      this.map.flyTo({
        center: [row.lngLat[0], row.lngLat[1]],
        zoom: 17.2,
        speed: 0.5,
      });
      this.viewPopup = new mapboxgl.Popup({
        // closeButton: false,//是否显示右上角的取消按钮
        closeOnClick: false, //点击地图不会关闭前一个popup
      }).addTo(map);
      this.viewPopup
        .setLngLat(row.lngLat)
        .setHTML(
          `<h5>摊主姓名:${row.name}</h5><h5>经营类型:${row.type}</h5><button id="goTo">前往</button>`
        )
        .setMaxWidth("200px");
      this.destinationCoors = row.lngLat;
      this.$nextTick(() => {
        this.addListener(0, row.lngLat);
      });
    },
    getDataAfterDelete() {
      let url;
      switch (this.drawerTitle) {
        case "摊贩信息面板":
          url = `/poi_p/pagequery/${this.currentPage}`;
          break;
        case "违规摊贩信息":
          url = `/poi_p/violate/pagequery/${this.currentPage}`;
          break;
        case "城管信息面板":
          url = `/poi_p/urban/pagequery/${this.currentPage}`;
          break;
        case "部门信息面板":
          url = `/poi_p/departmentInfo/pagequery/${this.currentPage}`;
          break;
      }
      $axios.get(url).then((respois) => {
        if (respois.data.allData.length) {
          console.log("总数", respois.data);
          this.totalPoi = respois.data.totalPoi;
          let propertiesArr = [];
          respois.data.allData.forEach((item) => {
            item.properties.lngLat = item.geometry.coordinates;
            item.properties._id = item._id;
            propertiesArr.push(item.properties);
          });
          this.gridData = propertiesArr;
          this.filterForm = {
            type: "",
            date: null,
          };
        } else {
          let url;
          switch (this.drawerTitle) {
            case "摊贩信息面板":
              url = `/poi_p/pagequery/1`;
              break;
            case "违规摊贩信息":
              url = `/poi_p/violate/pagequery/1`;
              break;
            case "城管信息面板":
              url = `/poi_p/urban/pagequery/1`;
              break;
            case "部门信息面板":
              url = `/poi_p/departmentInfo/pagequery/1`;
              break;
          }
          $axios.get(url).then((respois) => {
            let propertiesArr = [];
            this.totalPoi = respois.data.totalPoi;
            respois.data.allData.forEach((item) => {
              item.properties._id = item._id;
              item.properties.lngLat = item.geometry.coordinates;
              propertiesArr.push(item.properties);
            });
            this.gridData = propertiesArr;
            this.currentPage = 1;
          });
        }
      });
    },
    batchDeletion() {
      if (this.deleteIds.length) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loading = true;
            let url;
            switch (this.drawerTitle) {
              case "摊贩信息面板":
                url = `/poi_p/deletes`;
                break;
              case "违规摊贩信息":
                url = `/poi_p/violate/deletes`;
                break;
              case "城管信息面板":
                url = `/poi_p/urban/deletes`;
                break;
              case "部门信息面板":
                url = `/poi_p/departmentInfo/deletes`;
                break;
            }
            $axios({
              method: "post",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              url: url,
              // 只有params是可以传递参数的,未在express中引入bodyParser之前
              params: this.deleteIds,
            }).then((res) => {
              console.log(res.data);
              if (res.data.success) {
                this.gridData = [];
                if (this.filterPois.length) {
                  let filterPois = [];
                  this.filterPois.forEach((item) => {
                    if (!this.deleteIds.includes(item._id)) {
                      filterPois.push(item);
                    }
                  });
                  this.filterPois = filterPois;
                  this.totalPoi = this.filterPois.length;
                  let prePois = this.currentPage * 10;
                  for (
                    let i = 10 * (this.currentPage - 1);
                    i < prePois && i < this.filterPois.length;
                    i++
                  ) {
                    this.gridData.push(this.filterPois[i]);
                  }
                } else {
                  this.getDataAfterDelete();
                }
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
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
                this.$nextTick(() => {
                  this.loading = false;
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message("无选中数据");
      }
    },
    newAdd() {
      this.newAddDialogVisible = true;
      this.isNewAdd = true;
      switch (this.drawerTitle) {
        case "摊贩信息面板":
          this.newAddForm = {
            type: "",
            name: "",
            date: "",
            id: "",
            addr: "",
            lngLat: [],
          };
          break;
        case "违规摊贩信息":
          this.newAddForm = {
            type: "",
            name: "",
            date: "",
            id: "",
            addr: "",
            lngLat: [],
            department: "",
          };
      }
    },
    selectRow(row, selection) {
      //行改变选中状态事件回调
      this.deleteIds = [];
      row.forEach((item) => {
        this.deleteIds.push(item._id);
      });
    },
    selectAll(selection) {
      this.deleteIds = [];
      selection.forEach((item) => {
        this.deleteIds.push(item._id);
      });
    },
    searchById() {
      //根据id搜索按钮回调
      let url;
      switch (this.drawerTitle) {
        case "摊贩信息面板":
          url = `/poi_p/searchid/${this.searchID}`;
          break;
        case "违规摊贩信息":
          url = `/poi_p/violate/searchid/${this.searchID}`;
          break;
        case "城管信息面板":
          url = `/poi_p/urban/searchid/${this.searchID}`;
          break;
        case "部门信息面板":
          url = `/poi_p/departmentInfo/searchid/${this.searchID}`;
          break;
      }
      $axios.get(url).then((respois) => {
        if (respois.data) {
          this.totalPoi = 1;
          let data = respois.data.properties;
          data._id = respois.data._id;
          data.lngLat = respois.data.geometry.coordinates;
          this.gridData = [data];
        } else {
          this.totalPoi = 0;
          this.gridData = [];
        }
      });
    },
    filterClick() {
      //过滤按钮回调
      // let idArr = [];
      if (this.filterForm.date) {
        let d = this.filterForm.date;
        this.filterForm.date =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      }
      if (this.filterForm.date || this.filterForm.type) {
        //设置过滤条件
        this.loading = true;
        let url;
        switch (
          this.drawerTitle //不用写城管信息面板过滤功能
        ) {
          case "摊贩信息面板":
            url = `/poi_p/filtle`;
            break;
          case "违规摊贩信息":
            url = `/poi_p/violate/filtle`;
            break;
          case "部门信息面板":
            url = `/poi_p/departmentInfo/filtle`;
            break;
        }
        $axios({
          method: "post",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          url: url,
          // 只有params是可以传递参数的,未在express中引入bodyParser之前
          params: this.filterForm,
        }).then((respois) => {
          if (respois.data) {
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
              //过滤后重新设置数据源
              type: "FeatureCollection",
              features: respois.data,
            });
            this.totalPoi = respois.data.length;
            let propertiesArr = [];
            respois.data.forEach((item) => {
              item.properties._id = item._id;
              item.properties.lngLat = item.geometry.coordinates;
              propertiesArr.push(item.properties);
            });
            if (propertiesArr.length <= 10) {
              //过滤数据小于10条则直接赋予
              this.gridData = propertiesArr;
              this.filterPois = propertiesArr;
            } else {
              //大于10条则分页
              this.isFilter = true;
              this.filterPois = propertiesArr;
              this.gridData = [];
              for (let i = 0; i < 10; i++) {
                this.gridData.push(propertiesArr[i]);
              }
              this.currentPage = 1;
            }
          } else {
            this.totalPoi = 0;
            this.gridData = [];
            this.filterPois = [];
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        });
      } else {
        //不设置过滤条件则请求所有数据
        this.loading = true;
        this.isFilter = false;
        let sourceUrl;
        switch (this.drawerTitle) {
          case "摊贩信息面板":
            sourceUrl = `/poi_p/getFeatures`;
            break;
          case "违规摊贩信息":
            sourceUrl = `/poi_p/violate/getFeatures`;
            break;
          case "城管信息面板":
            sourceUrl = `/poi_p/urban/getFeatures`;
            break;
          case "部门信息面板":
            sourceUrl = `/poi_p/departmentInfo/getFeatures`;
            break;
        }
        $axios.get(sourceUrl).then((res) => {
          res.data.map((item) => {
            delete item._id;
            delete item.__v;
          });
          let sourceID;
          this.totalPoi = res.data.length;
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
        let url;
        switch (this.drawerTitle) {
          case "摊贩信息面板":
            url = `/poi_p/violate/pagequery/1`;
            break;
          case "违规摊贩信息":
            url = `/poi_p/violate/pagequery/1`;
            break;
          case "城管信息面板":
            url = `/poi_p/urban/pagequery/1`;
          case "部门信息面板":
            url = `/poi_p/departmentInfo/pagequery/1`;
            break;
        }
        $axios.get(url).then((respois) => {
          let propertiesArr = [];
          respois.data.allData.forEach((item) => {
            item.properties.lngLat = item.geometry.coordinates;
            item.properties._id = item._id;
            propertiesArr.push(item.properties);
          });
          this.gridData = propertiesArr;
          this.filterPois = [];
          this.currentPage = 1;
          this.$nextTick(() => {
            this.loading = false;
          });
        });
      }
    },
    changePage(currentPage) {
      console.log("当前页", currentPage);
      if (this.isFilter) {
        let prePois = currentPage * 10;
        this.gridData = []; //清零
        for (
          let i = 10 * (currentPage - 1);
          i < prePois && i < this.filterPois.length;
          i++
        ) {
          this.gridData.push(this.filterPois[i]);
        }
      } else {
        let url;
        switch (this.drawerTitle) {
          case "摊贩信息面板":
            url = `/poi_p/pagequery/${this.currentPage}`;
            break;
          case "违规摊贩信息":
            url = `/poi_p/violate/pagequery/${this.currentPage}`;
            break;
          case "城管信息面板":
            url = `/poi_p/urban/pagequery/${this.currentPage}`;
            break;
          case "部门信息面板":
            url = `/poi_p/departmentInfo/pagequery/${this.currentPage}`;
            break;
        }
        $axios.get(url).then((respois) => {
          if (respois.data) {
            console.log("请求数据", respois.data);
            let propertiesArr = [];
            respois.data.allData.forEach((item) => {
              item.properties._id = item._id;
              item.properties.lngLat = item.geometry.coordinates;
              propertiesArr.push(item.properties);
            });
            console.log("整合数据", propertiesArr);
            this.gridData = propertiesArr;
          } else {
            this.gridData = [];
          }
        });
      }
    },
    updateform() {
      //更新新增和过滤表单
      if (this.isNewAdd) {
        this.filterPois = [];
        this.filterForm = {
          type: "",
          date: null,
        };
      }

      this.newAddForm = {
        type: "",
        name: "",
        date: "",
        id: "",
        addr: "",
        lngLat: [],
        department: "",
      };
    },
    updatetable(table) {
      //更新信息表
      this.totalPoi = table.totalPoi;
      this.gridData = table.gridData;
      this.currentPage = 1;
    },
    cancelHeat() {
      //取消热力图
      this.$emit("update:isHeat", false);
      this.$store.commit("changeHeat", false);
      map.setLayoutProperty("vendorPois-heat", "visibility", "none");
      map.setLayoutProperty("clusters", "visibility", "visible");
      map.setLayoutProperty("cluster-count", "visibility", "visible");
      map.setLayoutProperty("icon-image", "visibility", "visible");
      // map.setLayoutProperty("violateClusters", "visibility", "visible");
      // map.setLayoutProperty("violateCluster-count", "visibility", "visible");
      // map.setLayoutProperty("violateIcon", "visibility", "visible");
    },
    sliderchange(val) {
      console.log("改变的值", val);
      map.setFilter("vendorPois-heat", [
        "all",
        [">=", "hour", val[0]],
        ["<", "hour", val[1]],
      ]);
    },
    bufferClose() {
      this.bufferDialogVisible = false;
      if (!this.map.getLayer("bufferPoi")) {
        this.topoperateArray[1].active = false;
        this.map.removeControl(this.draw);
        this.draw = null;
      }
    },
    submitBuffer(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.bufferForm.layer == "华农学生公寓") {
            let buffers = turf.buffer(
              this.$store.state.StudentDormitorySource,
              this.bufferForm.distant,
              { units: "meters" }
            );
            // console.log("缓冲源",this.$store.state.StudentDormitorySource)
            // console.log("缓冲区",buffers)
            let unionPolygon = null; //缓冲面
            let bufferPoi = [];
            if (buffers.features.length >= 1) {
              let features = buffers.features;
              for (let i = 0; i < features.length; i++) {
                if (i == 0) {
                  continue;
                } else if (i == 1) {
                  unionPolygon = turf.union(features[0], features[1]);
                } else {
                  unionPolygon = turf.union(unionPolygon, features[i]);
                }
              }
              // console.log("合并后缓冲区",unionPolygon)
              for (let i = 0; i < this.$store.state.legalPois.length; i++) {
                // if (this.$store.state.legalPois[i].geometry.coordinates.length == 2) {
                let coordinates = [
                  Number(
                    this.$store.state.legalPois[i].geometry.coordinates[0]
                  ),
                  Number(
                    this.$store.state.legalPois[i].geometry.coordinates[1]
                  ),
                ];
                let isInclude = await turf.booleanPointInPolygon(
                  turf.point(coordinates),
                  // turf.polygon(e.features[0].geometry.coordinates)
                  unionPolygon
                );
                if (isInclude) {
                  bufferPoi.push(this.$store.state.legalPois[i]);
                }
                // }
              }
              this.features = bufferPoi;
              this.ZBdrawerVisible = true;
              this.analysisResultTitle = "缓冲区分析";
              this.$nextTick(() => {
                this.createZBecharts();
              });
              // console.log("缓冲范围内的摊贩点",bufferPoi)
              this.map.addSource("bufferPoi", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  crs: {
                    type: "name",
                    properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                  },
                  features: bufferPoi,
                },
              });
              this.map.addLayer({
                id: "bufferPoi",
                type: "circle",
                source: "bufferPoi",
                paint: {
                  //对这图层的每个要素设置颜色，而不是整体赋予
                  "circle-color": "#f28cb1",
                  "circle-radius": 10,
                },
              });
              // this.map.addSource("bufferSource", {
              //     type: "geojson",
              //     data: unionPolygon,
              // });
              // this.map.addLayer({
              //     id: "缓冲区",
              //     type: "fill",
              //     source: "bufferSource",
              //     paint: {
              //         "fill-opacity": 0.6, // 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
              //         "fill-color": "#735797", // 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效）
              //         "fill-outline-color": "#f50707",
              //     },
              // });
            }
          }
          this.bufferDialogVisible = false;
          this.ifBuffer=true;
        }
      });
    },
    createPath(department) {
      //路径图层
      if (this.selecDepartment) {
        this.departmentDialogVisible = false;
        this.viewPopup?.remove();
        this.queryPopup?.remove();
        if (map.getSource("pathLine")) {
          map.removeLayer("path-layer");
          map.removeLayer("line-dashed");
          map.removeSource("pathLine");
        }
        let originCoors;
        this.$store.state.departmentInfos.forEach((item) => {
          if (item.properties.department == department)
            originCoors = [
              Number(item.geometry.coordinates[0]),
              Number(item.geometry.coordinates[1]),
            ];
        });
        let gcj02Destina = coordtransform.wgs84togcj02(
          this.destinationCoors[0],
          this.destinationCoors[1]
        ); //将目的地坐标转成高德坐标系
        let gcj02Origin = coordtransform.wgs84togcj02(
          originCoors[0],
          originCoors[1]
        );
        let url = `/v3/direction/driving?origin=${gcj02Origin[0]},${gcj02Origin[1]}&destination=${gcj02Destina[0]},${gcj02Destina[1]}&extensions=base&output=json&key=23119cd7d7e0834a0776d04f7a56fc44`;
        let pathCoors = [];
        $axios.get(url).then((res) => {
          console.log("路径", res.data);
          res.data.route.paths[0].steps.forEach((item) => {
            let coors = item.polyline.split(";"); //分割坐标字符串
            coors.forEach((item) => {
              let transformCoor = coordtransform.gcj02towgs84(
                Number(item.split(",")[0]),
                Number(item.split(",")[1])
              );
              pathCoors.push([transformCoor[0], transformCoor[1]]);
            });
          });
          map.addSource("pathLine", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              crs: {
                type: "name",
                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
              },
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: pathCoors,
                  },
                },
              ],
            },
          });
          map.addLayer({
            id: "path-layer",
            type: "line",
            source: "pathLine",
            paint: {
              "line-color": "#585555",
              "line-width": 5,
              "line-opacity": 0.8,
            },
          });
          map.addLayer({
            type: "line",
            source: "pathLine",
            id: "line-dashed",
            paint: {
              "line-color": "yellow",
              "line-width": 5,
              "line-dasharray": [0, 4, 3],
            },
          });

          // technique based on https://jsfiddle.net/2mws8y3q/
          // an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
          const dashArraySequence = [
            [0, 4, 3],
            [0.5, 4, 2.5],
            [1, 4, 2],
            [1.5, 4, 1.5],
            [2, 4, 1],
            [2.5, 4, 0.5],
            [3, 4, 0],
            [0, 0.5, 3, 3.5],
            [0, 1, 3, 3],
            [0, 1.5, 3, 2.5],
            [0, 2, 3, 2],
            [0, 2.5, 3, 1.5],
            [0, 3, 3, 1],
            [0, 3.5, 3, 0.5],
          ];

          let step = 0;
          function animateDashArray(timestamp) {
            // Update line-dasharray using the next value in dashArraySequence. The
            // divisor in the expression `timestamp / 50` controls the animation speed.
            const newStep = parseInt(
              (timestamp / 50) % dashArraySequence.length
            );

            if (newStep !== step) {
              map.setPaintProperty(
                "line-dashed",
                "line-dasharray",
                dashArraySequence[step]
              );
              step = newStep;
            }

            // Request the next frame of the animation.
            requestAnimationFrame(animateDashArray);
          }

          // start the animation
          animateDashArray(0);
          // let lineLength = turf.length({
          //   type: "Feature",
          //   geometry: {
          //     type: "LineString",
          //     coordinates: pathCoors,
          //   },
          // });
          // console.log(lineLength,"公里")
          this.$message({
            message: `全程${
              res.data.route.paths[0].distance / 1000
            }公里,预计行驶${res.data.route.paths[0].duration % 60}分钟`,
            type: "success",
          });
        });
      }
    },
    departmentClose() {
      this.departmentDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.full {
  position: relative;
  width: 100%;
  .cancelHeat {
    position: absolute;
    top: 3vh;
    left: 1vw;
  }
  .pager {
    position: absolute;
    bottom: 1px;
    right: 20px;
  }
  // height: 100vh;
  // width: 10vw;
  #mapContain {
    top: 0;
    bottom: 0;
    width: 100%;
    height: 95vh;
    .mapboxgl-canvas-container {
      width: 100%;
      .mapboxgl-canvas {
        width: 100% !important;
      }
    }
  }

  .bottomBar {
    width: 40px;
    position: absolute;
    background: transparent;
    border-radius: 4px;
    top: 35vh;
    left: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;

    img {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
  .topBar {
    position: absolute;
    background-color: rgba(36, 156, 183, 0.7);
    border-radius: 4px;
    top: 2vh;
    left: 10vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    .butnContian {
      padding: 0px 5px 10px;
    }
  }
  .el-slider {
    position: absolute;
    bottom: 2vh;
    left: 30%;
    height: 38px;
    width: 400px;
  }
}

.coorContainer {
  width: 10vw;
  height: 50px;
  margin-bottom: 15px;
  position: absolute;
  color: rgb(8, 226, 237);
  background: rgba(0, 156, 255, 0.11);
  border: 1px solid rgb(78, 203, 255);
  border-radius: 4px;
  left: 35vw;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 5vh;
  z-index: 66;
  font-size: 20px;
}

#pickMap {
  width: 300px;
  height: 220px;
  // background-color: #585555;
}
a {
  text-decoration: none;
  color: rgb(8, 8, 8);
}
#timeFB {
  border: 1px solid rgb(190, 181, 166);
  width: 96%;
  height: 35vh;
  margin: 10px;
}
#vendorNumber {
  border: 1px solid rgb(190, 181, 166);
  width: 96%;
  height: 35vh;
  margin-top: 7px;
  margin: 10px;
}
.vendorStatistics {
  background-color: rgb(209, 215, 215);
  width: 50%;
  margin: auto;
  padding: 0%;
  span {
    width: 100%;
    text-align: center;
    font-size: 25px;
    width: 100%;
    display: block;
    text-align: center;
    font-size: 25px;
    padding: 5px 0px;
  }
}
</style>