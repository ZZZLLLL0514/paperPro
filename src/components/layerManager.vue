<template>
  <div id="layerManage">
      <!-- <el-slider v-model="value" range show-stops :max="10"> </el-slider> -->
    <div class="header">
      <div class="title">图层</div>
    </div>
    <div class="content">
      <el-tree
        :data="propTree"
        :default-checked-keys="checkeds"
        show-checkbox
        node-key="id"
        @node-drop="handleDrop"
        @check-change="handleCheckChange"
      >
        <template slot-scope="{ node, data }">
          <div style="display: flex">
            <div style="width: 90px; overflow: hidden; font-size: 14px">
              {{ node.label }}
            </div>
            <div class="icon">
              <el-tooltip
                class="item"
                content="删除此图层"
                :show-after="1500"
                placement="top-start"
              >
                <i class="el-icon-delete" @click="() => remove(node, data)"></i>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "layerManager",
  data() {
    return {
      value: [4, 8],
    };
  },
  props: {
    propTree: {
      type: Array,
    },
    checkeds: {
      type: Array,
    },
  },
  methods: {
    handleCheckChange(data, check) {
      check ? map.setLayoutProperty(data.label, 'visibility', 'visible'):map.setLayoutProperty(data.label, 'visibility', 'none');
    },
    remove(node, data) {
      this.$confirm("此操作移除该图层, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          let layerArr = this.map.getAllLayers();
          layerArr.forEach((item, index) => {
            if (item.values_.name == data.label) {
              this.map.removeLayer(item);
              this.$parent.getLayerName();
              this.$message({
                type: "success",
                message: "成功",
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
    handleDrop(before, after, inner) {
      //before是被拖拽的node，after是被拖拽node所占据的node,inner是字符串，外里面拖是inner，往外面拖是before，平级拖是after
      let layerArr = this.map.getAllLayers().filter((item) => {
        if (item.values_.name) return item;
      });
      this.propTree.forEach((item, index) => {
        layerArr.forEach((layItem) => {
          if (layItem.values_.name == item.label) layItem.setZIndex(index);
        });
      });
      // for (let i = 0; i < layerArr.length - 1; i++) {
      //   //对图层数组排序
      //   let index1 = layerArr[i].getZIndex();
      //   let index2 = layerArr[i + 1].getZIndex();
      //   if (index1 > index2) {
      //     let item = layerArr[i];
      //     layerArr[i] = layerArr[i + 1];
      //     layerArr[i + 1] = item;
      //   }
      // }
      // layerArr[before.data.id - 1].setZIndex(after.data.id);
      // if (before.data.id > after.data.id) {
      //   for (let i = after.data.id; i < before.data.id; i++) {
      //     layerArr[i - 1].setZIndex(i + 1);
      //   }
      // } else {
      //   for (let i = before.data.id; i < after.data.id; i++) {
      //     layerArr[i].setZIndex(i);
      //   }
      // }
      // this.$parent.getLayerName();
      //   layerArr.forEach((item, index) => {
      //     if (item.values_.name == before.data.label) {
      //       this.map.removeLayer(item);
      //       this.$parent.getLayerName();
      //       this.$message({
      //         type: "success",
      //         message: "成功",
      //       });
      //     }
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
.layerTree {
  position: absolute;
  z-index: 20;
  top: 250px;
  right: 20px;
  padding: 10px;
  background-color: rgba(182, 185, 187, 0.7);
}
#layerManage {
  position: absolute;
  right: 3vh;
  top: 40vh;
  width: 200px;
  height: 30vh;
  min-height: 50px;
  background-color: #fff;
  border: #7291ea 2px solid;
  display: flex;
  flex-direction: column;
  transition: 0.5s ease-out;

  .header {
    margin: 5px;

    .title {
      font-size: 15px;
      color: #409eff;
    }
  }

  .content {
    color: #7291ea;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    .el-tree-node {
      margin-top: 1vh;
    }
    .icon {
      margin-left: 5vh;
    }
  }
}

.content::-webkit-scrollbar-track {
  background-color: #eee;
}

.content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.content::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #dbdbdb;
}
</style>