<template>
	<div id="titlemes" :style="dialogStyle">
		<div class="guanBiBox" @click="close">
			<i class="el-icon-circle-close"></i></div>
		<div class="titlemesImg">
			<i class="el-icon-caret-bottom"></i>
		</div>
		<div class="content" :class="rowDataList.length >=3 ? 'heightDiv' : '' ">
			<div v-for="(rowData,index) in rowDataList" id="titleTop" :key="index" class="Listtitle">
				<div class="title">
					<i class="iconfont  iconshuangjiantouyou"></i>
					<span>{{ rowData.communityName }}</span>
				</div>
				<div class="bottom">
					<span class="reason" :class="rowData.reason?'active':''">&nbsp;{{ rowData.reason !== null ? rowData.reason:'无问题' }}</span>
					<span class="detail">&nbsp;<a href="javascript:void(0);"
               @click="openDeatil(rowData,index,$event)">详情</a></span>
				</div>
				<div v-show="index != rowDataList.length-1" class="line" />
			</div>
		</div>
		<div class="details" v-if="Detail">
			<div class="guanBiBox" @click="Declose">
				<i class="el-icon-circle-close"></i></div>
			<el-tabs type="border-card">
				<el-tab-pane label="工参信息">
					<div class="card_one">
						<p><span>ECI</span>:<span>{{area.eci}}</span></p>
						<p><span>小区名称</span>:<span>{{ area.communityName }}</span></p>
						<p><span>网络制式</span>:<span>{{ area.nettype }}</span></p>
						<p><span>频点</span>:<span>{{ area.earfcn }}</span></p>
					</div>
				</el-tab-pane>
				<el-tab-pane label="小区指标">
					<div class="card_two">
						<p v-for="(itemChild,inx) in indexResult"><span>{{inx}}:</span><span>{{itemChild}}</span></p>
					</div>
				</el-tab-pane>
			</el-tabs>

		</div>

	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		name: 'titlemes',
		props: ['rowDataList', 'dialogStyle', 'village'],
		data() {
			return {
				Detail: false,
				indexResult: [],
				inx:'',
				area:''
			}
		},
		computed: {
			...mapGetters([
				'networkType',
				'timeTypeId',
				'time',
				'spaceType',
				'checkedDatas',
				'checkedData',
				'cityId',
				'dimen',
				'status',
				'opcity',
				'normName',
				'mapCenter',
				'senceList',
				'setmodel',
				'spaceCheck',
				'pname',
				'selCity',
				'mesFalse'
			])
		},
		watch:{
			mesFalse(val){
				if(val == false){
					this.Detail = false;
				}
			}
		},
		
		methods: {
			close() {
				this.$emit('close', false);
				this.Detail = false;
			},
			Declose() {
				this.Detail = false;
			},
			openDeatil(rowData, index, event) {
				this.area = rowData;
				this.indexResult = [];
				this.$emit('openDeatil', rowData)
				this.Detail = true;
				this.inx = index;
				if (this.networkType == '11') {
					var networkType = '2G';
				} else if (this.networkType == '12') {
					var networkType = '4G';
				} else {
					var networkType = '5G';
				}
				if (this.village == 4) {
					var params = {
						eci: rowData.eci,
						timeTypeId: this.timeTypeId,
						timeValue: this.time,
						networkType: networkType,
						cgi: rowData.cgi,
						flylineType: rowData.flylineType
					};
					var url = 'api/gis-web/flyline/selFlylineIndex';
				} else if (this.village == 2) {
					var params = {
						gridId: rowData.eci,
						timeTypeId: this.timeTypeId,
						timeValue: this.time,
						networkType: networkType
					};
					var url = 'api/gis-web/rasterLayer/rasterLayerIndexQuery';
				} else {
					var params = {
						eci: rowData.eci,
						timeTypeId: this.timeTypeId,
						timeValue: this.time,
						networkType: networkType
					};
					var url = 'api/gis-web/sector/selectIndex';
				}
				
				this.$http
					.post(url, params)
					.then(res => {
						if (res.status == 200) {
							this.indexResult=res.data.result.indexResult;
						}
					})
					.catch(err => {
						this.$message({
							type: 'warning',
							message: err.data.massege
						});
					});
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	#titlemes {
		position: absolute;
		z-index: 999;
		.heightDiv {
			height: 233px;
		}
		.content {
			padding: 0;
			margin: 0;
			border: 2px solid #4285e4;
			background-color: rgba(4, 16, 77, 0.6);
			width: 140px;
			overflow-y: auto;
			overflow-x: hidden;
			.Listtitle {
				margin: 0px 10px;
				color: #fff;
				font-size: 12px;
				height: 77px;
				/*border-bottom: 2px solid #01C9FF;*/
				/*&:last-child {*/
				/*    border-bottom: none;*/
				/*}*/
				.title {
					text-align: left;
					padding-top: 8px;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.bottom {
					overflow: hidden;
					margin-bottom: 5px;
					.active {
						color: red;
					}
					.reason {
						float: left;
					}
					.detail {
						float: right;
						color: #3388ff;
					}
				}
				.line {
					height: 2px;
					width: 100%;
					background: -webkit-linear-gradient( left, rgba(255, 255, 255, 0), #7139b9, rgba(255, 255, 255, 0));
					background: linear-gradient( to right, rgba(255, 255, 255, 0), #7139b9, rgba(255, 255, 255, 0));
				}
			}
		}
		.guanBiBox {
			position: absolute;
			top: -15px;
			right: -10px;
		}
		.details {
			position: absolute;
			left: 145px;
			font-size: 12px;
			top: 0px;
			width: 300px;
			border: 2px solid #4285e4;
			background-color: rgba(4, 16, 77, 0.6);
		}
		.el-tabs--border-card,
		.el-tabs--border-card>.el-tabs__header,
		.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
			border: none;
			background-color: rgba(4, 16, 77, 0.6)
		}
		.el-tabs--border-card>.el-tabs__header .el-tabs__item {
			width: 148px !important;
		}
		/deep/.el-tabs--border-card>.el-tabs__content{
			padding: 15px;
		}
		.card_one p,
		.card_two p {
			padding: 2px 0;
		}
		
		.card_one p span:nth-child(1) {
			display: inline-block;
			width: 60px;
			float: left;
		}
		.card_one p span:nth-child(2) {
			margin-left: 20px;
			display: inline-block;
			width: 180px;
		}
		.card_two {
			height: 104px;
			overflow-y: auto;
		}
		.card_two p span:nth-child(1) {
			display: inline-block;
		}
		.card_two p span:nth-child(2) {
			display: inline-block;
			float:right;
		}
		/deep/.el-tabs__nav-scroll {
			background: #04164c;
			border-bottom: 1px solid #0940e5;
		}
		/deep/.is-active{
			background-color: #1a20f038;
			border-right-color: #1a20f038;
   			border-left-color: #1a20f038;
   			color: #409EFF !important;
		}
		/deep/.el-tabs__item {
			color: #FFFFFF;
			font-size: 12px;
			height: 30px;
			line-height: 30px;
		}
		// 改变箭头颜色
		.el-popper[x-placement^="top"] .popper__arrow {
			bottom: -6px;
			left: 50%;
			margin-right: 3px;
			border-bottom-width: 0;
			border-top-color: rgba(255, 255, 255, 0.4);
		}
		.el-popper[x-placement^="top"] .popper__arrow::after {
			bottom: 1px;
			margin-left: -6px;
			border-bottom-width: 0;
			border-top-color: rgba(255, 255, 255, 0.4);
		}
		.titlemesImg {
			display: none;
			position: absolute;
			bottom: 3px;
			left: 50%;
			transform: translate(-50%, 75%);
		}
		 ::-webkit-scrollbar-track-piece {
			//滚动条凹槽的颜色，还可以设置边框属性
			// background-color:#f8f8f8;
			background-color: rgba(4, 16, 77, 0.6);
		}
		 ::-webkit-scrollbar {
			//滚动条的宽度
			width: 5px;
			height: 5px;
		}
		 ::-webkit-scrollbar-thumb {
			//滚动条的设置
			background-color: #abd9ef;
			border-radius: 2px;
			background-clip: padding-box;
			min-height: 28px;
		}
		 ::-webkit-scrollbar-thumb:hover {
			background-color: #bbb;
		}
		scrollbar-arrow-color: rgba(4, 16, 77, 0.6);
		/**/
		/*三角箭头的颜色*/
		scrollbar-face-color: #abd9ef;
		/**/
		/*立体滚动条的颜色*/
		scrollbar-3dlight-color: #abd9ef;
		/**/
		/*立体滚动条亮边的颜色*/
		scrollbar-highlight-color: rgba(4, 16, 77, 0.6);
		/**/
		/*滚动条空白部分的颜色*/
		scrollbar-shadow-color: #abd9ef;
		/**/
		/*立体滚动条阴影的颜色*/
		scrollbar-darkshadow-color: #abd9ef;
		/**/
		/*立体滚动条强阴影的颜色*/
		scrollbar-track-color: rgba(4, 16, 77, 0.6);
		/**/
		/*立体滚动条背景颜色*/
		scrollbar-base-color: #abd9ef;
		/**/
		/*滚动条的基本颜色*/
	}
</style>