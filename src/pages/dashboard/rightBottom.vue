<template>
  <div class="BlueHorn">
    <div class="lt"></div>
    <div class="rt"></div>
    <div class="rb"></div>
    <div class="lb"></div>
    <div class="title">分场景指标天级趋势图指标
      <!--<i class="setting iconfont iconjiekou"></i>-->
    </div>
    <div class="item">
      <div ref="chart"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import chartApi from '@/api/chart'
import { debounce } from '@/assets/js/debounce'
import echarts from 'echarts'
export default {
  name: 'Three2',
  data () {
    return {
      chart: null,
      timer: null,
      seriesData: [],
      xArray: [],
      yArray: [],
      min: '',
      max: '',
      max1: '',
      min1: ''
    }
  },
  computed: {
    ...mapGetters(['QuotaListName','SequotaName','pname','SeQuota','QuotaList', 'spaceType', 'spaceCheckId', 'networkType', 'cityId', 'timeTypeId', 'time','normName', 'indexIds']),
    dataRange () {
      const { SeQuota, QuotaList, spaceType, spaceCheckId, networkType, cityId, timeTypeId, time,normName, indexIds } = this
      return { SeQuota, QuotaList, spaceType, spaceCheckId, networkType, cityId, time,normName, indexIds }
    }
  },
  watch: {
    dataRange (val) {
      this.initData()
    }
    // spaceType (val) {
    //   this.initData()
    // },
    // networkType (val) {
    //   this.initData()
    // },    
    // spaceCheckId (val) {
    //   this.initData()
    // },
    // time (val) {
    //   this.initData()
    // },
    // normName(val) {
    //   this.initData()
    // },
    // cityId(val){
    // 	this.initData()
    // }
  },
  mounted () {
    this.initData()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy () {
    // clearInterval(this.timer);
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null;
  },
  methods: {
    // 
    initChart () {
      var options = {
        color: ['red', 'yellow', 'blue', 'green'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          type: 'scroll',
          data: this.legendData,
          pageTextStyle: {
            color: '#ffffff'
          },
          left: 120,
          top: 6,
          textStyle: {
            color: "#ffffff",
            fontSize: 11
          }
        },
        grid: {
          top: 30,
          left: 60,
          right: 20,
          bottom: 30
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#7FC6EC',
              // interval: 0,
              rotate: 20
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#528BB2'
              }
            },
            data: this.xArray.reverse()
          }
        ],
        yAxis: [
          {
            name: this.pname,
            nameGap: 5,
            // max: this.result.xArray.length - 1,
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            type: 'value',
            // name: 'CPU',
            min: this.min,
            max: this.max,
            // interval: this.yArray,
            axisLabel: {
              color: '#7FC6EC',
              rotate: 20
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#528BB2'
              }
            }
          },
          {
            name: '',
            nameGap: 5,
            type: 'value',
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            type: 'value',
            min: this.min1,
            max: this.max1,
            axisLabel: {
              color: '#7FC6EC'
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            // axisLine: {
            //   lineStyle: {
            //     color: '#528BB2'
            //   }
            // },
            axisLine: {
              // 隐藏Y轴轴线
              show: false,
              lineStyle: {
                  color: '#528BB2'
              }
            }
          }
        ],
        series: this.seriesData
      }
      if(this.SeQuota.length == 2 || this.QuotaList[1]) {
        this.SeQuota.length == 2 ? options.yAxis[1].name = this.SequotaName[1].replace(/(.{7})/g,'$1\n') : options.yAxis[1].name = this.QuotaListName[1].replace(/(.{7})/g,'$1\n')
        options.yAxis[1].axisLine.show = true
        options.grid.right = 50
        options.legend.right = 100
      } else {
        options.yAxis[1].axisLine.show = false
        options.grid.right = 20
        options.legend.right = 0
      }
      this.chart = echarts.init(this.$refs.chart)
      this.chart.clear()
      this.chart.setOption(options)
    },
    initData () {
    	switch (this.timeTypeId){
    		case 1:
    			var Seltime = this.time;
    			break;
    		case 2:
    			var Seltime = this.time;
    			break;
    		case 3:
    			var Seltime = this.time.substring(0,10) +'\xa0'+ '00:00:00';
    			break;
    		case 4:
    			var Seltime = this.time.substring(0,10) +'\xa0'+ '00:00:00';
    			break;
    		default:
    			break;
      }
      let indexIds = [this.indexIds] 
      if(this.SeQuota.length == 2) {
        indexIds = [this.indexIds, this.SeQuota[1]] 
      } else if (this.QuotaList[1]) {
        indexIds = [this.indexIds, this.QuotaList[1]] 
      } else {
        indexIds = [this.indexIds] 
      }
      let params = {
        "cityId": this.cityId,
        "earfcnTypeId": this.networkType,
        "typeId": this.spaceType,
        "timeType": this.timeTypeId,
        "time":Seltime,
        "sceneIds": this.spaceCheckId,
        "indexIds": indexIds
      }
      chartApi.getSceneDayTrend(params).then(res => {
          if (res.code === 200) {
          let data = res.result
          this.max = data.max
          this.min = data.min
          this.xArray = data.timeArray
          if(this.SeQuota.length == 2 || this.QuotaList[1]){
            this.max1 = data.maxr
            this.min1 = data.minr
            let leftLegend = []
            data.sceneArray.forEach((item, index) => {
                  item= item +'(左)'
                  leftLegend.push(item)
            })
            let rightLegend = []
            data.sceneArray.forEach((item, index) => {
                 item = item +'(右)'
                 rightLegend.push(item)
            })
            this.legendData = leftLegend.concat(rightLegend)
            // console.log(this.legendData,'++++++')
            this.seriesData = []
            data.dataArray.forEach((item, index) => {
              let array = eval("(" + item + ")")
              this.seriesData.push({
                symbol: 'none',
                name: leftLegend[index],
                type: 'line',
                barWidth: '20',
                smooth: true,
                yAxisIndex: 0,
                data: array.reverse()
              })
            })
            data.dataArrayr.forEach((item, index) => {
                let array = eval("(" + item + ")")
                this.seriesData.push({
                  symbol: 'none',
                  name: rightLegend[index],
                  type: 'line',
                  barWidth: '20',
                  smooth: true,
                  yAxisIndex: 1,
                  data: array.reverse()
                })
              }) 
          } else {
            this.max1 = null
            this.min1 = null
            this.legendData = data.sceneArray
            this.seriesData = []
            data.dataArray.forEach((item, index) => {
              let array = eval("(" + item + ")")
              // this.maxNumber = this.maxNumber > Math.max(...array) ? this.maxNumber : Math.max(...array)
              this.seriesData.push({
                symbol: 'none',
                name: data.sceneArray[index],
                type: 'line',
                barWidth: '20',
                smooth: true,
                yAxisIndex: 0,
                // lineStyle: {
                //   // 折线的颜色
                //   color: "#00AAFF"
                // },
                data: array.reverse()
              })
            })
          }
          this.initChart()
        } else {
          this.chart.clear()
          console.log(res.message)
        }
        // if (res.code === 200) {
        //   let data = res.result
        //   this.max = data.max
        //   this.min = data.min
        //   // 多频点数据汇聚
        //   // let result = []
        //   // data.dataArray.forEach(item => {
        //   //   // 字符串转数组
        //   //   let array = eval("(" + item + ")")
        //   //   array.forEach((i, index) => {
        //   //     if (result[index] == null || result[index] == "") {
        //   //       result[index] = 0;
        //   //     }
        //   //     result[index] += i
        //   //   })
        //   // })
        //   this.legendData = data.earfcnArray
        //   this.seriesData = []
        //   data.dataArray.forEach((item, index) => {
        //     let array = eval("(" + item + ")")
        //     // this.maxNumber = this.maxNumber > Math.max(...array) ? this.maxNumber : Math.max(...array)
        //     this.seriesData.push({
        //       symbol: 'none',
        //       name: data.sceneArray[index],
        //       type: 'line',
        //       barWidth: '20',
        //       smooth: true,
        //       // lineStyle: {
        //       //   // 折线的颜色
        //       //   color: "#00AAFF"
        //       // },
        //       data: array.reverse()
        //     })
        //   })
          
        // //  console.log(this.yArray)
        //   this.xArray = data.timeArray
        // } else {
        //   //console.log(res.message)
        // }
      })
    }
  }
}
</script>

<style scoped>
</style>
