
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
      // map.setLayoutProperty('violateClusters', 'visibility', 'none');
      // map.setLayoutProperty('violateCluster-count', 'visibility', 'none');
      // map.setLayoutProperty('violateIcon', 'visibility', 'none');
      this.isHeat = true;
      this.$store.commit("changeHeat",true);
    },
    DTdiplay(minTime, maxTime) {//动态显示
      if (this.interval) {
        this.endDTdiplay()
      } else {
        console.log("动态显示最大最小时间",maxTime,minTime)
        map.setLayoutProperty('allLegalPoiLayer', 'visibility', 'visible');
        map.setLayoutProperty('vendorPois-heat', 'visibility', 'none');
        map.setLayoutProperty('clusters', 'visibility', 'none');
        map.setLayoutProperty('cluster-count', 'visibility', 'none');
        map.setLayoutProperty('icon-image', 'visibility', 'none');
        // map.setLayoutProperty('violateClusters', 'visibility', 'none');
        // map.setLayoutProperty('violateCluster-count', 'visibility', 'none');
        // map.setLayoutProperty('violateIcon', 'visibility', 'none');
        this.interval = window.setInterval(() => {
          map.setFilter('allLegalPoiLayer', ["all", ['>=', 'time', minTime], ['<=', 'time', minTime + 57594642]]);
          minTime += 157594642;
          if (minTime > maxTime) {
            this.endDTdiplay()
          }
        }, 900)
      }
    },
    endDTdiplay() {
      clearInterval(this.interval)
      map.setLayoutProperty('allLegalPoiLayer', 'visibility', 'none');
      this.interval = null
      map.setLayoutProperty('vendorPois-heat', 'visibility', 'none');
      map.setLayoutProperty('clusters', 'visibility', 'visible');
      map.setLayoutProperty('cluster-count', 'visibility', 'visible');
      map.setLayoutProperty('icon-image', 'visibility', 'visible');
      // map.setLayoutProperty('violateClusters', 'visibility', 'visible');
      // map.setLayoutProperty('violateCluster-count', 'visibility', 'visible');
      // map.setLayoutProperty('violateIcon', 'visibility', 'visible');
    }
  },
  watch:{
    isHeat(newValue,oldValue){
         if(newValue&&!this.$store.state.isCollapse) {
          this.$store.commit('collapseMenu');
         }
    }
  }
}