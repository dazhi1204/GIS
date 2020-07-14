<template>
	<div class="warp">
		<div style="overflow: hidden;" class="wrap_div">
			<div style="width: 73%;float: left;" class="div_one">
				<div style="width: 20%;">
					<el-select class="city" v-model="timeVal" placeholder="请选择最小时间颗粒度">
						<el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div v-if="timeVal == 1" style="width: 20%;" class="time" id="reser">
					<el-date-picker v-model="day" type="month" :editable="false" value-format="yyyy-MM" placeholder="选择年月" @change="changeTime"></el-date-picker>
				</div>

				<div v-else-if="timeVal == 2" style="width: 24%;" class="time" id="reser">
					<el-date-picker v-model="day" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="选择年月日" @change="changeTime"></el-date-picker>
				</div>
				<div v-else-if="timeVal == 3" style="width: 41%;" class="time" id="reser">
					<el-date-picker
						style="width: 58%;"
						v-model="day"
						type="date"
						:editable="false"
						value-format="yyyy-MM-dd"
						format="yyyy-MM-dd"
						placeholder="选择日期"
						@change="changeTime"
					></el-date-picker>
					<el-select style="width: 42%;" v-model="second" placeholder="请选择时间" @change="changeTime">
						<el-option v-for="(item, index) in HourList" :key="index" :label="item.label" :value="item.label"></el-option>
					</el-select>
				</div>

				<div v-else="timeVal == 4" style="width: 41%;" class="time" id="reser">
					<el-date-picker
						style="width: 58%;"
						v-model="day"
						type="date"
						:editable="false"
						value-format="yyyy-MM-dd"
						format="yyyy-MM-dd"
						placeholder="选择日期"
						@change="changeTime"
					></el-date-picker>
					<el-select style="width: 42%;" v-model="second" placeholder="请选择时间" @change="changeTime">
						<el-option v-for="(item, index) in MinuteList" :key="index" :label="item.label" :value="item.label"></el-option>
					</el-select>
				</div>

				<el-select style="width: 20%;" class="city" v-model="ProvinceId" placeholder="请选择省份" @change="getCity">
					<el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-select style="width: 19%;" class="right-item" v-model="CityId" @change="changeCity($event)" placeholder="请选择城市">
					<el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</div>
			<div style="display:inline-block;width:26%;float: right;margin-right: 2px;">
				<el-button type="primary" @click="checkmap('center', 1)"><img src="../../../assets/img/icon/1.png" /></el-button>
				<el-button type="primary" @click="checkmap('centertwo', 2)"><img src="../../../assets/img/icon/2.png" /></el-button>
				<el-button type="primary" @click="checkmap('centerfour', 4)"><img src="../../../assets/img/icon/3.png" /></el-button>
				<el-button type="primary" @click="ShowDraw('true')"><img src="../../../assets/img/icon/4.png" /></el-button>
				<el-button type="primary" @click="Setting()"><img src="../../../assets/img/icon/5.png" /></el-button>
			</div>
		</div>
		<div style="overflow: hidden;">
			<div style="width: 39%;display:inline-block;float:left">
				<el-autocomplete v-model="village" :fetch-suggestions="querySearchAsync" placeholder="请输入小区名称" @select="handleSelect" class="village"></el-autocomplete>
			</div>

			<marquee
				style="float:right"
				class="marquee"
				align="left"
				behavior="scroll"
				bgcolor="#FF0000"
				direction="left"
				loop="-1"
				scrollamount="10"
				scrolldelay="100"
				onMouseOut="this.start()"
				onMouseOver="this.stop()"
			>
				<span v-for="(item, index) in cellList" @click="ShowList">{{ item }}</span>
			</marquee>
			<span style="display: inline-block;line-height: 28px; float: right;margin-right: 5px;">问题小区列表:</span>
		</div>
		<asp-dialog v-bind="dialogOption" class="home-dialog" :view.sync="dialogOption.view" :visible.sync="dialogOption.show">
			<component :is="dialogOption.view" @close="closeDynamicDialog"></component>
		</asp-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { selProAndCityList } from '@/api/dashboard.js';
import { getProCellName } from '@/api/dashboard.js';
import { selCellListByName } from '@/api/dashboard.js';
export default {
	name: 'controlModel',
	components: {
		cellModel: () => import('./problemcellModel')
	},
	data() {
		return {
			ProvinceId: '',
			CityId: '',
			timeVal: 4,
			ProvinceList: [],
			CityList: [],
			TimeList: [
				{
					value: 1,
					label: '1月粒度'
				},
				{
					value: 2,
					label: '1天粒粒度'
				},
				{
					value: 3,
					label: '1小时粒度'
				},
				{
					value: 4,
					label: '15分钟粒度'
				}
			],
			day: '', //日期
			second: '', //时间
			HourList: [], //小时数组
			MinuteList: [], //15分钟数组
			Time: '', //时间传参
			screenType: 1, //单分屏
			mapCenter: '',
			cellList: [], //问题小区
			dialogOption: {
				show: false,
				view: null,
				title: '参数设置',
				width: '600px'
			},
			village: '',
			restaurants: [],
			timeout: null,
			selCity: '' //下拉选择城市
		};
	},
	computed: {
		...mapGetters(['networkType', 'timeTypeId', 'spaceType', 'checkedData', 'cityId', 'dimen', 'status', 'opcity', 'normName', 'setmodel', 'changeVal', 'activePoint'])
	},
	watch: {
		timeVal: {
			handler(val) {
				this.$store.commit('controlModel/SET_TIMETYPE', val);
				this.nowTime();
				this.changeTime();
			},
			immediate: true
		},
		Time: {
			handler(val) {
				this.$store.commit('controlModel/SET_TIME', val);
				this.ProCellName();
			}
		},
		CityId: {
			handler(val) {
				this.$store.commit('controlModel/SET_CITYID', val);
			}
		},
		screenType: {
			handler(val) {
				this.$store.commit('controlModel/SET_SCREENTYPE', val);
			}
		},
		networkType(val) {
			this.ProCellName();
		},
		selCity: {
			handler(val) {
				this.$store.commit('controlModel/SET_SELCITY', val);
				this.cellSearch();
				this.ProCellName();
			}
		},
		mapCenter: {
			handler(val) {
				this.$store.commit('controlModel/SET_MAPCENTER', val);
			}
		},
		activePoint(val) {
			this.mapCenter = [val.lat_bd, val.lng_bd];
		},
		changeVal(val) {
			if (val > 0) {
				if (this.timeVal == 1) {
					this.day = moment(this.day)
						.add(1, 'months')
						.format('YYYY-MM');
					this.Time = this.day + '-01' + ' ' + '00:00:00';
				} else if (this.timeVal == 2) {
					this.day = moment(this.day)
						.add(1, 'days')
						.format('YYYY-MM-DD');
					this.Time = this.day + ' ' + '00:00:00';
				} else if (this.timeVal == 3) {
					this.Time = this.day + ' ' + this.second;
					var newDate = moment(this.Time)
						.add(1, 'hour')
						.format('YYYY-MM-DD HH:mm:ss');
					this.day = newDate.slice(0, 10); //重新获取变更时间后的日期
					this.second = newDate.slice(11, 19);
					var hour = this.second.slice(0, 2);
					this.Time = this.day + ' ' + hour + ':00' + ':00';
				} else {
					this.Time = this.day + ' ' + this.second; //最开始赋值
					var newDate = moment(this.Time)
						.add(15, 'minute')
						.format('YYYY-MM-DD HH:mm:ss');
					this.day = newDate.slice(0, 10);
					this.second = newDate.slice(11, 19);
					this.Time = this.day + ' ' + this.second; //变化之后重新赋值
				}
			} else {
				if (this.timeVal == 1) {
					this.day = moment(this.day)
						.subtract(1, 'months')
						.format('YYYY-MM');
					this.Time = this.day + '-01' + ' ' + '00:00:00';
				} else if (this.timeVal == 2) {
					this.day = moment(this.day)
						.subtract(1, 'days')
						.format('YYYY-MM-DD');
					this.Time = this.day + ' ' + '00:00:00';
				} else if (this.timeVal == 3) {
					this.Time = this.day + ' ' + this.second;
					var newDate = moment(this.Time)
						.subtract(1, 'hour')
						.format('YYYY-MM-DD HH:mm:ss');
					this.day = newDate.slice(0, 10);
					this.second = newDate.slice(11, 19);
					var hour = this.second.slice(0, 2);
					this.Time = this.day + ' ' + hour + ':00' + ':00';
				} else {
					this.Time = this.day + ' ' + this.second; //最开始赋值
					var newDate = moment(this.Time)
						.subtract(15, 'minute')
						.format('YYYY-MM-DD HH:mm:ss');
					this.day = newDate.slice(0, 10);
					this.second = newDate.slice(11, 19);
					this.Time = this.day + ' ' + this.second; //变化之后重新赋值
				}
			}
		}
	},
	mounted() {
		this.nowTime();
		this.getProvince();
		this.ProCellName();
		this.cellSearch();
		if (this.timer) {
			//添加定时器，15分钟刷新一次
			clearInterval(this.timer);
		} else {
			this.timer = setInterval(() => {
				this.nowTime();
			}, 1000 * 60 * 15);
		}
	},
	destroyed() {
		clearInterval(this.timer);
	},
	methods: {
		nowTime() {
			this.HourList = [];
			this.MinuteList = [];
			for (let i = 0; i < 24; i++) {
				this.HourList.push({
					value: i,
					label: add_10(i) + ':00:00'
				});
			}
			for (let k = 0; k < 24; k++) {
				for (let j = 0; j < 4; j++) {
					this.MinuteList.push({
						value: k,
						label: add_10(k) + ':' + add_10(15 * j) + ':00'
					});
				}
			}
			function add_10(num) {
				if (num < 10) {
					num = '0' + num;
				}
				return num;
			}
			switch (this.timeVal) {
				case 3:
					var myDate = new Date();
					this.day = myDate.getFullYear() + '-' + add_10(myDate.getMonth() + 1) + '-' + add_10(myDate.getDate());
					this.second = add_10(myDate.getHours()) + ':00' + ':00';
					this.Time = this.day + ' ' + this.second;
					break;
				case 4:
					var myDate = new Date();
					this.day = myDate.getFullYear() + '-' + add_10(myDate.getMonth() + 1) + '-' + add_10(myDate.getDate());
					var min = add_10(myDate.getHours()) + ':' + myDate.getMinutes() + ':00'; //当前时间的分钟
					var nowData = this.day + ' ' + min; //当前的日期时间
					var BeforeTime = moment(nowData) //将当前时间往前推90分钟
						.subtract(90, 'minute')
						.format('YYYY-MM-DD HH:mm:ss');
					this.day = BeforeTime.slice(0, 10); //重新获取变更时间后的日期
					var minite = BeforeTime.slice(11, 19); //重新获取变更时间后的分钟
					var sliHour = minite.slice(0, 2); //重新获取变更时间后的小时
					var slice = minite.slice(3, 5); //重新获取变更时间后的分钟，并判断范围取值
					if (slice >= 0 && slice < 15) {
						var nowmin = '00';
					} else if (slice >= 15 && slice < 30) {
						var nowmin = '15';
					} else if (slice >= 30 && slice < 45) {
						var nowmin = '30';
					} else {
						var nowmin = '45';
					}
					this.second = sliHour + ':' + nowmin + ':00'; //拼接45分钟前的分钟
					this.Time = this.day + ' ' + this.second;
					break;
				default:
					break;
			}
		},
		changeTime() {
			switch (this.timeVal) {
				case 1: //月维度
					this.Time = this.day.slice(0, 7) + '-01' + ' ' + '00:00:00';
					break;
				case 2: //天维度
					this.Time = this.day + ' ' + '00:00:00';
					break;
				case 3: //小时维度
					this.Time = this.day + ' ' + this.second;
					break;
				case 4: //15分钟维度
					this.Time = this.day + ' ' + this.second;
					this.$store.commit('controlModel/SET_TIME', this.Time);
					break;
				default:
					break;
			}
		},
		//省
		getProvince() {
			let params = {
				id: 0
			};
			selProAndCityList(params).then(res => {
				if (res.code == 200) {
					this.ProvinceList = res.result;
					this.ProvinceId = res.result[0].id; //默认下拉北京
					this.getCity();
				}
			});
		},
		//市
		getCity() {
			let params = {
				id: this.ProvinceId
			};
			selProAndCityList(params).then(res => {
				if (res.code == 200) {
					this.CityList = res.result;
					this.CityId = res.result[0].id; //默认下拉城市改为日喀则
					this.selCity = res.result[0].name;
				}
			});
		},
		changeCity(val) {
			var obj = {};
			obj = this.CityList.find(function(item) {
				return item.id === val;
			});
			this.selCity = obj.name;
		},

		//给父组件返回组件名和分屏类型
		checkmap(currentName, ScreenType) {
			this.screenType = ScreenType;
			this.$emit('getMap', currentName);
		},
		//点击地图展示框选
		ShowDraw(toggle) {
			//单屏时点击编辑图标才会显示框选
			if (this.screenType == 1) {
				this.$emit('Show', toggle);
			}
		},
		//实时模糊查询
		querySearchAsync(queryString, cb) {
			var restaurants = this.restaurants;
			let results = queryString
				? restaurants.filter((currentValue, index, restaurants) => {
						return currentValue.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1; //满足条件的返回
				  }, this)
				: restaurants;
			cb(results);
		},
		handleSelect(item) {
			this.mapCenter = item.LngLat;
		},
		//小区搜索
		cellSearch() {
			let networkType = '';
			if (this.networkType == '11') {
				networkType = 1;
			} else if (this.networkType == '12') {
				networkType = 2;
			} else {
				networkType = 3;
			}
			let params = {
				type: networkType,
				cityId: this.cityId,
				cellName: this.village
			};
			selCellListByName(params).then(res => {
				if (res.code == 200) {
					this.restaurants = [];
					var cellList = res.result;
					cellList.forEach(item => {
						this.restaurants.push({
							value: item.communityName,
							address: item.communityName,
							LngLat: [item.lat_bd, item.lng_bd]
						});
					});
				}
			});
		},
		//问题小区滚动
		ProCellName() {
			this.cellList = [];
			let networkType = '';
			if (this.networkType == '11') {
				networkType = 1;
			} else if (this.networkType == '12') {
				networkType = 2;
			} else {
				networkType = 3;
			}
			let params = {
				type: networkType,
				cityId: this.cityId,
				timeTypeId: this.timeTypeId,
				time: this.Time
			};
			getProCellName(params).then(res => {
				if (res.code == 200) {
					this.cellList = res.result.split(',');
				}
			});
		},
		//点击设置
		Setting() {
			this.$emit('goSetting');
		},
		ShowList() {
			this.showDynamicDialog('cellModel', '问题小区列表', '70vw');
		},
		closeDynamicDialog(boolean) {
			this.dialogOption = {
				show: false,
				view: null,
				title: '问题小区列表',
				width: '0px'
			};
		},
		showDynamicDialog(view, title, width = '560px') {
			this.dialogOption.show = true;
			this.dialogOption.view = view;
			this.dialogOption.title = title;
			this.dialogOption.width = width;
		}
	}
};
</script>
<style lang="scss" scoped>
.warp {
	width: 100%;
	height: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
	float: left;
}

/deep/.el-input {
	width: 100%;
}

/deep/.el-select {
	width: 100%;
}

/deep/.el-input__inner {
	background: #0b1c74;
	border-color: #0733b5;
	color: #addcff;
}

.div_one > div {
	display: inline-block;
	float: left;
}

/deep/input::-webkit-input-placeholder {
	color: #addcff;
}

.village /deep/.el-input__inner {
	color: #4cb1ff;
}

.el-autocomplete {
	width: 100%;
}

.village /deep/input::-webkit-input-placeholder {
	color: #4cb1ff;
}

.marquee {
	width: 50%;
	height: 28px;
	line-height: 28px;
	display: inline-block;
	float: left;
	border: 1px solid #0733b5;
	background: #0b1c74;
}

.marquee span {
	display: inline-block;
	margin-left: 20px;
	color: #4cb1ff;
	cursor: pointer;
}

/deep/.el-button--mini {
	padding: 0;
	width: 32px;
	height: 26px;
}

/deep/.el-input-group__append {
	background-color: #0b1c74;
	color: #4cb1ff;
	border: 1px solid #0733b5;
}

/deep/.el-select__caret,
/deep/.el-input__prefix {
	color: #addcff !important;
}

.el-button + .el-button {
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 20px;
}
img {
	height: 16px;
}

/deep/.el-dialog {
	min-height: 70vh;
}
/deep/#reser > div:nth-child(1) > .el-input__suffix {
	display: none;
}
</style>
