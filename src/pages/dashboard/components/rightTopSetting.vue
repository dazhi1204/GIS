<template>
	<div class="set">
		<div class="set-header">
			<el-button type="primary" icon="el-icon-download" @click="exportExcel" :loading="loading">总表下载</el-button>
			<el-date-picker
				v-if="timeTypeId == 2"
				v-model="pickTime"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				value-format="yyyy-MM-dd"
			></el-date-picker>
			<el-date-picker
				v-model="pickTime"
				v-if="timeTypeId == 1"
				type="monthrange"
				range-separator="至"
				start-placeholder="开始月份"
				end-placeholder="结束月份"
				value-format="yyyy-MM"
			></el-date-picker>
			<div class="minutes" v-if="timeTypeId == 4">
				<el-time-select
					placeholder="起始时间"
					v-model="startTime"
					:picker-options="{
						start: '00:00',
						step: '00:15',
						end: '23:30'
					}"
				></el-time-select>
				<el-time-select
					placeholder="结束时间"
					v-model="endTime"
					:picker-options="{
						start: '00:15',
						step: '00:15',
						end: '23:45',
						minTime: startTime
					}"
				></el-time-select>
			</div>
			<div class="minutes" v-if="timeTypeId == 3">
				<el-time-select
					placeholder="起始时间"
					v-model="startTime"
					:picker-options="{
						start: '00:00',
						step: '01:00',
						end: '23:00'
					}"
				></el-time-select>
				<el-time-select
					placeholder="结束时间"
					v-model="endTime"
					:picker-options="{
						start: '01:00',
						step: '01:00',
						end: '23:00',
						minTime: startTime
					}"
				></el-time-select>
			</div>
			<el-button type="primary" @click="initData()">搜索</el-button>
			<el-button type="primary" @click="changeCheck()">调整展示指标</el-button>
			<el-button type="primary" @click="secondCheck()">重新计算指标</el-button>
		</div>
		<div class="set-body" v-show="showCheck">
			<div class="body-header">
				<span>默认展示指标</span>
				<span>
					<el-button type="primary" @click="resetTargetList()">恢复默认指标</el-button>
					<el-button type="primary" @click="giveUp()">放弃调整</el-button>
					<el-button type="primary" @click="editTargetList()">确定调整</el-button>
				</span>
			</div>
			<div class="body-table">
				<div class="table-tr" v-for="(item, index) in targetTable" :class="{ checked: checkIndex == index }" @click="checkIndex = index" :key="index">
					<div class="table-th">{{ item.tiltle }}</div>
					<div class="table-td" v-for="i in 16" :key="i">{{ item.list[i - 1] ? item.list[i - 1].name : '' }}</div>
				</div>
			</div>
		</div>
		<div class="set-footer">
			<div class="footer-header"><span>请选择需要的指标</span></div>
			<div class="footer-table">
				<el-table id="targetTable" :data="tableData" border stripe style="width: 100%" height="100%">
					<el-table-column v-for="(item, index) in tableHeader" :prop="item.key" :key="item.key" min-width="120" show-overflow-tooltip>
						<template slot="header" slot-scope="scope">
							<el-checkbox-group v-model="checkKey" :max="16">
								<el-checkbox
									v-if="showCheck && item.label !== '时间' && item.label !== '频点' && item.label !== '场景' && item.label !== '小区名称'"
									style="margin-right:.1rem;"
									:label="item.key"
									@change="state => checkTarget(state, item, index)"
								>
									{{ item.label }}
								</el-checkbox>
							</el-checkbox-group>
							<span v-if="showCheck && (item.label == '时间' || item.label == '频点' || item.label == '场景' || item.label == '小区名称')" style="color:white;">
								{{ item.label }}
							</span>
							<div v-if="showCheck && item.label !== '时间' && item.label !== '频点' && item.label !== '场景' && item.label !== '小区名称'">
								<el-input v-model="item.val"></el-input>
								<span style="margin-left:.05rem;margin-right:.05rem;">{{ thresholdLabel }}</span>
								<el-input v-model="item.large"></el-input>
							</div>
							<!-- 不能用v-show，下载会重复表头 -->
							<span v-if="!showCheck">{{ item.label }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="block">
				<el-pagination
					style="float:right"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total, prev, pager, next, jumper"
					:total="totalPage"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import chartApi from '@/api/chart';
import { mapGetters } from 'vuex';
import moment from 'moment';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
export default {
	data() {
		return {
			thresholdLabel: '<X<',
			loading: false,
			totalPage: 100,
			currentPage: 1,
			// 展示调整指标
			showCheck: false,
			// 选中时间
			pickTime: [
				moment(new Date())
					.subtract(1, 'days')
					.format('YYYY-MM-DD'),
				moment(new Date()).format('YYYY-MM-DD')
			],
			// 当前选中行
			checkIndex: 0,
			// 当前选中行的选中参数
			checkKey: [],
			checkLabel: [],
			// 当前参数
			targetTable: [],
			// 放弃调整
			targetTable1: [],
			// 恢复默认
			targetTable2: [],
			tableHeader: [],
			tableData: [],
			startTime: '00:00',
			endTime: '23:00',
			networkTypeStr: '4G'
		};
	},
	computed: {
		...mapGetters(['timeTypeId', 'time', 'cityId', 'networkType'])
	},
	watch: {
		checkIndex(val) {
			this.transformObj(val);
		},
		networkType(val) {
			if (val == '11') {
				this.networkTypeStr = '2G';
			} else if (val == '12') {
				this.networkTypeStr = '4G';
			} else {
				this.networkTypeStr = '5G';
			}
		}
		// 反向监听选中值的变化，赋值给上面
		// checkKey(val) {
		//   console.log(val)
		//   this.transformArr(val)
		// }
	},
	methods: {
		handleCurrentChange(val) {
			this.currentPage = val;
			this.initData();
		},
		getFirstTime() {
			if (this.timeTypeId == 3) {
				let second = moment(new Date())
					.subtract(1, 'hour')
					.format('YYYY-MM-DD HH:mm:ss')
					.slice(10, 19);
				var hour = second.slice(1, 3);
				this.startTime = hour + ':00';
				this.endTime =
					moment(new Date())
						.format('YYYY-MM-DD HH:mm:ss')
						.slice(11, 13) + ':00';
			} else if (this.timeTypeId == 4) {
				let second = moment(new Date())
					.subtract(15, 'minute')
					.format('YYYY-MM-DD HH:mm:ss')
					.slice(10, 19);
				let sliceP = second.slice(4, 6);
				let nowminP = '00';
				if (sliceP >= 0 && sliceP < 15) {
					nowminP = '00';
				} else if (sliceP >= 15 && sliceP < 30) {
					nowminP = '15';
				} else if (sliceP >= 30 && sliceP < 45) {
					nowminP = '30';
				} else {
					nowminP = '45';
				}
				this.startTime = second.slice(1, 4) + nowminP;

				let slice = moment(new Date())
					.format('YYYY-MM-DD HH:mm:ss')
					.slice(14, 16);
				let nowmin = '00';
				if (slice >= 0 && slice < 15) {
					nowmin = '00';
				} else if (slice >= 15 && slice < 30) {
					nowmin = '15';
				} else if (slice >= 30 && slice < 45) {
					nowmin = '30';
				} else {
					nowmin = '45';
				}
				this.endTime =
					moment(new Date())
						.format('YYYY-MM-DD HH:mm:ss')
						.slice(11, 14) + nowmin;
			}
		},
		initData() {
			let data = {};
			if (this.timeTypeId == 1) {
				this.pickTime = [
					moment(new Date())
						.subtract(1, 'month')
						.format('YYYY-MM'),
					moment(new Date()).format('YYYY-MM')
				];
				data = {
					pageNo: this.currentPage,
					cityId: this.cityId,
					timeTypeIdId: this.timeTypeId,
					startTime: this.pickTime[0],
					endTime: this.pickTime[1]
				};
			} else if (this.timeTypeId == 2) {
				data = {
					pageNo: this.currentPage,
					cityId: this.cityId,
					timeTypeIdId: this.timeTypeId,
					startTime: this.pickTime[0],
					endTime: this.pickTime[1]
				};
			} else {
				let time = this.time.slice(0, 10);
				data = {
					pageNo: this.currentPage,
					cityId: this.cityId,
					timeTypeIdId: this.timeTypeId,
					startTime: time + ' ' + this.startTime,
					endTime: time + ' ' + this.endTime,
					networkType: this.networkTypeStr
				};
				// console.log(time,'++', this.startTime, this.endTime,data,'----')
			}
			// updateIndex
			chartApi.selIndexList1(data).then(res => {
				if (res.code == 200) {
					this.tableData = res.result.arra;
					this.tableHeader = res.result.tableLaber;
					// this.tableHeader.forEach((item, index) => {
					//   this.$set(item, 'val', '')
					//   this.$set(item, 'large', '')
					// })
					this.totalPage = res.result.pageSum;
				} else {
					this.$message({
						type: 'error',
						message: '接口错误'
					});
				}
			});
		},
		// 总表下载
		exportExcel() {
			// let wb = XLSX.utils.table_to_book(document.querySelector('#targetTable'))
			// /* get binary string as output */
			// let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
			// try {
			//   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '总表' + '.xlsx')
			// } catch (e) {
			//   if (typeof console !== 'undefined') console.log(e, wbout)
			// }
			// return wbout
			let data = {};
			this.loading = true;
			if (this.timeTypeId == 1) {
				this.pickTime = [
					moment(new Date())
						.subtract(1, 'month')
						.format('YYYY-MM'),
					moment(new Date()).format('YYYY-MM')
				];
				data = {
					cityId: this.cityId,
					timeTypeIdId: this.timeTypeId,
					startTime: this.pickTime[0],
					endTime: this.pickTime[1],
					earfcnTypeId: this.networkType
				};
			} else if (this.timeTypeId == 2) {
				data = {
					cityId: this.cityId,
					timeTypeIdId: this.timeTypeId,
					startTime: this.pickTime[0],
					endTime: this.pickTime[1],
					earfcnTypeId: this.networkType
				};
			} else {
				let time = this.time.substring(0, this.time.length - 8);
				data = {
					cityId: this.cityId,
					timeTypeIdId: this.timeTypeId,
					startTime: time + `${this.startTime}`,
					endTime: time + `${this.endTime}`,
					earfcnTypeId: this.networkType
				};
			}
			chartApi.downAllIndexList(data).then(res => {
				const link = window.URL.createObjectURL(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }));
				let downLoadElement = document.createElement('a');
				downLoadElement.href = link;
				downLoadElement.download = '总表.xls';
				document.body.appendChild(downLoadElement);
				downLoadElement.click();
				document.body.removeChild(downLoadElement);
				URL.revokeObjectURL(link);
				this.loading = false;
			});
		},
		// 获取默认指标列表
		getDefaultList() {
			let data = {
				cityId: this.cityId,
				networkType: this.networkTypeStr
			};
			chartApi.getDefaultConfigurationIndicators(data).then(res => {
				if (res.code == 200) {
					this.targetTable2 = JSON.parse(JSON.stringify(res.result));
				} else {
					this.$message({
						type: 'error',
						message: '接口错误'
					});
				}
			});
		},
		// 获取指标列表
		getTargetList() {
			let data = {
				cityId: this.cityId,
				networkType: this.networkTypeStr
			};
			chartApi.getConfigurationIndicators(data).then(res => {
				if (res.code == 200) {
					this.targetTable = res.result;
					this.targetTable1 = JSON.parse(JSON.stringify(res.result));
					this.transformObj(this.checkIndex);
				} else {
					this.$message({
						type: 'error',
						message: '接口错误'
					});
				}
			});
		},
		// 调整指标列表
		editTargetList() {
			this.$confirm('确定进行调整?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let data = {
						list: this.targetTable,
						networkType: this.networkTypeStr
					};
					chartApi.editConfigurationIndicators(data).then(res => {
						if (res.code == 200) {
							this.getTargetList();
							this.editThresholdData();
							// await Promise.all([this.getTargetList(), this.editThresholdData()])
						} else {
							this.$message({
								type: 'error',
								message: '接口错误'
							});
						}
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
		},
		// 确定门限调整
		editThresholdData() {
			let data = {
				tableHeader: this.tableHeader.slice(4, this.tableHeader.length),
				earfcnTypeId: this.networkType
			};
			// networkType
			// console.log(this.tableHeader.slice(4,this.tableHeader.length), '---')
			// console.log(this.targetTable, '++++')
			chartApi.updateIndex(data).then(res => {
				if (res.code == 200) {
					this.$message({
						type: 'success',
						message: '配置门限值成功！'
					});
				} else {
					this.$message({
						type: 'error',
						message: '接口错误'
					});
				}
			});
		},
		// 放弃当前调整
		giveUp() {
			this.$confirm('将放弃当前未保存的调整，是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.targetTable = JSON.parse(JSON.stringify(this.targetTable1));
					this.transformObj(this.checkIndex);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
		},
		// 恢复默认指标列表
		resetTargetList() {
			this.$confirm('将恢复默认设置，是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.targetTable = JSON.parse(JSON.stringify(this.targetTable2));
					let data = {
						cityId: this.cityId,
						list: this.targetTable
					};
					chartApi.editConfigurationIndicators(data).then(res => {
						if (res.code == 200) {
							this.getTargetList();
						} else {
							this.$message({
								type: 'error',
								message: '接口错误'
							});
						}
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
		},
		// 将选中对象转换为数组存取，方便checkbox绑定
		transformObj(val) {
			this.checkKey = [];
			this.checkLabel = [];
			this.targetTable[val].list.forEach(item => {
				this.checkKey.push(item.englishName);
				this.checkLabel.push(item.name);
			});
		},
		// 重新组装数组
		transformArr() {
			let arr = [];

			// for (let i = 0; i < 16; i++) {
			//   arr[i] = {
			//     englishName: this.checkKey[i],
			//     name: this.checkLabel[i]
			//   }
			// }
			// 修改Bug qiangjun
			this.checkKey.forEach((item, i) => {
				arr[i] = {
					englishName: this.checkKey[i],
					name: this.checkLabel[i]
				};
			});
			this.targetTable[this.checkIndex].list = arr;
			// console.log(this.targetTable[this.checkIndex].list)
			// this.$set(this.targetTable[this.checkIndex],'list',arr)
		},
		changeCheck() {
			this.showCheck = !this.showCheck;
		},
		//重新调整指标
		secondCheck() {
			var data;
			if (this.timeTypeId == 1) {
				this.pickTime = [
					moment(new Date())
						.subtract(1, 'month')
						.format('YYYY-MM'),
					moment(new Date()).format('YYYY-MM')
				];
				data = {
					timeTypeId: this.timeTypeId,
					startTime: this.pickTime[0],
					endTime: this.pickTime[1]
				};
			} else if (this.timeTypeId == 2) {
				data = {
					timeTypeId: this.timeTypeId,
					startTime: this.pickTime[0],
					endTime: this.pickTime[1]
				};
			} else {
				let time = this.time.substring(0, this.time.length - 8);
				data = {
					timeTypeId: this.timeTypeId,
					startTime: time + `${this.startTime}` + ':00',
					endTime: time + `${this.endTime}` + ':00'
				};
			}

			chartApi.setEarfcnSceneIndexTrendsCount(data).then(res => {
				if (res.code == 200) {
					this.$message({
						message: res.massege,
						type: 'success'
					});
				}
			});
		},
		checkTarget(state, item, index) {
			if (state) {
				this.checkLabel.push(item.label);
				this.transformArr();
			} else {
				let a = this.checkLabel.indexOf(item.label);
				this.checkLabel.splice(a, 1);
				this.transformArr();
			}
		}
	},
	mounted() {
		this.getFirstTime();
		this.initData();
		this.getTargetList();
		this.getDefaultList();
		// this.transformObj(0)
	}
};
</script>

<style lang="scss" scoped>
.set {
	width: 100%;
	height: 70vh;
	display: flex;
	flex-direction: column;
	.set-header,
	.set-body,
	.set-footer {
		padding: 0 2%;
	}
	.set-header {
		height: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		/deep/ .el-date-editor {
			margin: 0 0.1rem;
		}
	}
	.set-body {
		height: 2.35rem;
		.body-header {
			height: 0.35rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.body-table {
			cursor: pointer;
			height: 1.91rem;
			border: 1px solid grey;
			overflow-x: auto;
			overflow-y: hidden;
			.table-tr {
				display: flex;
				width: 350%;
				height: 0.3rem;
				align-items: center;
				justify-content: center;
				.table-th,
				.table-td {
					// min-width: 150px;
					height: 100%;
					line-height: 0.3rem;
					border: 1px solid grey;
				}
				.table-th {
					width: 1rem;
					// background: rgb(245,247,250);
				}
				.table-td {
					width: 0.1rem;
					flex-grow: 1;
				}
			}
			.checked {
				background: rgb(64, 158, 255);
			}
		}
	}
	.set-footer {
		height: 0.1rem;
		flex-grow: 1;
		.footer-header {
			height: 0.35rem;
			display: flex;
			align-items: center;
		}
		.footer-table {
			height: calc(100% - 0.95rem);
			overflow-x: auto;
			/deep/ .el-table {
				display: flex;
				flex-direction: column;
				.el-input {
					width: 0.4rem;
					.el-input__inner {
						padding: 0;
					}
				}
				// .el-table__body-wrapper {

				// }
				.el-table__body-wrapper {
					flex: 1;
				}
			}
		}
	}
}
</style>
