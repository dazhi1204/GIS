<template>
	<div class="BlueHorn">
		<div class="lt"></div>
		<div class="rt"></div>
		<div class="rb"></div>
		<div class="lb"></div>
		<i class="setting iconfont iconjiekou" @click="goSetting"></i>

		<!-- 弹窗内容 -->
		<asp-dialog v-bind="dialogOption"
                class="home-dialog"
                :view.sync="dialogOption.view" 
                :visible.sync="dialogOption.show">
			<component :is="dialogOption.view" @close="closeDynamicDialog">
			</component>
		</asp-dialog>

		<div class="warp">
			<div class="item" :class="{ active: index === activeIndex }" v-for="(item, index) in tabData" :key="index" @click="active(index)">
				<div class="title"><img src="../../assets/img/icon/title.png" />{{ item.pname }}</div>
				<div class="body">
					<div class="con">
						<img src="../../assets/img/icon/title-con.png" />
					</div>
					<div class="value">
						{{ item.val }}
					</div>
					<div class="ratio">
						环比
						<span :style="{color: item.compareNo > 0 ? '#01c281' : 'red'}">{{ showRatio(item.compareNo) }}</span>
						<img v-if="item.compareNo > 0" src="../../assets/img/icon/up.png" />
						<img v-else src="../../assets/img/icon/down.png" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import chartApi from '@/api/chart'
import addimg from '@/assets/img/icon_rising.png'
import fallimg from '@/assets/img/icon_falling.png'
export default {
  name: "rightTop",
  props: ["id"],
  components: {
    setting: () => import('./components/rightTopSetting')
  },
  data () {
    return {
      tabData: [],
      activeIndex: 0,
      dialogOption: {
        show: false,
        view: null,
        title: '参数设置',
        width: '600px'
      },
      normName:'',
      indexIds: '',
      pname: ''
    };
  },
  computed: {
    ...mapGetters(['cityId','time','networkType']),
    dataRange () {
      const { time, cityId,networkType } = this
      return { time, cityId,networkType }
    }
  },
  watch: {
    id: {
      handler (val) {
        this.initData()
      },
      immediate: true
    },
    dataRange: {
      handler (val) {
        this.initData()
      },
      immediate: true
    },
    normName: {
      handler (val) {
        this.$store.commit('controlLeft/SET_NORMNAME', val)
      }
    },
    indexIds: {
      handler (val) {
        this.$store.commit('controlLeft/SET_INDEXIDS', val)
      }
    },
    pname: {
      handler (val) {
        this.$store.commit('controlLeft/SET_PNAME', val)
      }
    }
  },
  mounted () {
  },
  methods: {
    goSetting () {
      // this.$router.push({
      //   path: '/setting'
      // })
      this.showDynamicDialog('setting', '设置', '70vw')
    },
    closeDynamicDialog (boolean) {
      this.dialogOption = {
        show: false,
        view: null,
        title: '',
        width: '0px'
      }
    },
    showDynamicDialog (view, title, width = '560px') {
      this.dialogOption.show = true
      this.dialogOption.view = view
      this.dialogOption.title = title
      this.dialogOption.width = width
    },
    initData () {
      let params = {
        "cityId": this.cityId,
        "id": this.id,
        "time": this.time,
        "earfcnTypeId": this.networkType
      }
      chartApi.selIndexList(params).then(res => {
        this.tabData = res.result.slice(0, 16)
        // test
        // this.tabData = res.result.concat(res.result)
        this.normName = this.tabData[this.activeIndex].name;
        this.indexIds = this.tabData[this.activeIndex].id
        this.pname = this.tabData[this.activeIndex].pname
      })
    },
    active (index) {
      this.activeIndex = index;
      this.normName = this.tabData[index].name;
      this.indexIds = this.tabData[index].id
      this.pname = this.tabData[index].pname
    },
    imgShow (item) {
      return item < 0 ? fallimg : addimg
    },
    showRatio (item) {
      let num = Number(item * 100).toFixed(2)
      return num < 0 ? `下降   ${num}%` : `上升   ${num}%`
    }
  }
}
</script>

<style lang="scss" scoped>
	.setting {
		position: absolute;
		right: 0.1rem;
		top: 0.1rem;
		font-size: 20px;
		color: #4ceef6;
		cursor: pointer;
	}
	
	.warp {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
    overflow-y: auto;
		.item {
			width: 50%;
			height: 50%;
			padding: 0 8px;
			border-radius: 4px;
			border: 1px solid rgb(6, 35, 87);
			.title {
				display: flex;
				width: 100%;
				height: calc(40% - 2px);
				align-items: center;
				font-size: 0.18rem;
				color: #fff;
				line-height: 18px;
			}
			// .line {
			//   height: 2px;
			//   width: 100%;
			//   background: -webkit-linear-gradient(
			//     left,
			//     rgba(255, 255, 255, 0),
			//     #7139b9,
			//     rgba(255, 255, 255, 0)
			//   );
			//   background: linear-gradient(
			//     to right,
			//     rgba(255, 255, 255, 0),
			//     #7139b9,
			//     rgba(255, 255, 255, 0)
			//   );
			// }
			.body {
				position: relative;
				height: 60%;
				display: flex;
				flex-direction: column;
				.con {
					position: absolute;
					top: -.1rem;
					height: 100%;
					width: 20px;
					&>img {
						height: 100%;
					}
				}
				.value {
					height: 65%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
				}
				.ratio {
					height: 35%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
		.active {
			background: #080841;
			box-shadow: 0 0 25px blueviolet inset;
		}
	}
  .BlueHorn {
    ::-webkit-scrollbar-track-piece {
        //滚动条凹槽的颜色，还可以设置边框属性
        background-color: rgb(1, 4, 60);
        margin-right: 2px;
    }
    ::-webkit-scrollbar {
        //滚动条的宽度
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-thumb {
        //滚动条的设置
        background-color: #3661b3;
        border-radius: 6px;
        background-clip: padding-box;
        min-height: 20px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
    }
    scrollbar-arrow-color: rgba(4, 16, 77, 0.1); /**/ /*三角箭头的颜色*/
    scrollbar-face-color: #3661b3; /**/ /*立体滚动条的颜色*/
    scrollbar-3dlight-color: #3661b3; /**/ /*立体滚动条亮边的颜色*/
    scrollbar-highlight-color: rgba(
        4,
        16,
        77,
        0.1
    ); /**/ /*滚动条空白部分的颜色*/
    scrollbar-shadow-color: #3661b3; /**/ /*立体滚动条阴影的颜色*/
    scrollbar-darkshadow-color: #3661b3; /**/ /*立体滚动条强阴影的颜色*/
    scrollbar-track-color: rgba(4, 16, 77, 0.1); /**/ /*立体滚动条背景颜色*/
    scrollbar-base-color: #3661b3; /**/ /*滚动条的基本颜色*/
  }
</style>