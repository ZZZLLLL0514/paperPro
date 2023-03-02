export const topBarOperate = {
    data() {
        return {
            ZBdrawerVisible: false, //周边摊贩分析抽屉
            draw: null, //绘制控件
            href: "", //导出地图路径
            features: []
        }
    },
    methods: {
        topBarClick(index) {
            let active = this.topoperateArray[index].active;
            if (active) {
                this.topoperateArray[index].active = false;
                this.map.removeControl(this.draw);
                this.draw = null;
                if(this.map.getLayer("bufferPoi")){
                    this.map.removeLayer("bufferPoi");
                    this.map.removeSource("bufferPoi")
                }
                if (index == 0) {
                    if (this.map.getLayer("queryPoi")) {
                        this.map.removeLayer("queryPoi");
                        this.map.removeSource("queryPoi");
                    }
                    this.map.off("draw.create", this.updateDraw);
                    this.map.off("draw.delete", this.updateDraw);
                    this.map.off("draw.update", this.updateDraw);
                    this.ZBdrawerVisible = false;
                }
            } else {
                if (this.topoperateArray[1].active) {
                    this.map.off("draw.create", this.updateDraw);
                    this.map.off("draw.delete", this.updateDraw);
                    this.map.off("draw.update", this.updateDraw);
                    this.map.removeControl(this.draw);
                    this.draw = null;
                }
                this.topoperateArray.forEach((item, ind) => {
                    if (ind == index) {
                        item.active = true;
                    } else item.active = false;
                });
                switch (index) {
                    case 0:

                        this.draw = new MapboxDraw({
                            displayControlsDefault: false,
                            // // Select which mapbox-gl-draw control buttons to add to the map.
                            controls: {
                                polygon: true,
                                trash: true,
                            },
                        });
                        this.map.addControl(this.draw);
                        this.topoperateArray[index].active = true;
                        this.map.on("draw.create", this.updateDraw);
                        this.map.on("draw.delete", this.updateDraw);
                        this.map.on("draw.update", this.updateDraw);
                        break;
                    case 1:
                        this.ZBdrawerVisible = false;
                        this.bufferDialogVisible = true;
                        this.topoperateArray[index].active = true;
                        if (this.draw) {
                            this.map.removeControl(this.draw);
                            this.map.off("draw.create", this.updateDraw);
                            this.map.off("draw.delete", this.updateDraw);
                            this.map.off("draw.update", this.updateDraw);
                            this.draw = null;
                        }
                        this.draw = new MapboxDraw({
                            displayControlsDefault: false, //关闭，默认绘制类型
                            // // Select which mapbox-gl-draw control buttons to add to the map.
                            controls: {
                                polygon: true,
                                trash: true,
                                line_string: true,
                                point: true,
                            },
                        });
                        this.map.addControl(this.draw);
                        // this.map.on("draw.create", this.mdraw);
                        break;
                }
            }
        }
        ,
        async updateDraw(e) {
            const data = this.draw.getAll();
            console.log("绘制结果", data.features);
            console.log("e", e);
            if (e.type == "draw.update") {
                this.features = [];
                //如果编辑要素则移除再创建
                this.map.removeLayer("queryPoi");
                this.map.removeSource("queryPoi");
            }
            let features = this.features;
            if (data.features.length > 0) {
                for (let i = 0; i < this.$store.state.legalPois.length; i++) {
                    // if (this.$store.state.legalPois[i].geometry.coordinates.length == 2) {
                    let coordinates = [
                        Number(this.$store.state.legalPois[i].geometry.coordinates[0]),
                        Number(this.$store.state.legalPois[i].geometry.coordinates[1]),
                    ];
                    let isInclude = await turf.booleanPointInPolygon(
                        turf.point(coordinates),
                        // turf.polygon(e.features[0].geometry.coordinates)
                        data.features[data.features.length-1]
                    );
                    if (isInclude) {
                        features.push(this.$store.state.legalPois[i]);
                    }
                    // }
                }
                this.map.addSource("queryPoi", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        crs: {
                            type: "name",
                            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                        },
                        features,
                    },
                });
                this.map.addLayer({
                    id: "queryPoi",
                    type: "circle",
                    source: "queryPoi",
                    paint: {
                        //对这图层的每个要素设置颜色，而不是整体赋予
                        "circle-color": "#f28cb1",
                        "circle-radius": 10,
                    },
                });
                this.ZBdrawerVisible = true;
                this.$nextTick(() => {
                    this.createZBecharts();
                });

            } else {
                this.map.removeLayer("queryPoi");
                this.map.removeSource("queryPoi");
            }
        },
        createZBecharts() {
            let cw = 0, //宠物
                gg = 0, //瓜果
                rl = 0, //肉类
                tp = 0, //甜品
                hqt = 0, //合法其他
                wx = 0, //维修
                xc = 0, //小吃
                wg = 0 //占道
            let tiem_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.features.forEach((item) => {
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
                        break;
                };
                let d = new Date(item.properties.time);
                let hours = d.getHours();
                tiem_data[hours - 1]++;
            });
            // violatePois.forEach((item) => {
            //     switch (item.properties.type) {
            //         case "卫生问题":
            //             ++ws;
            //             break;
            //         case "违规占道":
            //             ++zd;
            //             break;
            //         case "制假售假":
            //             ++sj;
            //             break;
            //         case "叫卖扰民":
            //             ++rm;
            //             break;
            //         case "不合理定价":
            //             ++dj;
            //             break;
            //         case "其他":
            //             ++wqt;
            //             break;
            //     }
            // });
            let legalPropor_option = {
                title: {
                    text: "摊贩类型数量",
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
                        name: "数量",
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
                            { value: xc, name: "熟食小吃" },
                            { value: wx, name: "缝补维修" },
                            { value: rl, name: "水产肉类" },
                            { value: tp, name: "甜品饮料" },
                            { value: cw, name: "宠物销售" },
                            { value: gg, name: "蔬菜瓜果" },
                            { value: wg, name: "占道经营" },
                            { value: hqt, name: "其他" },
                        ],
                    },
                ],
            };
            this.initEchart("vendorNumber", legalPropor_option);
            const times = [
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
            let time_option = {
                title: {
                    text: "不同时段摊贩数量",
                    left: "center",
                },
                xAxis: {
                    type: 'category',
                    data: times
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: tiem_data,
                        type: 'line',
                        smooth: true
                    }
                ]
            };
            this.initEchart("timeFB", time_option);
        },
        initEchart(domName, option) {
            let dom = document.getElementById(domName);
            let chart = echarts.init(dom);
            chart.setOption(option);
        },
        exportMap() {
            this.href = map.getCanvas().toDataURL("image/png");
        },
        ZBvendorClose() {
            this.ZBdrawerVisible = false;
        },
    }
}
