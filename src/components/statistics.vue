<template>
  <div class="echarts-main">
    <el-button style="margin:5px" type="primary" @click="back">返回</el-button>
    <div class="top">
      <div class="amount">
        <div>
          <span>摊贩统计</span>
          <h2>{{ this.$store.state.legalPois.length }}</h2>
          <span>历史记录数</span>
        </div>
        <div>
          <span>违规摊贩统计</span>
          <h2>{{ this.$store.state.violatePois.length }}</h2>
          <span>历史记录数</span>
        </div>
      </div>
      <div id="legalPropor"></div>
      <div id="typeAmount"></div>
    </div>
    <div class="centre">
      <div id="illegal"></div>
      <div id="heat"></div>
    </div>
    <div id="timeTrend"></div>
    <div id="violateTrend"></div>
  </div>
</template>

<script>
export default {
  name: "statistics",
  mounted() {
    let legalPois = this.$store.state.legalPois;
    let violatePois = this.$store.state.violatePois;
    let cw = 0, //宠物
      gg = 0, //瓜果
      rl = 0, //肉类
      tp = 0, //甜品
      hqt = 0, //合法其他
      wx = 0, //维修
      xc = 0, //小吃
      wg = 0,
      zd = 0, //占道
      ws = 0, //卫生
      sj = 0, //售假
      rm = 0, //扰民
      dj = 0, //不合理定价
      wqt = 0; //违法其他
    legalPois.forEach((item) => {
      switch (item.properties.type) {
        case "熟食小吃":
          ++xc;
          break;
        case "缝补维修":
          ++wx;
          break;
        case "水产肉类":
          ++rl;
          break;
        case "甜品饮料":
          ++tp;
          break;
        case "宠物销售":
          ++cw;
          break;
        case "其他":
          ++hqt;
          break;
        case "蔬菜瓜果":
          ++gg;
          break;
        case "占道经营":
          ++wg;
      }
    });
    violatePois.forEach((item) => {
      switch (item.properties.type) {
        case "卫生问题":
          ++ws;
          break;
        case "违规占道":
          ++zd;
          break;
        case "制假售假":
          ++sj;
          break;
        case "叫卖扰民":
          ++rm;
          break;
        case "不合理定价":
          ++dj;
          break;
        case "其他":
          ++wqt;
          break;
      }
    });
    let legalPropor_option = {
      title: {
        text: "摊贩类型占比",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "占比",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: Math.round((xc / legalPois.length) * 1000) / 1000,
              name: "熟食小吃",
            },
            {
              value: Math.round((wx / legalPois.length) * 1000) / 1000,
              name: "缝补维修",
            },
            {
              value: Math.round((rl / legalPois.length) * 1000) / 1000,
              name: "水产肉类",
            },
            {
              value: Math.round((tp / legalPois.length) * 1000) / 1000,
              name: "甜品饮料",
            },
            {
              value: Math.round((cw / legalPois.length) * 1000) / 1000,
              name: "宠物销售",
            },
            {
              value: Math.round((gg / legalPois.length) * 1000) / 1000,
              name: "瓜果蔬菜",
            },
            {
              value: Math.round((wg / legalPois.length) * 1000) / 1000,
              name: "占道经营",
            },
            {
              value: Math.round((hqt / legalPois.length) * 1000) / 1000,
              name: "其他",
            },
          ],
        },
      ],
    };
    this.initEchart("legalPropor", legalPropor_option);
    let typeAmount_option = {
      title: {
        text: "摊贩类型数量",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "熟食小吃",
            "缝补维修",
            "水产肉类",
            "甜品饮料",
            "宠物销售",
            "蔬菜瓜果",
            "占道经营",
            "其他",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "数量",
          type: "bar",
          barWidth: "60%",
          data: [xc, wx, rl, tp, cw, gg, wg,hqt],
        },
      ],
    };
    this.initEchart("typeAmount", typeAmount_option);
    let illegal_option = {
      title: {
        text: "违法摊贩类型占比",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "占比",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: Math.round((ws / violatePois.length) * 1000) / 1000,
              name: "卫生问题",
            },
            {
              value: Math.round((zd / violatePois.length) * 1000) / 1000,
              name: "违规占道",
            },
            {
              value: Math.round((sj / violatePois.length) * 1000) / 1000,
              name: "制假售假",
            },
            {
              value: Math.round((rm / violatePois.length) * 1000) / 1000,
              name: "叫卖扰民",
            },
            {
              value: Math.round((dj / violatePois.length) * 1000) / 1000,
              name: "不合理定价",
            },
            {
              value: Math.round((wqt / violatePois.length) * 1000) / 1000,
              name: "其他",
            },
          ],
        },
      ],
    };
    this.initEchart("illegal", illegal_option);

    const hours = [
      "12a",
      "1a",
      "2a",
      "3a",
      "4a",
      "5a",
      "6a",
      "7a",
      "8a",
      "9a",
      "10a",
      "11a",
      "12p",
      "1p",
      "2p",
      "3p",
      "4p",
      "5p",
      "6p",
      "7p",
      "8p",
      "9p",
      "10p",
      "11p",
    ];
    // prettier-ignore
    //     const days = [
    //     'Saturday', 'Friday', 'Thursday',
    //     'Wednesday', 'Tuesday', 'Monday', 'Sunday'
    // ];
    const days=['周日','周一','周二','周三','周四','周五','周六']
    // prettier-ignore

    const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
    .map(function (item) {
    return [item[1], item[0], 0];
});
    legalPois.forEach((item) => {
      let d = new Date(item.properties.time);
      let hours = d.getHours();
      let week = d.getDay();
      data.forEach((item, index) => {
        if (item[0] == hours && item[1] == week) {
          item[2] = item[2] + 1;
        }
      });
    });
    let heat_option = {
      title: {
        text: "合法摊贩数量热力图",
        left: "center",
      },
      tooltip: {
        position: "top",
      },
      grid: {
        height: "50%",
        top: "10%",
      },
      xAxis: {
        type: "category",
        data: hours,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: days,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "15%",
      },
      series: [
        {
          name: "Punch Card",
          type: "heatmap",
          data: data,
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    this.initEchart("heat", heat_option);
    //趋势折线图
    this.trendEcharts();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    initEchart(domName, option) {
      let dom = document.getElementById(domName);
      let chart = echarts.init(dom);
      chart.setOption(option);
    },
    trendEcharts() {
      let legal_times = []; //合法摊贩时间
      let violate_times = []; //违法摊贩时间
      // console.log("合法摊贩", this.$store.state.legalPois);
      // console.log("违法摊贩", this.$store.state.violatePois);
      if (this.$store.state.legalPois.length) {
        this.$store.state.legalPois.forEach((item) => {
          legal_times.push(item.properties.time);
        });
        this.$store.state.violatePois.forEach((item) => {
          violate_times.push(item.properties.time);
        });
        this.initTrend(legal_times, "timeTrend");
        this.initTrend(violate_times, "violateTrend");
      } else {
        $axios.get("/poi/getFeatures").then((res) => {
          $axios.get("/poi/violate/getFeatures").then((violateRes) => {
            res.data.map((item) => {
              delete item._id;
              delete item.__v;
            });
            violateRes.data.map((item) => {
              delete item._id;
              delete item.__v;
            });
            this.$store.commit("addViolatePois", violateRes.data);
            this.$store.commit("addLegalPois", res.data);
            violateRes.data.map((item) => {
              delete item._id;
              delete item.__v;
            });
            res.data.forEach((item) => {
              legal_times.push(item.properties.time);
            });
            violateRes.data.forEach((item) => {
              violate_times.push(item.properties.time);
            });
            this.initTrend(legal_times, "timeTrend");
            this.initTrend(violate_times, "violateTrend");
          });
        });
      }
    },
    initTrend(times, dom) {
      let minTime = Math.min(...times);
      let maxTime = Math.max(...times);
      console.log("最大元素", maxTime);
      console.log("最小元素", minTime);
      let data = [];
      times.sort();
      times.forEach((item, index) => {
        data.push([new Date(item), index]);
      });
      let option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text:
            dom == "violateTrend"
              ? "违法摊贩数量累计趋势"
              : "合法摊贩数量累计趋势",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 20,
          },
          {
            start: 0,
            end: 20,
          },
        ],
        series: [
          {
            name: dom == "violateTrend" ? "违法摊贩" : "合法摊贩",
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {},
            data: data,
          },
        ],
      };
      this.initEchart(dom, option);
    },
  },
};
</script>

<style scoped lang="scss">
.echarts-main {
  height: 100%;
  width: 84vw;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .top {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 40vh;
    padding: 0px 5px;
    .amount {
      border: 1px solid rgb(190, 181, 166);
      width: 13vw;
      height: 100%;
      padding: 5px 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      div {
        background-color: rgb(209, 215, 215);
        padding: 4px;
      }
    }
    #legalPropor {
      border: 1px solid rgb(190, 181, 166);
      width: 30vw;
      height: 100%;
    }
    #typeAmount {
      border: 1px solid rgb(190, 181, 166);
      width: 40vw;
      height: 100%;
      margin-right: 10px;
    }
  }
  .centre {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 40vh;
    padding: 0px 5px;
    margin-top: 7px;
    #illegal {
      border: 1px solid rgb(190, 181, 166);
      width: 34vw;
      height: 100%;
    }
    #heat {
      border: 1px solid rgb(190, 181, 166);
      width: 47vw;
      height: 100%;
      margin-right: 10px;
    }
  }
  #timeTrend {
    width: 83vw;
    height: 40vh;
    padding: 0px 5px;
    margin-top: 7px;
    border: 1px solid rgb(190, 181, 166);
    box-sizing: border-box;
  }
  #violateTrend {
    width: 83vw;
    height: 40vh;
    padding: 0px 5px;
    margin-top: 7px;
    border: 1px solid rgb(190, 181, 166);
    box-sizing: border-box;
  }
}
</style>