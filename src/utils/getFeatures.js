export const getFeatures = function () {
    $axios.get("/poi/getFeatures").then((respois) => {
        let propertiesArr = [];
        respois.data.forEach((item) => {
            item.properties._id = item._id;
            propertiesArr.push(item.properties);
        });
        this.gridData = propertiesArr;
    });
    this.$message({
        message: "删除成功",
        type: "success",
    });
}