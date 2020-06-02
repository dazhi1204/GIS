<template>
  <div class="BlueHorn">
    <div class="lt"></div>
    <div class="rt"></div>
    <div class="rb"></div>
    <div class="lb"></div>
    <div class="title">
      分频点指标分析
      <!--<i class="setting iconfont iconjiekou"></i>-->
    </div>
    <div class="item">
      <div ref="chart"></div>
    </div>
    <!--点击弹窗-->
		<point-dialog :name="this.result.mlist" :echartData="echartData" :detialData="detialData" v-if="mesFalse2" :dialogStyle="dialogStyle" @close="mesFalse2 = false">
		</point-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chartApi from '@/api/chart'
import { debounce } from '@/assets/js/debounce'
import echarts from 'echarts'
export default {
  name: "scatter",
  props: ["footer"],
  data () {
    return {
      chart: null,
      timer: '',
      idx: 0,
      isSignle: true,
      option: null,
      data: null,
      leftdata: [],
      // 弹窗参数
      mesFalse2: false,
      rowDataList: [],
      dialogStyle: '',
      echartData: null,
      detialData: null,
      result: null
    }
  },
  components: {
    pointDialog: () => import('./components/pointDialog'),
  },
  computed: {
    ...mapGetters(['QuotaList', 'SeQuota', 'screenType', 'dimen', 'checkedDatas', 'timeTypeId', 'networkType', 'cityId', 'time', 'normName', 'indexIds', 'spaceType']),
    dataRange () {
      const { checkedDatas,time, timeTypeId, indexIds, QuotaList, SeQuota,spaceType } = this
      return { checkedDatas,time, timeTypeId, indexIds, QuotaList, SeQuota,spaceType }
    }
  },
  watch: {
    dataRange (val) {
      this.initData()
    },
    screenType (val) {
      val === 1 ? this.isSignle = true : this.isSignle = false
      this.initData()
    },
    footer (val) {
      this.footer ? this.option.grid.bottom = 55 : this.option.grid.bottom = 30
      this.footer ? this.option.xAxis.axisLabel.margin = 25 : this.option.xAxis.axisLabel.margin = 15
      this.chart.clear();
      this.chart.setOption(this.option)
      this.chart.resize()
    }
  },
  methods: {
    initData () {
      if (this.isSignle) {
        let params = {
          "type": 1,
          "cityId": this.cityId,
          "timeType": this.timeTypeId,
          "time": this.time,
          "earfcnsId": this.checkedDatas.toString(),
          "indexId": this.indexIds,
          "indexId2": 0,
          "earfcnTypeId": this.networkType
        }
        chartApi.selIndexAnalyse(params).then(res => {
          this.result = res.result
          this.initChart()
        })
      } else {
        let indexIds = this.screenType == 2 ? this.SeQuota : this.QuotaList
        let params = {
          "cityId": this.cityId,
          "timeType": this.timeTypeId,
          "time": this.time,
          "earfcnIds": this.checkedDatas.toString(),
          "indexIds": indexIds.toString(),
          "earfcnTypeId": this.networkType
        }
        chartApi.selIndexAnalyse2(params).then(res => {
          this.result = res.result
          // this.resultArray = data.resultArray
          this.initChart()
        })
      }
    },
    initChart () {
      try {
        var itemStyle = {
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        };
        this.option = {
          color: ['red', 'yellow', 'blue', 'green'],
          // tooltip: {
          //   trigger: 'axis',
          //   axisPointer: {
          //     type: 'cross',
          //     crossStyle: {
          //       color: '#999'
          //     }
          //   }
          // },
          legend: {
            type: 'scroll',
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
            left: 60,
            right: 80,
            top: 30,
            bottom: 30
          },
          // tooltip: {
          //   triggerOn: 'click',
          //   padding: 10,
          //   backgroundColor: '#222',
          //   borderColor: '#777',
          //   borderWidth: 1,
          //   formatter: function (obj) {
          //       var value = obj.value;
          //       return '12213';
          //   }
          // },
          tooltip: {
            // triggerOn: 'click',
            // padding: 10,
            show: true,
            backgroundColor: '#222',
            // borderColor: '#777',
            // borderWidth: 1
            // formatter: function (obj) {
            //     var value = obj.value;
            //     return '12213';
            // }
          },
          xAxis: {
            type: 'category',
            // nameLocation: 'start',
            // name: '日期',
            nameGap: 5,
            // max: this.result.xArray.length - 1,
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#528BB2'
              }
            },
            axisLabel: {
              color: '#7FC6EC',
              interval: 0,
              rotate: 20,
              margin: 15,
              formatter: (val) => {
                return this.result.xArray[val - 1]
              }
            }
          },
          yAxis: {
            type: 'value',
            // name: 'AQI指数',
            // nameLocation: 'end',
            nameGap: 5,
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            rich: {
              a: {
                width: 10
              }
            },
            axisLabel: {
              color: '#7FC6EC'
            },
            axisLine: {
              lineStyle: {
                color: '#528BB2'
              }
            },
            splitLine: {
              show: false
            }
          },
          visualMap: [
            {
              show: false,
              left: 'right',
              top: '12%',
              dimension: 2,
              itemHeight: '30%',
              calculable: true,
              precision: 0.1,
              text: ['大小'],
              textGap: 10,
              textStyle: {
                color: '#fff',
                width: 5
              },
              inRange: {
                symbolSize: [10, 30]
              },
              outOfRange: {
                symbolSize: [10, 30],
                color: ['rgba(255,255,255,.2)']
              },
              controller: {
                inRange: {
                  color: ['#c23531']
                },
                outOfRange: {
                  color: ['#444']
                }
              }
            },
            {
              left: 'right',
              bottom: '20%',
              dimension: 3,
              itemHeight: '30%',
              max: this.result.countm.max,
              min: this.result.countm.min,
              precision: 0.1,
              text: ['同指标小区个数'],
              textGap: 1,
              textStyle: {
                color: '#fff'
              },
              inRange: {
                colorLightness: [1, 0.5]
              }
            }
          ]
        }

        this.option.series = []
        this.result.data.forEach((item, index) => {
          this.option.series.push({
            name: this.result.xArray[index],
            type: 'scatter',
            itemStyle: itemStyle,
            data: item
          })
        })
        let num = this.result.mlist.length
        if (num == 1) {
          this.option.yAxis.max = this.result.mlist[0].max
          this.option.yAxis.min = this.result.mlist[0].min
          this.option.yAxis.name = this.result.mlist[0].pname.replace(/(.{7})/g,'$1\n')
        } else if (num == 2) {
          // y轴指标1，x轴指标2，明暗指标3，大小指标4
          this.option.yAxis.max = this.result.mlist[0].max
          this.option.yAxis.min = this.result.mlist[0].min
          this.option.yAxis.name = this.result.mlist[0].pname
          this.option.xAxis.max = this.result.mlist[1].max
          this.option.xAxis.min = this.result.mlist[1].min
          this.option.xAxis.name = this.result.mlist[1].pname.replace(/(.{7})/g,'$1\n')
          this.option.xAxis.type = 'value'
          this.option.xAxis.axisLabel = {
            color: '#7FC6EC',
            rotate: 20
          }
        } else if (num == 3) {
          this.option.yAxis.max = this.result.mlist[0].max
          this.option.yAxis.min = this.result.mlist[0].min
          this.option.yAxis.name = this.result.mlist[0].pname
          this.option.xAxis.max = this.result.mlist[1].max
          this.option.xAxis.min = this.result.mlist[1].min
          this.option.xAxis.name = this.result.mlist[1].pname.replace(/(.{7})/g,'$1\n')
          this.option.xAxis.type = 'value'
          this.option.xAxis.axisLabel = {
            color: '#7FC6EC',
            rotate: 20
          }
          this.option.visualMap[1].max = this.result.mlist[2].max
          this.option.visualMap[1].min = this.result.mlist[2].min
          let b = this.result.mlist[2].pname.replace(/(.{7})/g,'$1\n')
          this.option.visualMap[1].text = [b]
        } else {
          this.option.yAxis.max = this.result.mlist[0].max
          this.option.yAxis.min = this.result.mlist[0].min
          this.option.yAxis.name = this.result.mlist[0].pname
          this.option.xAxis.max = this.result.mlist[1].max
          this.option.xAxis.min = this.result.mlist[1].min
          this.option.xAxis.name = this.result.mlist[1].pname.replace(/(.{7})/g,'$1\n')
          this.option.xAxis.type = 'value'
          this.option.xAxis.axisLabel = {
            color: '#7FC6EC',
            rotate: 20
          }
          this.option.visualMap[1].text = ['指标4']
          this.option.visualMap[1].max = this.result.mlist[2].max
          this.option.visualMap[1].min = this.result.mlist[2].min
          let a = this.result.mlist[2].pname.replace(/(.{7})/g,'$1\n')
          this.option.visualMap[1].text = [a]
          this.option.visualMap[0].show = true
          this.option.visualMap[0].max = this.result.mlist[3].max
          this.option.visualMap[0].min = this.result.mlist[3].min
          let b = this.result.mlist[3].pname.replace(/(.{7})/g,'$1\n')
          this.option.visualMap[0].text = [b]
        }
        this.chart = echarts.init(this.$refs.chart)
        this.chart.clear();
        this.chart.setOption(this.option)
        ///3、在渲染点击事件之前先清除点击事件
        this.chart.off('click')
        let _this = this
        this.chart.on('click', function (params) {
          let indexIds = []
          if (_this.isSignle) {
            indexIds = [_this.indexIds]
          } else {
            indexIds = _this.screenType == 2 ? _this.SeQuota : _this.QuotaList
          }
          let data = {
            "cityId": _this.cityId,
            "earfcnTypeId": _this.networkType,
            "typeId": _this.spaceType,
            "timeType": _this.timeTypeId,
            "time": _this.time,
            "indexIds": indexIds,
            "indexVals": params.value
          }
          chartApi.getIndexAnalyCellList(data).then((res) => {
            _this.echartData = params.data
            _this.detialData = res
            _this.mesFalse2 = true;
            let offsetTop = params.event.offsetY
            let offsetLeft = params.event.offsetX
            _this.dialogStyle = {
              top: `${offsetTop + 10}px`, // 往下偏移 30
              left: `${offsetLeft + 10}px` // 往左偏移 110
            }
          })
        })
      } catch (e) {
        this.chart.clear()
        console.log(e)
      }
    }
  },
  mounted () {
    this.initData()
    // this.initChart()
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
  }
}
</script>