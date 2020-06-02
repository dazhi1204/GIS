<template>
	<div class="BlueHorn">
		<div class="lt"></div>
		<div class="rt"></div>
		<div class="rb"></div>
		<div class="lb"></div>
		<div class="title">
			分{{ dimen === 'network' ? '频点' : '场景' }}小区数统计
			<el-dropdown trigger="click" class="setting">
				<i class="iconfont iconjiekou"></i>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item><span @click="download()">下载工参模板</span></el-dropdown-item>
					<el-dropdown-item>
						<span @click="scence(`下载分${dimen === 'network' ? '频点' : '场景'}工参`, 'download')">下载分{{ dimen === 'network' ? '频点' : '场景' }}工参</span>
					</el-dropdown-item>
					<el-dropdown-item>
						<span @click="scence('新建分频点工参', 'new')">新建分{{ dimen === 'network' ? '频点' : '场景' }}工参</span>
					</el-dropdown-item>
					<el-dropdown-item>
						<span @click="scence(`删除分${dimen === 'network' ? '频点' : '场景'}工参`, 'del')">删除分{{ dimen === 'network' ? '频点' : '场景' }}工参</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<div class="item"><div ref="chart"></div></div>
		<!-- 弹窗内容 -->
		<asp-dialog v-bind="dialogOption" class="home-dialog" :view.sync="dialogOption.view" :visible.sync="dialogOption.show">
			<component :is="dialogOption.view" :type="dialogOption.type" @close="closeDynamicDialog"></component>
		</asp-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import chartApi from '@/api/chart';
import { debounce } from '@/assets/js/debounce';
import echarts from 'echarts';
export default {
	name: 'leftTop',
	props: ['footer'],
	components: {
		// 页面组件
		scence: () => import('./components/scence')
	},
	data() {
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
		...mapGetters(['addstate', 'senceList', 'spaceCheckId', 'spaceCheck', 'networkType', 'spaceType', 'cityId', 'dimen'])
	},
	watch: {
		addstate(val) {
			this.initData();
		},
		cityId(val) {
			this.initData();
			this.initSpaceData();
		},
		footer(val) {
			this.chart.resize();
		},
		spaceType(val) {
			// this.checklist = JSON.parse(JSON.stringify(this.dataList[val]))
			this.changeData(val);
			this.initChart();
		},
		networkType(val) {
			// this.checklist = JSON.parse(JSON.stringify(this.dataList[val]))
			this.changeData(val);
			this.initChart();
		},
		dimen(val) {
			this.initData();
		}
	},
	methods: {
		// 切换图表数据
		changeData(type) {
			// console.log(this.dataList, type)
			this.angleAxisData = this.dataList[type].angleAxisArray;
			// this.legendData = this.dataList[type].legendArray
			this.seriesData = [];
			// 显示默认加载数据
			this.dataList[type].series.forEach((item, index) => {
				this.seriesData.push({
					type: 'bar',
					data: item.angleAxisData,
					coordinateSystem: 'polar',
					name: item.legengName,
					stack: 'a'
				});
			});
		},
		// 获取空间数据
		initSpaceData() {
			let param = {
				cityId: this.cityId,
				type: this.networkType
			};
			chartApi.selSceneList(param).then(res => {
				if (res.code == 200) {
					let result = res.result;
					if (this.spaceType === 21) {
						this.$store.commit('controlLeft/SET_SPACECHECK', result[0].legengArray);
						this.$store.commit('controlLeft/SET_SPACECHECKID', result[0].legengArrayId);
					} else if (this.spaceType === 22) {
						this.$store.commit('controlLeft/SET_SPACECHECK', result[1].legengArray);
						this.$store.commit('controlLeft/SET_SPACECHECKID', result[1].legengArrayId);
					} else {
						this.$store.commit('controlLeft/SET_SPACECHECK', result[2].legengArray);
						this.$store.commit('controlLeft/SET_SPACECHECKID', result[2].legengArrayId);
					}
				} else {
					this.$message({
						type: 'warning',
						message: res.massege
					});
				}

				// let b = (new Date()).valueOf()
				// console.log(b - a)
			});
		},
		// 获取维度数据
		initData() {
			let param = {
				cityId: this.cityId,
				type: this.dimen == 'network' ? this.spaceType : this.networkType
			};
			if (this.dimen == 'network') {
				chartApi.selEarfcnList(param).then(res => {
					if (res.code == 200) {
						let data = res.result;
						// 一次接收所有数据，存储为datalist对象
						// let a = (new Date()).valueOf()
						data.forEach(item => {
							if (item.name == '2G') {
								this.dataList['11'] = item;
							} else if (item.name == '4G') {
								this.dataList['12'] = item;
							} else {
								this.dataList['13'] = item;
							}
							// this.dataList[item.name] = item.series
						});
						this.changeData(this.networkType);
						this.initChart();
					} else {
						this.$message({
							type: 'warning',
							message: res.massege
						});
					}
					// let b = (new Date()).valueOf()
					// console.log(b - a)
				});
			} else {
				chartApi.selSceneList(param).then(res => {
					if (res.code == 200) {
						let data = res.result;
						//console.log(data)
						// 一次接收所有数据，存储为datalist对象
						// let a = (new Date()).valueOf()
						data.forEach(item => {
							if (item.name == '场景') {
								this.dataList['21'] = item;
							} else if (item.name == 'OMC') {
								this.dataList['22'] = item;
							} else {
								this.dataList['23'] = item;
							}
							// this.dataList[item.name] = item.series
						});
						this.changeData(this.spaceType);
						this.initChart();
					} else {
						this.$message({
							type: 'warning',
							message: res.massege
						});
					}

					// let b = (new Date()).valueOf()
					// console.log(b - a)
				});
			}
		},
		// 设置项
		download() {
			let params = {
				type: this.dimen == 'network' ? this.networkType : this.spaceType
			};
			chartApi.creatExcel(params).then(res => {
				const link = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
				let downLoadElement = document.createElement('a');
				downLoadElement.href = link;
				downLoadElement.download = '工参模板.xls';
				document.body.appendChild(downLoadElement);
				downLoadElement.click();
				document.body.removeChild(downLoadElement);
				URL.revokeObjectURL(link);
			});
		},
		scence(title, type) {
			this.showDynamicDialog('scence', title, type);
		},
		// 弹窗项
		closeDynamicDialog(boolean) {
			this.dialogOption = {
				show: false,
				view: null,
				title: '',
				width: '0px'
			};
		},
		showDynamicDialog(view, title, type, width = '560px') {
			this.dialogOption.show = true;
			this.dialogOption.view = view;
			this.dialogOption.title = title;
			this.dialogOption.type = type;
			this.dialogOption.width = width;
		},
		initChart() {
			// alert('11')
			try {
				const option = {
					color: ['#fff300', '#8ec31c', '#017afd'],
					textStyle: {
						color: '#fff'
					},
					tooltip: {
						trigger: 'item',
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					angleAxis: {
						type: 'category',
						data: this.angleAxisData,
						z: 10
					},
					radiusAxis: {},
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
							color: '#fff'
						}
					}
				};
				// console.log(this.dataList)
				// 临时存储选中
				if (this.dimen === 'network') {
					this.$store.commit('controlLeft/SET_CHECKDATA', this.dataList[this.networkType].legengArray);
					this.$store.commit('controlLeft/SET_CHECKDATAS', this.dataList[this.networkType].legengArrayId);
					this.checkLabel = JSON.parse(JSON.stringify(this.dataList[this.networkType].legengArray));
					this.checkId = JSON.parse(JSON.stringify(this.dataList[this.networkType].legengArrayId));
				} else {
					this.$store.commit('controlLeft/SET_SPACECHECK', this.dataList[this.spaceType].legengArray);
					this.$store.commit('controlLeft/SET_SPACECHECKID', this.dataList[this.spaceType].legengArrayId);
					this.checkLabel = JSON.parse(JSON.stringify(this.dataList[this.spaceType].legengArray));
					this.checkId = JSON.parse(JSON.stringify(this.dataList[this.spaceType].legengArrayId));
				}
				let senceList = [];
				this.checkId.forEach((item, i) => {
					senceList.push({
						sceneName: this.checkLabel[i],
						sceneId: item
					});
				});
				this.$store.commit('controlLeft/SET_SENCELIST', senceList);
				this.chart = echarts.init(this.$refs.chart);
				this.chart.clear();
				this.chart.setOption(option);
				this.chart.off('legendselectchanged');
				this.chart.on('legendselectchanged', params => {
					if (this.dimen === 'network') {
						let labelArr = [],
							idArr = [],
							objArr = [];
						let i = 0;
						for (let key in params.selected) {
							if (params.selected[key]) {
								labelArr.push(this.checkLabel[i]);
								idArr.push(this.checkId[i]);
								objArr.push({
									sceneName: this.checkLabel[i],
									sceneId: this.checkId[i]
								});
							}
							i = i + 1;
						}
						this.$store.commit('controlLeft/SET_CHECKDATA', labelArr);
						this.$store.commit('controlLeft/SET_CHECKDATAS', idArr);
						this.$store.commit('controlLeft/SET_SENCELIST', objArr);
					} else {
						let labelArr = [],
							idArr = [],
							objArr = [];
						let i = 0;
						for (let key in params.selected) {
							if (params.selected[key]) {
								labelArr.push(this.checkLabel[i]);
								idArr.push(this.checkId[i]);
								objArr.push({
									sceneName: this.checkLabel[i],
									sceneId: this.checkId[i]
								});
							}
							i = i + 1;
						}
						this.$store.commit('controlLeft/SET_SPACECHECK', labelArr);
						this.$store.commit('controlLeft/SET_SPACECHECKID', idArr);
						this.$store.commit('controlLeft/SET_SENCELIST', objArr);
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
				});
			} catch (e) {
				console.log(e);
			}
		}
	},
	created() {
		this.initData();
		this.initSpaceData();
	},
	mounted() {
		this.__resizeHandler = debounce(() => {
			if (this.chart) {
				this.chart.resize();
			}
		}, 100);
		window.addEventListener('resize', this.__resizeHandler);
	},
	beforeDestroy() {
		// clearInterval(this.timer);
		if (!this.chart) {
			return;
		}
		window.removeEventListener('resize', this.__resizeHandler);
		this.chart.dispose();
		this.chart = null;
	}
};
</script>
