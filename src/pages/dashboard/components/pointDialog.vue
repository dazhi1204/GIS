<template>
	<div id="titlemes" :style="dialogStyle">
		<div class="content heightDiv">
      <div class="guanBiBox" @click="close">
        <i class="el-icon-circle-close"></i>
      </div>
      <p class="header">
        {{echartData[4]}}:
        {{detialData.result[0].communityName}}
        <span style="visibility: hidden;">更多<i class="el-icon-d-arrow-right"></i></span>
        <span @click="Declose(true)" class="more">更多<i class="el-icon-d-arrow-right"></i></span></p>
      <div v-if="name.length == 1">
        <p>{{name[0].pname}} : {{echartData[1]}}</p>
      </div>
      <div v-else-if="name.length == 2">
        <p>{{name[0].pname}} : {{echartData[1]}}</p>
        <p>{{name[1].pname}} : {{echartData[0]}}</p>
      </div>
      <div v-else-if="name.length == 3">
        <p>{{name[0].pname}} : {{echartData[1]}}</p>
        <p>{{name[1].pname}} : {{echartData[0]}}</p>
        <p>{{name[2].pname}} : {{echartData[3]}}</p>
      </div>
      <div v-else>
        <p>{{name[0].pname}} : {{echartData[1]}}</p>
        <p>{{name[1].pname}} : {{echartData[0]}}</p>
        <p>{{name[2].pname}} : {{echartData[3]}}</p>
        <p>{{name[3].pname}} : {{echartData[2]}}</p>
      </div>
		</div>
		<div class="details" v-show="Detail" :class="{'right': right}">
      <div class="guanBiBox" @click="Declose(false)">
				<i class="el-icon-circle-close"></i></div>
        <p :class="[{'active': active == item}, 'item']" v-for="(item,index) in detialData.result" :key="index" @click="getItem(item)">
          {{item.communityName}}
        </p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'pointDialog',
		props: ['echartData', 'dialogStyle', 'detialData', 'name', 'right'],
		data() {
			return {
        Detail: false,
        active: null
			}
		},
		methods: {
			close() {
				this.$emit('close', false);
				this.Detail = false;
			},
			Declose(boolean) {
				this.Detail = boolean;
      },
      getItem(item) {
        this.active = item
        this.$store.commit('controlLeft/SET_ACTIVEPOINT', item)
      }
    },
    mounted() {
      document.addEventListener('click', (e) => {
        if(!this.$el.contains(e.target)) {
          this.$emit('close', false);
        }
      })
    }
	}
</script>

<style lang="scss" scoped>
	#titlemes {
		position: absolute;
		z-index: 999;
		.heightDiv {
			height: 150px;
      .header {
        border-bottom: 1px solid #4285e4;
        text-overflow: ellipsis;
        .more {
          float:right;
          cursor: pointer;
        }
      }
		}
		.content {
			padding: 0;
			margin: 0;
			border: 2px solid #4285e4;
			background-color: rgba(4, 16, 77, 0.6);
			width: 200px;
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
      text-align: right;
		}
		.details {
			position: absolute;
			left: 200px;
			font-size: 12px;
			top: 0px;
			width: 200px;
      height: 150px;
			border: 2px solid #4285e4;
			background-color: rgba(4, 16, 77, 0.6);
      overflow-y: auto;
			overflow-x: hidden;
      .active {
        background:royalblue;
      }
      .item {
        cursor: pointer;
      }
      .item:hover {
        background:royalblue;
      }
		}
    .right {
      left: unset;
      right: 200px;
    }
    p {
      padding: 0 5px;
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