export const addLayer = {
    data() {
        return {
            enterPopup: null,

        }
    },
    methods: {
        initMap() {
            this.map = new mapboxgl.Map({
                container: "mapContain", //容器id
                crs: "EPSG:4326",
                center: [113.351, 23.16], // starting position
                style: "mapbox://styles/mapbox/streets-v11", // style URL
                zoom: 14.3, //地图等级
                maxZoom: 24, //最大等级
                attributionControl: false,
                preserveDrawingBuffer: true
            });
            let language = new MapboxLanguage({ defaultLanguage: "zh-Hans" });
            this.map.addControl(language);
            let geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                language: "zh-Hans", // Specify the language as German.
                mapboxgl: mapboxgl,
            });
            this.map.addControl(geocoder);
            //添加导航控件，控件的位置包括'top-left', 'top-right','bottom-left' ,'bottom-right'四种，默认为'top-right'
            this.map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
            //在所有必要数据源下载完毕、且首个可见的地图渲染完毕后立即触发。
            // this.map.addControl(
            //     new MapboxDirections({
            //         accessToken: mapboxgl.accessToken
            //     }),
            //     'top-left'
            // );

            this.map.on("load", () => {
                console.log("加载完毕");
                this.addLayer().then(()=>{
                    this.map.moveLayer("华农边界", "clusters")//把华农边界图层放在下面
                });
            });
        },
        addLayer() {
            return new Promise((resolve, reject) => {
                map.on("movestart", () => {
                    //开始拖动地图事件
                });

                map.on("moveend", () => {
                    //结束拖动地图事件
                });
                let imageArr = [
                    "cw",//宠物
                    "gg",//瓜果
                    "rl",//肉类
                    "tp",//甜品
                    "qt",//其他
                    "wx",//维修
                    "xc",//小吃
                    "wg",//违规
                    "bm"
                ];
                imageArr.forEach((item) => {
                    this.map.loadImage(
                        require("@/assets/iconImage/" + item + ".png"),
                        (error, data) => {
                            this.map.addImage(item, data);
                        }
                    );
                });
                $axios.get("/geoserver/scauBorder/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scauBorder%3AStudentDormitory&maxFeatures=50&outputFormat=application%2Fjson").then((res => {
                    this.$store.commit('addStudentDormitorySource', res.data);
                    this.map.addSource("StudentDormitory", {
                        type: "geojson",
                        data: res.data
                    });
                    this.map.addLayer({
                        id: "华农学生公寓",
                        type: "fill",
                        source: "StudentDormitory",
                        paint: {
                            "fill-opacity": 0.6, // 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
                            "fill-color": "#235797", // 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效）
                            "fill-outline-color": "#f50707",
                        },
                    });
                }))
                $axios.get("/geoserver/scauBorder/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=scauBorder%3ABorderPolygon&maxFeatures=50&outputFormat=application%2Fjson").then((res) => {//添加华农边界
                    delete res.data._id;
                    delete res.data.__v;
                    this.map.addSource("borederline", {
                        type: "geojson",
                        data: res.data,
                    });
                    map.addLayer({
                        id: "label",
                        type: "symbol",
                        source: "borederline",
                        layout: {
                            "text-field": "{NAME}",
                            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                            "text-size": [
                                "case",
                                ["boolean", ["==", ["get", "NAME"], "五山区"], false],
                                16,
                                ["boolean", ["==", ["get", "NAME"], "华山区"], false],
                                18,
                                ["boolean", ["==", ["get", "NAME"], "启林区"], false],
                                12, 12
                            ],
                        },
                        paint: {
                            // 文本类属性（需要设置 text-field）
                            "text-opacity": 1, // 文本的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
                            "text-color": "#853434", // 文本的颜色（可选，默认值为 #000000）
                            "text-halo-color": "rgba(0,0,0,0)", // 文本的光晕颜色（可选，默认值为 rgba(0,0,0,0)）
                            "text-halo-width": 1, // 文本的光晕宽度（可选，值 >= 0，默认值为 0，单位：像素）
                            "text-halo-blur": 1, // 文本的光晕模糊宽度（可选，值 >= 0，默认值为 0，单位：像素）
                            "text-translate": [0, 0], // 文本的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
                        },
                    });
                    this.map.addLayer({
                        id: "华农边界",
                        type: "fill",
                        source: "borederline",
                        paint: {
                            "fill-opacity": 0.4, // 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
                            "fill-color": "#575757", // 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效）
                            "fill-outline-color": "#f50707",
                        },
                    });
                });
                $axios.get("/poi_p/geourl").then((res) => {
                    let times = []
                    res.data.features.forEach(item => {
                        times.push(item.properties.time)
                    })

                    // console.log("最大元素",Math.max(...times))
                    // console.log("最小元素",Math.min(...times))
                    this.map.addSource("testpois", {
                        type: "geojson",
                        data: res.data
                    });
                })
                $axios.get("/poi_p/getFeatures").then((res) => {
                    res.data.map((item) => {
                        delete item._id;
                        delete item.__v;
                    });
                    let times = [];//摊贩时间数组
                    res.data.forEach((item) => {
                        times.push(item.properties.time);
                    });
                    this.$store.commit('addMaxTime', Math.max(...times));
                    this.$store.commit('addMinTime', Math.min(...times));
                    this.$store.commit('addLegalPois', res.data);
                    this.map.addSource("vendorPois", {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            crs: {
                                type: "name",
                                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                            },
                            features: res.data,
                        },
                        cluster: true,
                        clusterMaxZoom: 17, // Max zoom to cluster points on
                        clusterRadius: 35, // Radius of each cluster  clustering points (defaults to 50)
                    });
                    this.map.addSource("allVendorPois", {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            crs: {
                                type: "name",
                                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                            },
                            features: res.data,
                        },
                    });
                    map.addLayer({//聚合圆
                        id: "clusters",
                        type: "circle",
                        source: "vendorPois",
                        filter: ["has", "point_count"],
                        paint: {//对这图层的每个要素设置颜色，而不是整体赋予
                            "circle-color": [//根据point_count字段大小赋予不同颜色，下面的表达式翻译成文字就是point_count小于100时聚合园颜色为#51bbd6,大于100小于750时颜色为#f1f075,大于750时颜色为#f28cb1
                                "step",
                                ["get", "point_count"],//获取point_count字段值为该元素的值(具体为各个要素的point_count属性值)
                                "#51bbd6",
                                100,
                                "#f1f075",
                                750,
                                "#f28cb1",
                            ],
                            "circle-radius": [
                                "step",
                                ["get", "point_count"],
                                15,
                                30,
                                22,
                                100,
                                34,
                            ],
                        },
                    });
                    map.addLayer({
                        id: "cluster-count",
                        type: "symbol",
                        source: "vendorPois",
                        filter: ["has", "point_count"],
                        layout: {
                            "text-field": "{point_count_abbreviated}",
                            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                            "text-size": 10,
                        },
                    });
                    map.addLayer({//图标图层
                        id: "icon-image",
                        type: "symbol",
                        source: "vendorPois",
                        filter: ["!", ["has", "point_count"]],
                        layout: {
                            "icon-image": [
                                "case",
                                ["==", ["get", "type"], "甜品饮料"],
                                "tp",
                                ["==", ["get", "type"], "水产肉类"],
                                "rl",
                                ["==", ["get", "type"], "缝补维修"],
                                "wx",
                                ["==", ["get", "type"], "蔬菜瓜果"],
                                "gg",
                                ["==", ["get", "type"], "宠物销售"],
                                "cw",
                                ["==", ["get", "type"], "熟食小吃"],
                                "xc",
                                ["==", ["get", "type"], "占道经营"],
                                "wg",
                                "qt",
                            ], // 图标的图片（可选，这里填写在 sprite 雪碧图中图标名称）
                            "icon-size": 0.6, // 图标的大小（可选，值 >= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小）
                        },
                        // paint: {
                        //     "circle-color": "#11b4da",
                        //     "circle-radius": 4,
                        //     "circle-stroke-width": 1,
                        //     "circle-stroke-color": "#fff",
                        // },
                    });
                    map.addLayer(//添加热力图
                        {
                            id: "vendorPois-heat",
                            type: "heatmap",
                            source: "allVendorPois",
                            maxzoom: 24,
                            paint: {
                                // "heatmap-weight": [//热力图的权重,控制该点样式相比标准样式的显眼程度，也就是在整块热力图中贡献多少。根据每个要素mag属性值赋予该要素热力强度,mag值小于0时值为0，0<=mag<6时值在0~1之间线性分布,mag>=6赋予1
                                //   "interpolate",
                                //   ["linear"],
                                //   ["get", "mag"],
                                //   0,
                                //   0,
                                //   6,
                                //   1,
                                // ],
                                "heatmap-weight": 1,
                                "heatmap-intensity": [//热力图的强度,控制整个热力图的显眼程度,也就是圆的红色中心圆半径和颜色强度。根据缩放级别赋值(同上)
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    0,
                                    0.7,
                                    22,
                                    3,
                                ],
                                "heatmap-color": [//热力颜色,根据热力图强度赋值
                                    "interpolate",
                                    ["linear"],
                                    ["heatmap-density"],
                                    0,
                                    "rgba(33,102,172,0)",
                                    0.2,
                                    "rgb(103,169,207)",
                                    0.4,
                                    "rgb(209,229,240)",
                                    0.6,
                                    "rgb(253,219,199)",
                                    0.8,
                                    "rgb(239,138,98)",
                                    1,
                                    "rgb(178,24,43)",
                                ],
                                // Adjust the heatmap radius by zoom level
                                "heatmap-radius": [
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    0,
                                    2,
                                    19,
                                    20,
                                ],
                                // Transition from heatmap to circle layer by zoom level
                                // "heatmap-opacity": [
                                //   "interpolate",
                                //   ["linear"],
                                //   ["zoom"],
                                //   7,
                                //   1,
                                //   9,
                                //   0,
                                // ],
                            },
                            "layout": { // 布局类属性
                                "visibility": "none", // 可见性（可选，可选值为 none、visible，默认值为 visible）
                            },
                        },
                        "waterway-label"
                    );
                    map.addLayer({
                        id: "allLegalPoiLayer",
                        type: "circle",
                        source: "allVendorPois",
                        paint: {//对这图层的每个要素设置颜色，而不是整体赋予
                            "circle-color": "#f28cb1",
                            "circle-radius": 8,
                        },
                        layout: { // 布局类属性
                            "visibility": "none", // 可见性（可选，可选值为 none、visible，默认值为 visible）
                        },
                    })
                    map.on('mouseenter', 'clusters', () => {
                        if (this.isCancel||this.operateArray[0].active) map.getCanvas().style.cursor = 'pointer';
                    });
                    map.on('mouseleave', 'clusters', () => {

                        if (this.isCancel||this.operateArray[0].active) map.getCanvas().style.cursor = '';
                    });
                    map.on('mouseenter', 'icon-image', (e) => {
                        if (this.isCancel||this.operateArray[0].active) map.getCanvas().style.cursor = 'pointer';
                        // console.log("要素属性", map.queryRenderedFeatures(e.point))
                    });
                    map.on('mouseleave', 'icon-image', () => {
                        if (this.isCancel||this.operateArray[0].active) map.getCanvas().style.cursor = '';
                    });
                }).then(() => {
                    $axios.get("/poi_p/violate/getFeatures").then((res) => {
                        res.data.map((item) => {
                            delete item._id;
                            delete item.__v;
                        });
                        this.$store.commit('addViolatePois', res.data);
                        // this.map.addSource("legalPois", {//全部摊贩点,包括违法摊贩
                        //     type: "geojson",
                        //     data: {
                        //         type: "FeatureCollection",
                        //         crs: {
                        //             type: "name",
                        //             properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                        //         },
                        //         features: this.$store.state.legalPois,
                        //     }
                        // })
                        // map.addLayer(//添加热力图
                        //     {
                        //         id: "vendorPois-heat",
                        //         type: "heatmap",
                        //         source: "legalPois",
                        //         maxzoom: 22,
                        //         paint: {
                        //             // "heatmap-weight": [//热力图的权重,控制该点样式相比标准样式的显眼程度，也就是在整块热力图中贡献多少。根据每个要素mag属性值赋予该要素热力强度,mag值小于0时值为0，0<=mag<6时值在0~1之间线性分布,mag>=6赋予1
                        //             //   "interpolate",
                        //             //   ["linear"],
                        //             //   ["get", "mag"],
                        //             //   0,
                        //             //   0,
                        //             //   6,
                        //             //   1,
                        //             // ],
                        //             "heatmap-weight": 1,
                        //             "heatmap-intensity": [//热力图的强度,控制整个热力图的显眼程度,也就是圆的红色中心圆半径和颜色强度。根据缩放级别赋值(同上)
                        //                 "interpolate",
                        //                 ["linear"],
                        //                 ["zoom"],
                        //                 0,
                        //                 0.7,
                        //                 22,
                        //                 3,
                        //             ],
                        //             "heatmap-color": [//热力颜色,根据热力图强度赋值
                        //                 "interpolate",
                        //                 ["linear"],
                        //                 ["heatmap-density"],
                        //                 0,
                        //                 "rgba(33,102,172,0)",
                        //                 0.2,
                        //                 "rgb(103,169,207)",
                        //                 0.4,
                        //                 "rgb(209,229,240)",
                        //                 0.6,
                        //                 "rgb(253,219,199)",
                        //                 0.8,
                        //                 "rgb(239,138,98)",
                        //                 1,
                        //                 "rgb(178,24,43)",
                        //             ],
                        //             // Adjust the heatmap radius by zoom level
                        //             "heatmap-radius": [
                        //                 "interpolate",
                        //                 ["linear"],
                        //                 ["zoom"],
                        //                 0,
                        //                 2,
                        //                 19,
                        //                 20,
                        //             ],
                        //             // Transition from heatmap to circle layer by zoom level
                        //             // "heatmap-opacity": [
                        //             //   "interpolate",
                        //             //   ["linear"],
                        //             //   ["zoom"],
                        //             //   7,
                        //             //   1,
                        //             //   9,
                        //             //   0,
                        //             // ],
                        //         },
                        //         "layout": { // 布局类属性
                        //             "visibility": "none", // 可见性（可选，可选值为 none、visible，默认值为 visible）
                        //         },
                        //     },
                        //     "waterway-label"
                        // );
                        // map.addLayer({
                        //     id: "allLegalPoi",
                        //     type: "circle",
                        //     source: "legalPois",
                        //     paint: {//对这图层的每个要素设置颜色，而不是整体赋予
                        //         "circle-color": "#f28cb1",
                        //         "circle-radius": 8,
                        //     },
                        //     layout: { // 布局类属性
                        //         "visibility": "none", // 可见性（可选，可选值为 none、visible，默认值为 visible）
                        //     },
                        // })
                        // this.map.addSource("violaterPois", {
                        //     type: "geojson",
                        //     data: {
                        //         type: "FeatureCollection",
                        //         crs: {
                        //             type: "name",
                        //             properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                        //         },
                        //         features: res.data,
                        //     },
                        //     cluster: true,
                        //     clusterMaxZoom: 17, // Max zoom to cluster points on
                        //     clusterRadius: 35, // Radius of each cluster  clustering points (defaults to 50)
                        // });
                        // map.addLayer({//聚合圆
                        //     id: "violateClusters",
                        //     type: "circle",
                        //     source: "violaterPois",
                        //     filter: ["has", "point_count"],
                        //     paint: {//对这图层的每个要素设置颜色，而不是整体赋予
                        //         "circle-color": "#cb1c1c",
                        //         "circle-radius": [
                        //             "step",
                        //             ["get", "point_count"],
                        //             15,
                        //             30,
                        //             22,
                        //             100,
                        //             34,
                        //         ],
                        //     },
                        // });
                        // map.addLayer({
                        //     id: "violateCluster-count",
                        //     type: "symbol",
                        //     source: "violaterPois",
                        //     filter: ["has", "point_count"],
                        //     layout: {
                        //         "text-field": "{point_count_abbreviated}",
                        //         "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                        //         "text-size": 10,
                        //     },
                        // });
                        // map.addLayer({//图标图层
                        //     id: "violateIcon",
                        //     type: "symbol",
                        //     source: "violaterPois",
                        //     filter: ["!", ["has", "point_count"]],
                        //     layout: {
                        //         "icon-image": "wg", // 图标的图片（可选，这里填写在 sprite 雪碧图中图标名称）
                        //         "icon-size": 0.7, // 图标的大小（可选，值 >= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小）
                        //     },
                        //     // paint: {
                        //     //     "circle-color": "#11b4da",
                        //     //     "circle-radius": 4,
                        //     //     "circle-stroke-width": 1,
                        //     //     "circle-stroke-color": "#fff",
                        //     // },
                        // });
                        return ""
                    })
                });
                $axios.get("/poi_p/departmentInfo/getFeatures").then((res) => {
                    res.data.map((item) => {
                        delete item._id;
                        delete item.__v;
                    });
                    this.$store.commit('addDepartmentInfos', res.data);
                    this.map.addSource("departmentInfo", {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            crs: {
                                type: "name",
                                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                            },
                            features: res.data,
                        }
                    });
                    map.addLayer({//图标图层
                        id: "departmentIcon",
                        type: "symbol",
                        source: "departmentInfo",
                        layout: {
                            "icon-image": "bm", // 图标的图片（可选，这里填写在 sprite 雪碧图中图标名称）
                            "icon-size": 0.6, // 图标的大小（可选，值 >= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小）
                        },
                        // paint: {
                        //     "circle-color": "#11b4da",
                        //     "circle-radius": 4,
                        //     "circle-stroke-width": 1,
                        //     "circle-stroke-color": "#fff",
                        // },
                    });
                    map.on('mouseenter', 'departmentIcon', () => {
                        if (this.isCancel) map.getCanvas().style.cursor = 'pointer';
                    });
                    map.on('mouseleave', 'departmentIcon', () => {

                        if (this.isCancel) map.getCanvas().style.cursor = '';
                    });
                    return ""
                })
            })
        }
    }
}