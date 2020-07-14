<template>
  <div class="BlueHorn">
    <div class="lt"></div>
    <div class="rt"></div>
    <div class="rb"></div>
    <div class="lb"></div>
    <div class="title">分{{networkName}}指标{{tiemType}}级趋势图
      <span style="float:right;">
        <span class="control-btn">
          <el-button type="primary"
                     icon="el-icon-caret-left"
                     @click="minus()"></el-button>
          <el-button type="primary"
                     icon="el-icon-caret-right"
                     @click="add()"></el-button>
        </span>
      </span>
    </div>
    <div class="item">
      <span class="y-name">{{yname || pname}}</span>
      <div ref="chart"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import chartApi from '@/api/chart'
import { debounce } from '@/assets/js/debounce'
import echarts from 'echarts'
export default {
  name: 'Three2',
  data () {
    return {
      chart: null,
      seriesData: [],
      timer: null,
      // 初始x轴选中位置
      dataIndex: 0,
      xdata: [],
      max: '',
      min: '',
      max1: '',
      min1: '',
      // 定义加减初始值
      addNumber: 1,
      minusNumber: -1,
      yname: '',
      networkName: '频点',
      tiemType: '15分钟'
      // maxNumber: 100
    }
  },
  computed: {
    ...mapGetters(['QuotaListName','SequotaName','SeQuota','QuotaList','pname','spaceType', 'spaceCheckId', 'dimen', 'checkedDatas', 'timeTypeId', 'networkType', 'cityId', 'time', 'normName', 'indexIds']),
    dataRange () {
      const { SeQuota,QuotaList,spaceCheckId,spaceType, dimen,checkedDatas, networkType, cityId, timeTypeId, time, indexIds } = this
      return { SeQuota,QuotaList,spaceCheckId,spaceType, dimen,checkedDatas, networkType, cityId, timeTypeId, time, indexIds }
    }
  },
  watch: {
    dataRange (val) {
      this.initData()
    },
    timeTypeId (val) {
      let arr = ['月', '天', '小时', '15分钟']
      this.tiemType = arr[val - 1]
    },
    dimen (val) {
      this.networkName = val == "network" ? '频点' : '场景'
    }
  },
  mounted () {
    this.initData();
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
    initData () {
//    let timeString = ''
//    if (this.timeTypeId == 4 || this.timeTypeId == 3) {
//      timeString = this.time + " 23:45:00"
//    } else if (this.timeTypeId == 2) {
//      let date = new Date(this.time); //value的格式为YYYY-MM-DD
//      let month = (date.getMonth() + 1).toString().padStart(2, '0'); //获取月份，如果月份小于10加个‘0’
//      let year = date.getFullYear();
//      let day = new Date(year, month, 0);
//      timeString = this.time + "-" + day.getDate()
//    } else {
//      timeString = this.time + "-12"
//    }

      let indexIds = [this.indexIds] 
      if(this.SeQuota.length == 2) {
        indexIds = [this.indexIds, this.SeQuota[1]] 
      } else if (this.QuotaList[1]) {
        indexIds = [this.indexIds, this.QuotaList[1]] 
      } else {
        indexIds = [this.indexIds] 
      }
     // console.log(this.SeQuota,indexIds, this.QuotaList, '二和四分屏数组+++')
      let params = {
        "type": this.dimen == "network" ? 0 : 1,
        "earfcnTypeId": this.networkType,
        "timeType": this.timeTypeId,
        "cityId": this.cityId,
        "time": this.time,
        "ids": this.dimen == "network" ? this.checkedDatas : this.spaceCheckId,
        "indexIds": indexIds
      }
	  
      chartApi.get15minTrend(params).then(res => {
        if (res.code === 200) {
          let data = res.result
          this.max = data.max
          this.min = data.min
          this.xdata = data.timeArray.reverse()
          if(this.SeQuota.length == 2 || this.QuotaList[1]){
            this.max1 = data.maxr
            this.min1 = data.minr
            let leftLegend = []
            data.nameArray.forEach((item, index) => {
                  item= item +'(左)'
                  leftLegend.push(item)
            })
            let rightLegend = []
            data.nameArray.forEach((item, index) => {
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
            this.legendData = data.nameArray
            this.seriesData = []
            data.dataArray.forEach((item, index) => {
              let array = eval("(" + item + ")")
              // this.maxNumber = this.maxNumber > Math.max(...array) ? this.maxNumber : Math.max(...array)
              this.seriesData.push({
                symbol: 'none',
                name: data.nameArray[index],
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
          //console.log(res.message)
        }
      })
    },
    // echart提交事件，可考虑做成传参新式，目前单一不传
    // dispatchAction () {
    //   this.chart.dispatchAction({
    //     type: 'showTip',
    //     seriesIndex: 0,
    //     // 定位到点击位置
    //     dataIndex: this.dataIndex
    //   })
    // },
    // 将时间转为中国标准时间
    formatTime () {
    },
    add () {
      this.addNumber = this.addNumber + 1
      this.$store.commit('controlModel/SET_CHANGEVAL', this.addNumber)
    },
    minus () {
      this.minusNumber = this.minusNumber - 1
      this.$store.commit('controlModel/SET_CHANGEVAL', this.minusNumber)
    },
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
          },
          // alwaysShowContent: true,
          // triggerOn: 'none',
          // extraCssText: "z-index:111"
        },
        // dataZoom: [{
        //   type: 'inside',
        //   show: true,
        //   startValue: 0,
        //   endValue: 23
        // }],
        grid: {
          top: 30,
          left: 60,
          right: 40,
          bottom: 30
        },
        legend: {
          type: 'scroll',
          data: this.legendData,
          left: 120,
          top: 6,
          pageTextStyle: {
            color: "#ffffff"
          },
          textStyle: {
            color: "#ffffff",
            fontSize: 11
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            triggerEvent: true,
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#7FC6EC',
              interval: this.timeTypeId == 4 ? 4 : 0,
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
            data: this.xdata
          }
        ],
        yAxis: [
          {
            nameGap: 5,
            // max: this.result.xArray.length - 1,
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            type: 'value',
            min: this.min,
            max: this.max,
            // max: 10,
            // interval: this.maxNumber * 0.1,
            // splitNumber: 10,
            axisLabel: {
              color: '#7FC6EC'
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
            nameGap: 5,
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
      if (this.SeQuota.length == 2 || this.QuotaList[1]) {
        this.yname = this.SeQuota.length == 2 ? this.SequotaName[1] : this.QuotaListName[1]
        options.yAxis[1].axisLine.show = true
        options.legend.right = 100
      } else {
        options.yAxis[1].axisLine.show = false
        options.legend.right = 0
      }
      this.chart = echarts.init(this.$refs.chart)
      this.chart.clear()
      this.chart.setOption(options)

      // this.dispatchAction()
      // this.chart.on('click', params => {
      //   if (params.componentType == "xAxis") {
      //     this.dataIndex = options.xAxis[0].data.indexOf(params.value)
      //     this.$store.commit('controlLeft/SET_TIMELINE', params.value)
      //     this.dispatchAction()
      //   }
      // })
    }
  }
}
</script>

<style scoped>
</style>
