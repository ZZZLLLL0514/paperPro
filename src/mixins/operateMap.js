// import * as turf from "@turf/turf";
export const operateMap = {
  data() {
    return {
      isShow: false,//控制显隐测距dom数据
      isLenMeasure: false, //测距状态
      isPick: false, //拾取状态
      isAreaMeasure: false, // 测面的状态
      points: [],
      jsonPoint: {
        //点要素集
        type: "FeatureCollection",
        features: [],
      },
      jsonPolygon: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
      },
      geojson: {
        //测距要素集
        type: "FeatureCollection",
        features: [],
      },
      linestring: {
        //测距要素
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
      lenValue_el: null,
      distanceContainer: null, //距离显示容器
      showEle: null,
      // tooltip: null,
      PickPopups: [], //拾取弹出框对象
      queryPopup: null,
      isCancel: true,//标识正在测量
      activeID: -1,
      lnglats: [],
      operateArray: [
        {
          active: false,
          title: "点击查询",
          name: "circular",
          img: require(`@/assets/img/circular.png`),
        },
        {
          active: false,
          title: "坐标拾取",
          name: "coordinatePicking",
          img: require(`@/assets/img/coordinatePicking.png`),
        },
        {
          active: false,
          title: "测距",
          name: "ranging",
          img: require(`@/assets/img/ranging.png`),
        },
        {
          active: false,
          title: "测面",
          name: "measurement",
          img: require(`@/assets/img/measurement.png`),
        },
      ],
    };
  },
  mounted() {

  },
  methods: {
    // 事件委托   左下侧边操作栏
    barClick(e) {
      this.isCancel = false;
      let index = e.target.getAttribute("data-index");
      let barList = this.$refs.bottomBar.getElementsByTagName("div");
      let isCancel = false;
      this.operateArray.forEach((item, actIndex) => {
        if (item.active) {
          isCancel = !isCancel;
          this.activeID = actIndex;
          switch (actIndex) {
            case 0:
              map.off("click", "icon-image", this.clickQuery)
              map.off("click", "violateIcon", this.clickQuery)
              break;
            case 1:
              this.closePick();
              break;
            case 2:
              this.cancelLength();
              break;
            case 3:
              this.cancelArea();
              break;
          }
        }
      });
      if (!isCancel || this.activeID != index) {
        switch (index) {
          case "0":
            map.on("click", "icon-image", this.clickQuery)
            map.on("click", "violateIcon", this.clickQuery)
            break;
          case "1":
            this.pickup();
            break;
          case "2":
            this.measureLength();
            break;
          case "3":
            this.measureArea();
            break;
        }
      }
      for (let i = 0, len = barList.length; i < len; i++) {
        this.operateArray.forEach((item) => {
          item.img = require(`@/assets/img/${item.name}.png`);
        });
        if (barList[i].firstElementChild.getAttribute("data-index") === index) {
          this.$nextTick(() => {
            if (!this.operateArray[index].active) {
              this.operateArray[
                index
              ].img = require(`@/assets/img/${this.operateArray[index].name}Blue.png`);
              // 排他思想 先清除所有子标签高亮标识，再给点击的当前子标签添加高亮标识
              this.operateArray.forEach((item) => {
                item.active = false;
              });
              this.operateArray[index].active = true;
            } else {
              this.operateArray.forEach((item) => {
                item.active = false;
              });
            }
            console.log("查看显影状态", this.operateArray[0].active);
            if (this.operateArray[0].active === false) {
              this.isShowSelection = false;
            }
          });
        }
      }
    },
    pickup() {//开始按钮拾取回调
      //  map=map;
      // let map = map
      // console.log("拾取",map)
      if (this.isLenMeasure || this.isLenMeasure) {
        alert("请关闭侧面或者测距功能");
      } else {
        this.isPick = true;
        map.getCanvas().style.cursor = "crosshair";
        this.showEle = document.createElement("div");
        this.showEle.setAttribute("class", "measure-area-result");
        // const option = {
        //   element: this.showEle,
        //   anchor: "left",
        //   offset: [8, 0],
        // };
        // this.tooltip = new mapboxgl.Marker(option).setLngLat([0, 0]).addTo(map);
        // this.tooltip = new mapboxgl.Marker();

        map.on("mousemove", this.drawMoveHandler);
        map.on("click", this.pickClick);
      }
    },
    pickClick(e) {//点击拾取回调
      if (this.isPick) {
        // this.lnglats.push([e.lngLat.lng, e.lngLat.lat])
        // if (this.lnglats.length > 4) {
        //   console.log("够了")
        //   $axios({
        //     method: "post",
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //     url: "http://127.0.01:3005/poi/test",
        //     // 只有params是可以传递参数的,未在express中引入bodyParser之前
        //     params: this.lnglats,
        //   }).then((res) => {
        //     console.log(res.data)
        //   })
        // }
        var pt = turf.point([e.lngLat.lng, e.lngLat.lat]);
        console.log("转墨卡托", turf.toMercator(pt))
        let lng = e.lngLat.lng.toString().substring(0, 10);
        let lat = e.lngLat.lat.toString().substring(0, 10);
        let PickPopup = new mapboxgl.Popup({
          // closeButton: false,//是否显示右上角的取消按钮
          closeOnClick: false,//点击地图不会关闭前一个popup
        }).addTo(map);
        PickPopup.setLngLat(e.lngLat)
          .setHTML(`<h4>坐标经纬度：${lng} , ${lat}</h4>`)
          .setMaxWidth("350px");
        this.PickPopups.push(PickPopup);
        PickPopup.on("close", this.closePick);
      }
    },
    closePick() {//关闭拾取回调
      if (this.showEle) {
        this.showEle.remove();
      }
      // this.tooltip.remove();
      // this.tooltip = null;
      this.isPick = false;
      this.isCancel = true
      map.getCanvas().style.cursor = "";
      this.PickPopups.forEach((item) => {
        item.remove();
      });
      map.off("mousemove", this.drawMoveHandler);
      map.off("click", this.pickClick);
    },
    measureLength() {//开始测距回调
      if (this.isAreaMeasure || this.isPick) {
        alert("请关闭侧面或者拾取功能");
      } else {
        // let map = map;
        let geojson = this.geojson;
        this.isLenMeasure = true;
        let source = map.getSource("geojson");
        if (source) {
          return;
        } else {
          this.isShow = true;

          // 禁止双击缩放
          map.doubleClickZoom.disable();
          map.getCanvas().style.cursor = "crosshair";
          this.distanceContainer = document.getElementById("coorContainer");
          this.lenValue_el = document.createElement("pre");
          this.lenValue_el.style.fontSize = "13px";
          this.lenValue_el.style.color = "#121212";
          map.addSource("geojson", {
            type: "geojson",
            data: geojson,
          });
          map.addSource("measure-points", {
            type: "geojson",
            data: this.jsonPoint,
          });
          map.addLayer({
            id: "measure-points",
            type: "circle",
            source: "measure-points",
            paint: {
              "circle-radius": 5,
              "circle-color": "#000",
            },
            filter: ["in", "$type", "Point"],
          });
          map.addLayer({
            id: "measure-lines",
            type: "line",
            source: "geojson",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#000",
              "line-width": 2.5,
            },
            filter: ["in", "$type", "LineString"],
          });
          map.on("click", this.lenClick);
          map.on("dblclick", this.drawResultHandler);
          map.on("mousemove", this.drawMoveHandler);
        }
      }
    },
    lenClick(e) {//测距点击地图回调
      if (this.isLenMeasure) {
        this.jsonPoint.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: e.lngLat,
          },
        });
        console.log("点击长度", e.lngLat)
        let geojson = this.geojson;
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        });

        if (geojson.features.length > 1) geojson.features.pop();
        this.distanceContainer.innerHTML = "";
        if (features.length) {
          const id = features[0].properties.id;
          geojson.features = geojson.features.filter(
            (point) => point.properties.id !== id
          );
        } else {
          const point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
            properties: {
              id: String(new Date().getTime()),
            },
          };

          geojson.features.push(point);
        }

        if (geojson.features.length > 1) {
          this.linestring.geometry.coordinates = geojson.features.map(
            (point) => point.geometry.coordinates
          );

          geojson.features.push(this.linestring);
          this.getLength(this.linestring);
        }
      }
    },
    getLength(linestring) {//获取长度方法
      const distance = turf.length(linestring);
      this.lenValue_el.textContent = `总长度: ${distance.toLocaleString()}km`;
      this.distanceContainer.appendChild(this.lenValue_el);
    },
    measureArea() {//开始侧面回调
      if (this.isLenMeasure || this.isPick) {
        alert("请关闭侧距或拾取功能");
      } else {
        this.isAreaMeasure = true;
        // 禁止双击缩放  
        map.doubleClickZoom.disable();
        map.getCanvas().style.cursor = "crosshair"; //设置绘制时鼠标样式，这里为十字形
        this.isShow = true;
        this.distanceContainer = document.getElementById("coorContainer");
        this.lenValue_el = document.createElement("pre");
        this.lenValue_el.style.fontSize = "13px";
        this.lenValue_el.style.color = "#121212";
        if (this.points.length != 0) {
          return;
        } else {
          map.addSource("measure-area-line", {
            type: "geojson",
            data: this.jsonPolygon,
          });
          map.addLayer({
            id: "measure-area-line",
            type: "fill",
            source: "measure-area-line",
            paint: {
              "fill-color": "#0000ff",
              "fill-opacity": 0.1,
            },
          });
          map.addLayer({
            id: "line-area-stroke",
            type: "line",
            source: "measure-area-line",
            paint: {
              "line-color": "#0000ff",
              "line-width": 2,
              "line-opacity": 0.65,
            },
          });
        }
        map.on("click", this.drawAreaClickHandler);

        map.on("dblclick", this.drawResultHandler);

        map.on("mousemove", this.drawMoveHandler);
      }
    },
    getArea(coords) {
      let pts = this.points.concat([coords]); //拼接数组，返回一个新数组，对原数组不影响
      pts = pts.concat([this.points[0]]);
      const polygon = turf.polygon([pts]);
      let area = turf.area(polygon);//使用turf模块计算面积
      if (area < 1000) {
        area = Math.round(area) + "m²" + ", 双击结束测面";
      } else {
        area = (area / 1000000).toFixed(4) + "km²" + ", 双击结束测面 ";
        this.lenValue_el.textContent = area
        this.distanceContainer.appendChild(this.lenValue_el);
      }
      return area;
    },
    drawAreaClickHandler(e) {//侧面点击地图回调
      if (this.isAreaMeasure) {
        const coords = [e.lngLat.lng, e.lngLat.lat];
        // const map = e.target;
        this.points.push(coords);
        this.jsonPoint.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
        });
        // map.getSource("measure-area-points").setData(this.jsonPoint);
      }
    },
    drawResultHandler(e) {//双击地图回调
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const map = e.target;
      map.getCanvas().style.cursor = "";
      if (this.isAreaMeasure) {
        this.points.push(coords);
        this.isAreaMeasure = false;//结束测面
        this.lenValue_el.innerHTML = this.getArea(coords).split(",")[0];
        // this.tooltip.setLngLat(coords);
        // 添加关闭按钮
        this.distanceContainer.appendChild(this.lenValue_el);
      } else if (this.isLenMeasure) {
        this.isLenMeasure = false;
      }
    },
    cancelArea() {
      map.doubleClickZoom.enable();
      // __e.stopPropagation();
      map.doubleClickZoom.enable();
      this.clearMeasureArea(map);
      this.isCancel = true

    },
    cancelLength() {
      map.doubleClickZoom.enable();
      this.isCancel = true;
      // delect_ele.remove();
      if (this.lenValue_el) {
        this.lenValue_el.remove();
      }

      this.geojson = {
        type: "FeatureCollection",
        features: [],
      };
      this.linestring = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      };
      this.jsonPoint = {
        //点要素集
        type: "FeatureCollection",
        features: [],
      };
      let source = map.getSource("geojson");
      if (source) {
        map.removeLayer("measure-lines");
        map.removeLayer("measure-points");
        map.removeSource("measure-points");
        map.removeSource("geojson");
      }
      map.off("click", this.lenClick);
      map.off("dblclick", this.drawResultHandler);
      map.off("mousemove", this.drawMoveHandler);
      this.isCancel = false
      this.isShow = false;
      this.isLenMeasure = false;

    },

    drawMoveHandler(e) {//移动鼠标回调
      let coords = [e.lngLat.lng, e.lngLat.lat];
      let map = e.target;
      if (this.isAreaMeasure) {
        map.getCanvas().style.cursor = "crosshair";
        const len = this.jsonPoint.features.length;
        if (len === 0) {
          this.lenValue_el.innerHTML = "点击地图开始测面";
          this.distanceContainer.appendChild(this.lenValue_el);
        } else if (len === 1) {
          this.lenValue_el.innerHTML = "点击地图继续测面";
          this.distanceContainer.appendChild(this.lenValue_el);
        } else {
          this.lenValue_el.innerHTML = "双击地图计算";
          let pts = this.points.concat([coords]);
          pts = pts.concat([this.points[0]]);
          this.jsonPolygon.geometry.coordinates = [pts]
          // let json = {
          //   type: "Feature",
          //   geometry: {
          //     type: "Polygon",
          //     coordinates: [pts],
          //   },
          // };
          map.getSource("measure-area-line").setData(this.jsonPolygon);
        }
        // this.tooltip.setLngLat(coords);
      } else if (this.isLenMeasure) {
        map.getCanvas().style.cursor = "crosshair";
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        });
        map.getCanvas().style.cursor = features.length
          ? "pointer"
          : "crosshair";
        let len = this.geojson.features.length
        if (len == 0) {
          this.lenValue_el.innerHTML = "点击地图开始测距";
          this.distanceContainer.appendChild(this.lenValue_el);
        } else if (len === 1) {
          this.lenValue_el.innerHTML = "点击地图继续测距";
          this.distanceContainer.appendChild(this.lenValue_el);
        } else {
          let pts = this.linestring.geometry.coordinates.concat([coords]);
          let lineJson = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: pts,
            },
          };
          let geojson = {
            type: "FeatureCollection",
            features: [lineJson],
          };
          map.getSource("geojson").setData(geojson);
          this.getLength(lineJson);

        }
      } else if (this.isPick) {
        let lng = e.lngLat.lng.toString().substring(0, 7);
        let lat = e.lngLat.lat.toString().substring(0, 6);
        this.showEle.innerHTML = `${lng},${lat}`;
        // this.tooltip.setLngLat(coords);
        //  this.tooltip.setLngLat(coords).setPopup(new mapboxgl.Popup().setHTML(`<h4>坐标经纬度：${lng},${lat}</h4>`)).addTo(map)
      }
    },
    clearMeasureArea(map) {//清除（测）面要素
      const measureResult = map._container.querySelectorAll(
        ".measure-area-result"
      );
      if (measureResult && measureResult.length > 0) {
        Array.from(measureResult).forEach((m) => {
          m.remove();
        });
      }
      let source = map.getSource("measure-area-line");
      if (source) {
        map.removeLayer("measure-area-line");
        map.removeLayer("line-area-stroke");
        map.removeSource("measure-area-line");
      }
      this.isAreaMeasure = false;
      this.points = [];
      this.jsonPoint = {
        type: "FeatureCollection",
        features: [],
      };
      this.jsonPolygon = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
      };
      if (this.lenValue_el) {
        this.lenValue_el.remove();
      }
      this.isShow = false;
      // this.tooltip = null;
      map.off("click", this.drawAreaClickHandler);

      map.off("dblclick", this.drawResultHandler);

      map.off("mousemove", this.drawMoveHandler);
    },
    clickQuery(e) {
      this.queryPopup = new mapboxgl.Popup({
        // closeButton: false,//是否显示右上角的取消按钮
        closeOnClick: true, //点击地图不会关闭前一个popup
      }).addTo(map);
      this.queryPopup.setLngLat(e.lngLat)
        .setHTML(`<h5>摊主姓名:${e.features[0].properties.name}</h5><h5>经营类型:${e.features[0].properties.type}</h5>`)
        .setMaxWidth("200px");
    }
  },

}