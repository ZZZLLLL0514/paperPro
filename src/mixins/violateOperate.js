export const violateOperate = {
    props: {
        violatedrawerVisible: {
            //摊贩信息对话框
            default: false,
        },
    },
    data() {
        return {
            violatecolumnList: [
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
                    width: "160",
                    label: "地址",
                    property: "addr",
                },
                {
                    width: "80",
                    label: "处理人",
                    property: "name",
                },
                {
                    width: "120",
                    label: "处理部门",
                    property: "department",
                }
            ],
            violategridData: [],
            violatepickMap: null,
            violatenewAddDialogVisible: false, //新增摊贩对话框
            violatenewAddForm: {
                type: "",
                date: "",
                id: "",
                addr: "",
                name: "",
                lngLat: [],
                department:""
            },
            violatedeleteIds: [], //要删除的id列表
            violatesearchID: "",
            violatefilterForm: {
                //过滤表单
                type: "",
                date: null,
            },
            violateloading: true,
            violatetotalPoi: 0, //总的摊贩数量
            violatefilterPois: [],
            violateisFilter: false, //记录是否在过滤
            violatecurrentPage: 0,
            violateisNewAdd: true,
            violateviewPopup: null,
        };
    },
    methods: {
        violatevendorInfoClose() {
            //摊贩信息弹出框关闭回调
            this.$emit("update:violatedrawerVisible", false);
        },
        violatenewAddClose(done) {
            //新增摊贩信息弹出框关闭回调
            done();
            this.violatepickMap = null;
        },
        violateeditPOI(row) {
            this.violateisNewAdd = false;
            row.date = new Date(row.time);
            this.violatenewAddForm = row;
            this.violatenewAddDialogVisible = true;
        },
        violatedeletePOI(row) {
            this.$confirm("此操作将永久删除该摊贩信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.violateloading = true;
                    $axios.delete(`/poi/delete/${row._id}`).then((res) => {
                        if (res.data.success) {
                            this.violategridData = [];
                            // debugger
                            if (this.violatefilterPois.length) {
                                for (let i = 0; i < this.violatefilterPois.length; i++) {
                                    if (row._id == this.violatefilterPois[i]._id) {
                                        this.violatefilterPois.splice(i, 1);
                                        break;
                                    }
                                }
                                let prePois = this.violatecurrentPage * 3;
                                this.violatetotalPoi = this.violatefilterPois.length;
                                for (
                                    let i = 3 * (this.violatecurrentPage - 1);
                                    i < prePois && i < this.violatefilterPois.length;
                                    i++
                                ) {
                                    this.violategridData.push(this.violatefilterPois[i]);
                                }
                            } else {
                                console.log("农夫十点过后")
                                this.getDataAfterDelete();
                            }
                            this.$message({
                                message: "删除成功",
                                type: "success",
                            });
                            this.$nextTick(() => {
                                this.violateloading = false;
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
        violateviewPoiClick(row) {
            this.violateviewPopup?.remove();
            this.$emit("update:violatedrawerVisible", false);
            this.map.flyTo({
                center: [row.lngLat[0], row.lngLat[1]],
                zoom: 17.3,
                speed: 0.5,
            });
            this.violateviewPopup = new mapboxgl.Popup({
                // closeButton: false,//是否显示右上角的取消按钮
                closeOnClick: false, //点击地图不会关闭前一个popup
            }).addTo(map);
            this.violateviewPopup
                .setLngLat(row.lngLat)
                .setHTML(`<h5>摊主姓名:${row.name}</h5><h5>经营类型:${row.type}</h5>`)
                .setMaxWidth("200px");
        },
        getDataAfterDelete() {
            console.log("当前页数",this.violatecurrentPage)
            $axios.get(`/poi/pagequery/1`).then((respois) => {
                if (respois.data.allData.length) {
                    this.violatetotalPoi = respois.data.violatetotalPoi;
                    let propertiesArr = [];
                    respois.data.allData.forEach((item) => {
                        item.properties.lngLat = item.geometry.coordinates;
                        item.properties._id = item._id;
                        propertiesArr.push(item.properties);
                    });
                    this.violategridData = propertiesArr;
                    this.violatefilterForm = {
                        type: "",
                        date: null,
                    };
                } else {
                    $axios.get("/poi/pagequery/1").then((respois) => {
                        let propertiesArr = [];
                        this.violatetotalPoi = respois.data.violatetotalPoi;
                        respois.data.allData.forEach((item) => {
                            item.properties._id = item._id;
                            item.properties.lngLat = item.geometry.coordinates;
                            propertiesArr.push(item.properties);
                        });
                        this.violategridData = propertiesArr;
                        this.violatecurrentPage = 1;
                    });
                }
            });
        },
        violatebatchDeletion() {
            if (this.violatedeleteIds.length) {
                this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.violateloading = true;
                        $axios({
                            method: "post",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: "http://127.0.01:3005/poi/deletes",
                            // 只有params是可以传递参数的,未在express中引入bodyParser之前
                            params: this.violatedeleteIds,
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.success) {
                                this.violategridData = [];
                                if (this.violatefilterPois.length) {
                                    let violatefilterPois = [];
                                    this.violatefilterPois.forEach((item) => {
                                        if (!this.violatedeleteIds.includes(item._id)) {
                                            violatefilterPois.push(item);
                                        }
                                    });
                                    this.violatefilterPois = violatefilterPois;
                                    this.violatetotalPoi = this.violatefilterPois.length;
                                    let prePois = this.violatecurrentPage * 3;
                                    for (
                                        let i = 3 * (this.violatecurrentPage - 1);
                                        i < prePois && i < this.violatefilterPois.length;
                                        i++
                                    ) {
                                        this.violategridData.push(this.violatefilterPois[i]);
                                    }
                                } else {
                                    this.getDataAfterDelete();
                                }
                                this.$message({
                                    message: "删除成功",
                                    type: "success",
                                });
                                this.$nextTick(() => {
                                    this.violateloading = false;
                                });
                            }
                        });
                        t;
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
        violatenewAdd() {
            this.violatenewAddDialogVisible = true;
            this.violateisNewAdd = true;
            this.violatenewAddForm = {
                type: "",
                name: "",
                date: "",
                id: "",
                addr: "",
                lngLat: [],
                department:""
            };
        },
        violateselectRow(row, selection) {
            //行改变选中状态事件回调
            this.violatedeleteIds = [];
            row.forEach((item) => {
                this.violatedeleteIds.push(item._id);
            });
        },
        violateselectAll(selection) {
            this.violatedeleteIds = [];
            selection.forEach((item) => {
                this.violatedeleteIds.push(item._id);
            });
        },
        violatesearchById() {
            //根据id搜索按钮回调
            $axios.get(`/poi/searchid/${this.violatesearchID}`).then((respois) => {
                if (respois.data) {
                    this.violatetotalPoi = 1;
                    let data = respois.data.properties;
                    data._id = respois.data._id;
                    data.lngLat = respois.data.geometry.coordinates;
                    this.violategridData = [data];
                } else {
                    this.violatetotalPoi = 0;
                    this.violategridData = [];
                }
            });
        },
        violatefilterClick() {
            //过滤按钮回调
            // let idArr = [];
            if (this.violatefilterForm.date) {
                let d = this.violatefilterForm.date;
                this.violatefilterForm.date =
                    d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            }
            if (this.violatefilterForm.date || this.violatefilterForm.type) {
                //设置过滤条件
                this.violateloading = true;
                $axios({
                    method: "post",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: "http://127.0.01:3005/poi/filtle",
                    // 只有params是可以传递参数的,未在express中引入bodyParser之前
                    params: this.violatefilterForm,
                }).then((respois) => {
                    if (respois.data) {
                        map.getSource("vendorPois").setData({//重新设原数据为过滤后返回的数据
                            type: "FeatureCollection",
                            features: respois.data,
                        });
                        this.violatetotalPoi = respois.data.length;
                        let propertiesArr = [];
                        respois.data.forEach((item) => {
                            item.properties._id = item._id;
                            item.properties.lngLat = item.geometry.coordinates;
                            propertiesArr.push(item.properties);
                        });
                        if (propertiesArr.length <= 3) {
                            //过滤数据小于10条则直接赋予
                            this.violategridData = propertiesArr;
                            this.violatefilterPois = propertiesArr;
                        } else {
                            //大于10条则分页
                            this.violateisFilter = true;
                            this.violatefilterPois = propertiesArr;
                            this.violategridData = [];
                            for (let i = 0; i < 3; i++) {
                                this.violategridData.push(propertiesArr[i]);
                            }
                            this.violatecurrentPage = 1;
                        }
                    } else {
                        this.violatetotalPoi = 0;
                        this.violategridData = [];
                        this.violatefilterPois = []
                    }
                    this.$nextTick(() => {
                        this.violateloading = false;
                    });
                });
            } else {
                //不设置过滤条件则请求所有数据
                this.violateloading = true;
                this.violateisFilter = false;
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
                $axios.get("/poi/pagequery/1").then((respois) => {
                    let propertiesArr = [];
                    this.violatetotalPoi = respois.data.violatetotalPoi;
                    respois.data.allData.forEach((item) => {
                        item.properties.lngLat = item.geometry.coordinates;
                        item.properties._id = item._id;
                        propertiesArr.push(item.properties);
                    });
                    this.violategridData = propertiesArr;
                    this.violatefilterPois = [];
                    this.violatecurrentPage = 1;
                    this.$nextTick(() => {
                        this.violateloading = false;
                    });
                });
            }
        },
        violatechangePage(violatecurrentPage) {
            console.log("当前页", violatecurrentPage);
            if (this.violateisFilter) {
                let prePois = violatecurrentPage * 3;
                this.violategridData = []; //清零
                for (
                    let i = 3 * (violatecurrentPage - 1);
                    i < prePois && i < this.violatefilterPois.length;
                    i++
                ) {
                    this.violategridData.push(this.violatefilterPois[i]);
                }
            } else {
                $axios.get(`/poi/pagequery/${violatecurrentPage}`).then((respois) => {
                    if (respois.data) {
                        console.log("请求数据", respois.data);
                        let propertiesArr = [];
                        respois.data.allData.forEach((item) => {
                            item.properties._id = item._id;
                            item.properties.lngLat = item.geometry.coordinates;
                            propertiesArr.push(item.properties);
                        });
                        console.log("整合数据", propertiesArr);
                        this.violategridData = propertiesArr;
                    } else {
                        this.violategridData = [];
                    }
                });
            }
        },
        violateupdateform() {
            //更新新增和过滤表单
            if (this.violateisNewAdd) {
                this.violatefilterPois = [];
                this.violatefilterForm = {
                    type: "",
                    date: null,
                };
            }

            this.violatenewAddForm = {
                type: "",
                name: "",
                date: "",
                id: "",
                addr: "",
                lngLat: [],
                department
            };
        },
        violateupdatetable(table) {
            //更新信息表
            this.violatetotalPoi = table.violatetotalPoi;
            this.violategridData = table.violategridData;
            this.violatecurrentPage = 1;
        },
    }
}