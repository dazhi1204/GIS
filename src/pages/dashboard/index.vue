<!--
@author wupeng
@date   19.11.15
@description GIS大屏首页
-->
<template>
	<div class="content">
		<!-- 弹窗内容 -->
		<asp-dialog v-bind="dialogOption" :view.sync="dialogOption.view" :visible.sync="dialogOption.show">
			<component :is="dialogOption.view" @close="closeDynamicDialog"></component>
		</asp-dialog>

		<div class="back right">
			<!--
			<i class="setting iconfont  iconyonghuming"></i>
			<span class="back-text" @click="test">admin</span>
			<i class="back-icon iconfont iconzhongqi" @click="rightBack()">退出</i>
      -->
		</div>
		<div class="header"></div>
		<div class="body">
			<div :class="[{ 'toggle-hide': left }, 'content-box']">
				<control-left></control-left>
				<div class="content-item"><left-top :footer="footer"></left-top></div>
				<div class="content-item"><left-middle :footer="footer"></left-middle></div>
			</div>
			<div class="content-box middle">
				<div class="side-bar side-left" @click="left = !left"></div>
				<div class="side-bar side-right" @click="right = !right"></div>
				<div class="side-bar side-footer" @click="footer = !footer"></div>
				<div class="control"><control-mod @getMap="getMap" @Show="Show" @goSetting="goSetting"></control-mod></div>
				<div class="content-item map">
					<i :class="[{ icontuichuquanping: fullFlag }, { iconquanping2: !fullFlag }, 'iconfont']" @click="toggleHide()"></i>
					<div class="BlueHorn">
						<div class="lt"></div>
						<div class="rt"></div>
						<div class="rb"></div>
						<div class="lb"></div>
						<component v-bind:is="this.checkmap" ref="Draw"></component>
					</div>
				</div>
			</div>
			<div :class="[{ 'toggle-hide': right }, 'content-box']">
				<div class="control">
					<el-radio-group class="yw-radio" v-model="typeRadio">
						<el-radio-button v-for="item in rightButton" :label="item.id" :key="item.id">{{ item.name }} {{ item.cellNo }}</el-radio-button>
					</el-radio-group>
				</div>
				<div class="content-item"><right-top :id="typeRadio"></right-top></div>
				<div class="content-item"><right-middle :footer="footer"></right-middle></div>
			</div>
		</div>
		<div :class="[{ 'footer-hide': footer }, 'footer']">
			<div class="content-box">
				<div class="content-item"><left-bottom></left-bottom></div>
			</div>
			<div class="content-box middle">
				<!-- <middle-middle></middle-middle> -->
				<div class="content-item"><middle-bottom ref="middleBottom"></middle-bottom></div>
			</div>
			<div class="content-box">
				<div class="content-item"><right-bottom></right-bottom></div>
			</div>
		</div>
	</div>
</template>

<script>
import chartApi from '@/api/chart';
import { mapGetters } from 'vuex';
export default {
	name: 'HelloWorld',
	components: {
		// 页面组件
		leftTop: () => import('./leftTop'),
		leftMiddle: () => import('./leftMiddle'),
		leftBottom: () => import('./leftBottom'),
		center: () => import('./center'),
		centertwo: () => import('./center_two'),
		centerfour: () => import('./center_four'),
		middleMiddle: () => import('./middleMiddle'),
		middleBottom: () => import('./middleBottom'),
		rightTop: () => import('./rightTop'),
		rightMiddle: () => import('./rightMiddle'),
		rightBottom: () => import('./rightBottom'),
		// 相关控件
		aspDialog: () => import('@/components/asp-dialog'),
		setting: () => import('../setting/index'),
		controlMod: () => import('./components/controlModel'),
		controlLeft: () => import('./components/controlLeft')
	},
	data() {
		return {
			// 是否隐藏
			left: false,
			right: false,
			footer: false,
			fullFlag: false,
			dialogOption: {
				show: false,
				view: null,
				title: '设置',
				width: '600px'
			},
			typeRadio: 1,
			checkmap: 'center',
			rightButton: [],
			index: 1
		};
	},
	computed: {
		...mapGetters(['cityId', 'checkedData', 'normName', 'networkType', 'status', 'timeTypeId', 'time', 'checkedDatas', 'setmodel'])
	},
	watch: {
		time(val) {
			this.initData();
		},
		networkType(val) {
			this.initData();
		},
		status(val) {
			if (val == true) {
				setTimeout(() => {
					this.closeDynamicDialog();
				}, 1000);
			}
		},
		setmodel(val) {
			if (val == true) {
				setTimeout(() => {
					this.closeDynamicDialog();
				}, 1000);
			}
		}
	},
	methods: {
		test() {
			console.log(this.time);
		},
		initData() {
			// let timeString = ''
			// if (this.timeTypeId == 4 || this.timeTypeId == 3) {
			//   timeString = this.time + " 23:45:00"
			// } else if (this.timeTypeId == 2) {
			//   let date = new Date(this.time); //value的格式为YYYY-MM-DD
			//   let month = (date.getMonth() + 1).toString().padStart(2, '0'); //获取月份，如果月份小于10加个‘0’
			//   let year = date.getFullYear();
			//   let day = new Date(year, month, 0);
			//   timeString = this.time + "-" + day.getDate()
			// } else {
			//   timeString = this.time + "-12"
			// }
			let params = {
				timeType: this.timeTypeId,
				cityId: this.cityId,
				time: this.time,
				earfcnTypeId: this.networkType
			};
			chartApi.getIndexListFirst(params).then(res => {
				this.rightButton = res.result;
			});
		},
		// 显示隐藏控制
		toggleHide() {
			if (!this.fullFlag) {
				(this.left = true), (this.right = true), (this.footer = true);
			} else {
				(this.left = false), (this.right = false), (this.footer = false);
			}
			this.fullFlag = !this.fullFlag;
		},
		getMap(currentName) {
			// 清空二分屏数组
			this.$store.commit('controlModel/SET_SEQUOTA', []);
			// 清空四分屏数组
			this.$store.commit('controlModel/SET_QUOTALIST', []);
			this.checkmap = currentName;
		},
		Show(toggle) {
			this.$refs.Draw.initdrawingManager(toggle);
		},
		closeDynamicDialog(boolean) {
			this.dialogOption = {
				show: false,
				view: null,
				title: '',
				width: '0px'
			};
		},
		showDynamicDialog(view, title, width = '560px') {
			this.dialogOption.show = true;
			this.dialogOption.view = view;
			this.dialogOption.title = title;
			this.dialogOption.width = width;
		},
		// 退出
		rightBack() {
			this.$router.push({
				path: '/login'
			});
		},
		goSetting() {
			//this.setmodel = true
			this.showDynamicDialog('setting', '设置', '850px');
		}
	},
	mounted() {
		let param = {
			name: '000000',
			pwd: 'D7BCF8B9E22E682D1252641D95DEBB60F9AD779D617E852E1A98E41CE8F3F49EB9335CBE4C55FC30219F4314FACA395E96495DBA6B31E32DD9FA9C519BD52966'
		};
		chartApi.login(param);
		this.initData();
		//获取从网优得到的用户信息
		// window.addEventListener('message',function(e){
		//     console.log(e.origin)
		//     console.log('-----')
		//     // 得到用户名
		//     console.log(e.data.userName)
		//     // 如果拿不到用户名，则跳转到网优登录页面
		//     // if(!e.data.userName) {
		//     //   // window.location.href = ''
		//     //   // window.open(process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : 'http://10.12.70.72:59033/')
		//     //   // window.location.replace('http://localhost:8080/')
		//     // }
		// })
		//  console.log(window.self === window.top, '----')
		// 判断是不是从iframe 打开的，如果不是则跳转网优地址
		// if(window.self === window.top) {
		//   process.env.NODE_ENV === 'development' ? '' : window.location.href = 'http://10.12.70.72:59033/'
		// }
	},
	destroyed() {
		window.removeEventListener('message', function(e) {});
	}
};
</script>

<style lang="scss" scoped>
/deep/.yw-radio {
	&.el-radio-group {
		display: flex;
		flex-wrap: wrap;
		.el-radio-button {
			min-width: 33%;
			flex: 1;
		}
		.el-radio-button__inner {
			width: 100%;
			background: transparent;
			border: 1px solid #409eff;
			color: #b1ddff;
			.el-dropdown {
				width: 100%;
				color: #b1ddff;
			}
		}
		.is-active {
			.el-radio-button__inner {
				background: rgb(0, 33, 142);
			}
		}
	}
}

.content {
	position: relative;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	// background-size: 100% 100%;
	.header {
		margin-bottom: 0.2rem;
		height: 0.8rem;
		background-image: url('../../assets/img/header.png');
		background-size: 100% 100%;
		padding: 0 16%;
		// .title {
		//   color: #fff;
		//   font-size: 40px;
		//   margin-top: -15px;
		//   height: 56px;
		// }
		.active {
			background: url(../../assets/img/nav.png);
			background-size: 100% 100%;
		}
	}
	.body {
		height: 10%;
		padding: 0 20px;
		flex-grow: 8;
		display: flex;
		.content-box {
			width: 24%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			// transition: width 2s, flex-grow 2s, opacity 2s;
			height: 100%;
			.content-item {
				width: 100%;
				height: 10%;
				position: relative;
				flex-grow: 1;
				margin-bottom: 15px;
				background: rgba(6, 30, 47, 0.5);
				// background: url(../../assets/img/left-box-bg.png) 100% 100% no-repeat;
			}
			.map {
				position: relative;
				& > i {
					position: absolute;
					font-size: 0.3rem;
					top: 0.1rem;
					right: 0.1rem;
					z-index: 10;
					cursor: pointer;
				}
			}
			.control {
				height: 56px;
				width: 100%;
			}
		}
		.middle {
			position: relative;
			width: 10%;
			margin: 0 15px;
			flex-grow: 1;
			z-index: 998;
			.side-bar {
				position: absolute;
				top: 56px;
				right: -11px;
				width: 15px;
				height: 110px;
				background: url(../../assets/img/btn-right.png) 100% 100% no-repeat;
				cursor: pointer;
			}
			.side-left {
				left: -15px;
				background: url(../../assets/img/btn-left.png) 100% 100% no-repeat;
			}
			.side-bar:hover {
				background: url(../../assets/img/btn-right-a.png) 100% 100% no-repeat;
			}
			.side-left:hover {
				background: url(../../assets/img/btn-left-a.png) 100% 100% no-repeat;
			}
			.side-footer {
				top: unset;
				right: 0;
				bottom: 4px;
				width: 110px;
				height: 15px;
				background: url(../../assets/img/btn-bot.png) 100% 100% no-repeat;
			}
			.side-footer:hover {
				background: url(../../assets/img/btn-bot-a.png) 100% 100% no-repeat;
			}
		}
		.toggle-hide {
			width: 0;
			flex-grow: unset;
			opacity: 0;
		}
	}
	.footer {
		height: 10%;
		padding: 0 20px;
		flex-grow: 3;
		display: flex;
		// transition: height 2s, flex-grow 2s, opacity 2s;
		.content-box {
			width: 24%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			.content-item {
				width: 100%;
				height: 10%;
				position: relative;
				flex-grow: 1;
				margin-bottom: 0.1rem;
				background: rgba(6, 30, 47, 0.5);
			}
		}
		.middle {
			width: 10%;
			margin: 0 15px;
			flex-grow: 1;
			.checkbox {
				padding-top: 2px;
				.item {
					margin-top: 0px;
					height: 100%;
				}
			}
		}
	}
	.footer-hide {
		height: 0;
		flex-grow: unset;
		opacity: 0;
	}
	.back {
		position: absolute;
		top: 0.05rem;
		left: 20px;
		color: #fff;
		font-size: 20px;
		cursor: pointer;
		.setting {
			font-size: 24px;
			float: left;
			display: block;
			margin: 3px 4px;
		}
		.back-icon {
			display: inline-block;
			vertical-align: middle;
			margin-left: 0.2rem;
			font-size: 0.24rem;
			// background: url(../../assets/img/back.png) no-repeat;
			// margin-right: 8px;
		}
		.back-text {
			display: inline-block;
			vertical-align: middle;
		}
		&.right {
			left: auto;
			right: 20px;
			// .back-icon {
			//   margin-left: 8px;
			//   margin-right: 0;
			//   // transform: rotate(180deg);
			// }
		}
	}
}
</style>
