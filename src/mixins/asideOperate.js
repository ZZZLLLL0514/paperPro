
export const asideOperate = {
  data() {
    return {
      time: 1504833891990,
      interval: null
    }
  },
  methods: {
    heatAnalysis() {
      map.setLayoutProperty('vendorPois-heat', 'visibility', 'visible');
      map.setLayoutProperty('clusters', 'visibility', 'none');
      map.setLayoutProperty('cluster-count', 'visibility', 'none');
      map.setLayoutProperty('icon-image', 'visibility', 'none');
      map.setLayoutProperty('violateClusters', 'visibility', 'none');
      map.setLayoutProperty('violateCluster-count', 'visibility', 'none');
      map.setLayoutProperty('violateIcon', 'visibility', 'none');
      this.isHeat = true;
      // map.addLayer(
      //   {
      //     id: "test-heat",
      //     type: "heatmap",
      //     source: "testpois",
      //     maxzoom: 22,
      //     paint: {
      //       // "heatmap-weight": [//热力图的权重,控制该点样式相比标准样式的显眼程度，也就是在整块热力图中贡献多少。根据每个要素mag属性值赋予该要素热力强度,mag值小于0时值为0，0<=mag<6时值在0~1之间线性分布,mag>=6赋予1
      //       //   "interpolate",
      //       //   ["linear"],
      //       //   ["get", "mag"],
      //       //   0,
      //       //   0,
      //       //   6,
      //       //   1,
      //       // ],
      //       "heatmap-weight": 1,
      //       "heatmap-intensity": [//热力图的强度,控制整个热力图的显眼程度,也就是圆的红色中心圆半径和颜色强度。根据缩放级别赋值(同上)
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         0,
      //         0.7,
      //         22,
      //         3,
      //       ],
      //       "heatmap-color": [//热力颜色,根据热力图强度赋值
      //         "interpolate",
      //         ["linear"],
      //         ["heatmap-density"],
      //         0,
      //         "rgba(33,102,172,0)",
      //         0.2,
      //         "rgb(103,169,207)",
      //         0.4,
      //         "rgb(209,229,240)",
      //         0.6,
      //         "rgb(253,219,199)",
      //         0.8,
      //         "rgb(239,138,98)",
      //         1,
      //         "rgb(178,24,43)",
      //       ],
      //       // Adjust the heatmap radius by zoom level
      //       "heatmap-radius": [
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         0,
      //         2,
      //         19,
      //         20,
      //       ],
      //       // Transition from heatmap to circle layer by zoom level
      //       // "heatmap-opacity": [
      //       //   "interpolate",
      //       //   ["linear"],
      //       //   ["zoom"],
      //       //   7,
      //       //   1,
      //       //   9,
      //       //   0,
      //       // ],
      //     },
      //     "layout": { // 布局类属性
      //       // "visibility": "none", // 可见性（可选，可选值为 none、visible，默认值为 visible）
      //     },
      //   },
      //   "waterway-label"
      // );
      // map.addLayer(
      //   {
      //     id: "vendorPois-point",
      //     type: "circle",
      //     source: "testpois",
      //     // minzoom: 7,
      //     paint: {
      //       'circle-color': '#11b4da',
      //       'circle-radius': 3,
      //       'circle-stroke-width': 1,
      //       'circle-stroke-color': '#fff'
      //     }
      //   })
      // map.addLayer(
      //   {
      //     id: "vendorPois-point",
      //     type: "circle",
      //     source: "vendorPois",
      //     // minzoom: 7,
      //     paint: {
      //       // Size circle radius by earthquake magnitude and zoom level
      //       "circle-radius": [
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         7,
      //         ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
      //         16,
      //         ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
      //       ],
      //       // Color circle by earthquake magnitude
      //       "circle-color": [
      //         "interpolate",
      //         ["linear"],
      //         ["get", "mag"],
      //         1,
      //         "rgba(33,102,172,0)",
      //         2,
      //         "rgb(103,169,207)",
      //         3,
      //         "rgb(209,229,240)",
      //         4,
      //         "rgb(253,219,199)",
      //         5,
      //         "rgb(239,138,98)",
      //         6,
      //         "rgb(178,24,43)",
      //       ],
      //       "circle-stroke-color": "white",
      //       "circle-stroke-width": 1,
      //       // Transition from heatmap to circle layer by zoom level
      //       "circle-opacity": [
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         7,
      //         0,
      //         8,
      //         1,
      //       ],
      //     },
      //   },
      //   "waterway-label"
      // );
    },
    DTdiplay(minTime, maxTime) {//动态显示
      if (this.interval) {
        this.endDTdiplay()
      } else {
        map.setLayoutProperty('allLegalPoi', 'visibility', 'visible');
        map.setLayoutProperty('vendorPois-heat', 'visibility', 'none');
        map.setLayoutProperty('clusters', 'visibility', 'none');
        map.setLayoutProperty('cluster-count', 'visibility', 'none');
        map.setLayoutProperty('icon-image', 'visibility', 'none');
        map.setLayoutProperty('violateClusters', 'visibility', 'none');
        map.setLayoutProperty('violateCluster-count', 'visibility', 'none');
        map.setLayoutProperty('violateIcon', 'visibility', 'none');
        this.interval = window.setInterval(() => {
          console.log("又一个")
          map.setFilter('allLegalPoi', ["all", ['>=', 'time', minTime], ['<=', 'time', minTime + 57594642]]);
          minTime += 157594642;
          if (minTime > maxTime) {
            this.endDTdiplay()
          }
        }, 900)
      }
    },
    endDTdiplay() {
      clearInterval(this.interval)
      map.setLayoutProperty('allLegalPoi', 'visibility', 'none');
      this.interval = null
      map.setLayoutProperty('vendorPois-heat', 'visibility', 'none');
      map.setLayoutProperty('clusters', 'visibility', 'visible');
      map.setLayoutProperty('cluster-count', 'visibility', 'visible');
      map.setLayoutProperty('icon-image', 'visibility', 'visible');
      map.setLayoutProperty('violateClusters', 'visibility', 'visible');
      map.setLayoutProperty('violateCluster-count', 'visibility', 'visible');
      map.setLayoutProperty('violateIcon', 'visibility', 'visible');
    }
  }
}