<template>
  <div class="BlueHorn">
    <div class="lt"></div>
    <div class="rt"></div>
    <div class="rb"></div>
    <div class="lb"></div>
    <div class="title">分频点小区数统计
      <el-dropdown trigger="click"
                   class="setting">
        <i class="iconfont iconjiekou"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="download()">下载工参模板</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="scence('下载分场景工参', 'download')">下载分场景工参</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="scence('新建分场景工参', 'new')">新建分场景工参</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="scence('删除分场景工参', 'del')">删除分场景工参</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="item">
      <div ref="chart"></div>
    </div>
    <!-- 弹窗内容 -->
    <asp-dialog v-bind="dialogOption"
                class="home-dialog"
                :view.sync="dialogOption.view"
                :visible.sync="dialogOption.show">
      <component :is="dialogOption.view"
                 :type="dialogOption.type"
                 @close="closeDynamicDialog">
      </component>
    </asp-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chartApi from '@/api/chart'
import { debounce } from '@/assets/js/debounce'
import echarts from 'echarts'
export default {
  name: "leftTop",
  props: ['footer'],
  components: {
    // 页面组件
    scence: () => import('./components/scence')
  },
  data () {
    return {
      chart: null,
      timer: '',
      idx: 0,
      angleAxisData: [],
      seriesData: [],
      dataList: {},
      checklist: [],
      dialogOption: {
        show: false,
        view: null,
        title: '参数设置',
        width: '600px'
      }
    };
  },
  computed: {
    ...mapGetters(['senceList', 'checkedDatas', 'spaceCheckId', 'spaceCheck', 'networkType', 'spaceType', 'checkedData', 'cityId', 'dimen'])
  },
  watch: {
    cityId (val) {
      this.initData()
	  
    },
    footer (val) {
      this.chart.resize()
    },
    spaceType (val) {
      // this.checklist = JSON.parse(JSON.stringify(this.dataList[val]))
      // this.changeData()
      this.initData()
    },
    networkType (val) {
      // this.checklist = JSON.parse(JSON.stringify(this.dataList[val]))
      // this.changeData()
      this.initData()
    },
    dimen (val) {
      this.initData()
    },
    // checkedData (val) {
    //   let tab = this.dimen == "network" ? this.networkType : this.spaceType
    //   // 从全选状态过滤勾选值
    //   if (this.dataList[tab]) {
    //     this.checklist = this.dataList[tab].filter(function (item) {
    //       return val.indexOf(item.name) >= 0
    //     })
    //     this.changeData()
    //     this.initChart()
    //   }
    // },
    // spaceCheck (val) {
    //   let tab = this.dimen == "network" ? this.networkType : this.spaceType
    //   // 从全选状态过滤勾选值
    //   if (this.dataList[tab]) {
    //     this.checklist = this.dataList[tab].filter(function (item) {
    //       return val.indexOf(item.name) >= 0
    //     })
    //     this.changeData()
    //     this.initChart()
    //   }
    // }
  },
  methods: {
    // 切换图表数据
    // changeData () {
    //   this.angleAxisData = []
    //   this.seriesData = []
    //   // 显示默认加载数据
    //   this.checklist.forEach((item, index) => {
    //     // 给serise添加初始状态,此时不能赋值
    //     if (index == 0) {
    //       item.coslist.forEach(i => {
    //         this.seriesData.push({
    //           type: 'bar',
    //           data: [],
    //           coordinateSystem: 'polar',
    //           name: i.coverageScene,
    //           stack: 'a'
    //         })
    //       })
    //     }
    //     this.angleAxisData.push(item.name)
    //   })
    //   // console.log(this.seriesData)
    //   // 有初始状态后赋值
    //   this.checklist.forEach(item => {
    //     // 给serise逐个添加数值
    //     item.coslist.forEach((i, index) => {
    //       this.seriesData[index].data.push(i.val)
    //     })
    //   })
    // },
    // 获取维度数据
    initData () {
      let param = {
        cityId: this.cityId,
        type: this.dimen !== "network" ? this.spaceType : this.networkType
      }
      if (this.dimen !== "network") {
        chartApi.selEarfcnList(param).then(res => {
          if (res.code == 200) {
            let data = res.result
            // 一次接收所有数据，存储为datalist对象
            // let a = (new Date()).valueOf()
            data.forEach(item => {
              if (item.name == '2G') {
                this.dataList['11'] = item.earfcns
              } else if (item.name == '4G') {
                this.dataList['12'] = item.earfcns
              } else {
                this.dataList['13'] = item.earfcns
              }
              // this.dataList[item.name] = item.earfcns
            })
            this.angleAxisData = []
            this.seriesData = []
            this.dataList[this.networkType].forEach((item, index) => {
              // 动态渲染serise,给serise添加初始状态,此时不能赋值
              if (index == 0) {
                item.coslist.forEach(i => {
                  this.seriesData.push({
                    type: 'bar',
                    data: [],
                    coordinateSystem: 'polar',
                    name: i.coverageScene,
                    stack: 'a'
                  })
                })
              }
              this.angleAxisData.push(item.name)
            })
            // 有初始状态后赋值，此时不能用checklist的值（获取不到），用datalist
            this.dataList[this.networkType].forEach(item => {
              // 给serise逐个添加数值
              item.coslist.forEach((i, index) => {
                this.seriesData[index].data.push(i.val)
              })
            })
            this.initChart()
          } else {
            this.$message({
              type: 'warning',
              message: res.massege
            });
          }
          // let b = (new Date()).valueOf()
          // console.log(b - a)
        })
      } else {
        chartApi.selSceneList(param).then(res => {
          if (res.code == 200) {
            let data = res.result
            //console.log(data)
            // 一次接收所有数据，存储为datalist对象
            // let a = (new Date()).valueOf()
            data.forEach(item => {
              if (item.name == '场景') {
                this.dataList['21'] = item.earfcns
              } else if (item.name == 'OMC') {
                this.dataList['22'] = item.earfcns
              } else {
                this.dataList['23'] = item.earfcns
              }
              // this.dataList[item.name] = item.earfcns
            })
            this.angleAxisData = []
            this.seriesData = []
            this.dataList[this.spaceType].forEach((item, index) => {
              // 动态渲染serise,给serise添加初始状态,此时不能赋值
              if (index == 0) {
                item.coslist.forEach(i => {
                  this.seriesData.push({
                    type: 'bar',
                    data: [],
                    coordinateSystem: 'polar',
                    name: i.coverageScene,
                    stack: 'a'
                  })
                })
              }
              this.angleAxisData.push(item.name)
            })
            // console.log(this.seriesData)
            // console.log(this.spaceType)
            // 有初始状态后赋值，此时不能用checklist的值（获取不到），用datalist
            this.dataList[this.spaceType].forEach(item => {
              // 给serise逐个添加数值
              item.coslist.forEach((i, index) => {
                this.seriesData[index].data.push(i.val)
              })
            })
            this.initChart()
          } else {
            this.$message({
              type: 'warning',
              message: res.massege
            });
          }

          // let b = (new Date()).valueOf()
          // console.log(b - a)
        })
      }
    },
    // 设置项
    download () {
      let params = {
        type: this.dimen == "network" ? this.networkType : this.spaceType
      }
      chartApi.creatExcel(params).then(res => {
        const link = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
        let downLoadElement = document.createElement('a')
        downLoadElement.href = link
        downLoadElement.download = '工参模板.xls'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(link)
      })
    },
    scence (title, type) {
      this.showDynamicDialog('scence', title, type)
    },
    // 弹窗项
    closeDynamicDialog (boolean) {
      this.dialogOption = {
        show: false,
        view: null,
        title: '',
        width: '0px'
      }
    },
    showDynamicDialog (view, title, type, width = '560px') {
      this.dialogOption.show = true
      this.dialogOption.view = view
      this.dialogOption.title = title
      this.dialogOption.type = type
      this.dialogOption.width = width
    },
    initChart () {
      // alert('11')
      try {
        const option = {
          color: ['#fff300', '#8ec31c', '#017afd'],
          textStyle: {
            color: '#fff'
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          angleAxis: {
            type: 'category',
            data: this.angleAxisData,
            z: 10
          },
          radiusAxis: {
          },
          polar: {
            center: ['60%', '50%']
          },
          series: this.seriesData,
          legend: {
            type: 'scroll',
            orient: 'vertical',
            pageTextStyle: {
              color: '#ffffff'
            },
            show: true,
            left: 20,
            textStyle: {
              color: "#fff"
            }
          }
        };
        // 临时存储选中
        if (this.dimen === 'network') {
          this.checkLabel = JSON.parse(JSON.stringify(this.checkedData))
          this.checkId = JSON.parse(JSON.stringify(this.checkedDatas))
        } else {
          this.checkLabel = JSON.parse(JSON.stringify(this.spaceCheck))
          this.checkId = JSON.parse(JSON.stringify(this.spaceCheckId))
        }
        this.chart = echarts.init(this.$refs.chart)
        this.chart.clear();
        this.chart.setOption(option)
        this.chart.off('legendselectchanged')
        this.chart.on('legendselectchanged', params => {
          console.log(this.dimen)
          console.log(this.checkedData)
          console.log(this.checkedDatas)
          console.log(this.spaceCheck)
          console.log(this.spaceCheckId)
          console.log(this.senceList)
          console.log(params)
          if (this.dimen === 'network') {
            let labelArr = [], idArr = [], objArr = []
            let i = 0
            for (let key in params.selected) {
              if (params.selected[key]) {
                labelArr.push(this.checkLabel[i])
                idArr.push(this.checkId[i])
                objArr.push({
                  sceneName: this.checkLabel[i],
                  sceneId: this.checkId[i]
                })
              }
              i = i + 1
            }
            console.log(labelArr, idArr, objArr)
            this.$store.commit('controlLeft/SET_CHECKDATA', labelArr)
            this.$store.commit('controlLeft/SET_CHECKDATAS', idArr)
            this.$store.commit('controlLeft/SET_SENCELIST', objArr)
          } else {
            let labelArr = [], idArr = [], objArr = []
            let i = 0
            for (let key in params.selected) {
              if (params.selected[key]) {
                labelArr.push(this.checkLabel[i])
                idArr.push(this.checkId[i])
                objArr.push({
                  sceneName: this.checkLabel[i],
                  sceneId: this.checkId[i]
                })
              }
              i = i + 1
            }
            this.$store.commit('controlLeft/SET_SPACECHECK', labelArr)
            this.$store.commit('controlLeft/SET_SPACECHECKID', idArr)
            this.$store.commit('controlLeft/SET_SENCELIST', objArr)
          }
          //   this.checkedId = []
          //   this.senceList = []
          //   for (let i in this.checked) {
          //     for (let j in this.dropData) {
          //       if (this.dropData[j].name == this.checked[i]) {
          //         this.senceList.push({
          //           sceneName: this.dropData[j].name,
          //           sceneId: this.dropData[j].id
          //         })
          //         this.checkedId.push(this.dropData[j].id)
          //       }
          //     }
          //   }
        })
      } catch (e) {
        console.log(e)
      }
    }
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
  }
}
</script>