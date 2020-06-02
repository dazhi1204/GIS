<template>
	<div class="content-box">
		<div>
			<h3>图层设置</h3>
			<div class="config-item">
				<p>网元类型选取</p>
				<div class="divider"></div>
				<p>网络制式:
					<el-select class="right-item" v-model="network" @change="onSelectedNetwork" placeholder="请选择">
						<el-option v-for="item in networkOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</p>
				<p>频段频点:
					<el-select class="right-item" v-model="frequent" @change="onSelectedDraw" placeholder="请选择">
						<el-option v-for="item in frequentOptions" :key="item.id" :label="item.name" v-model="item.id" :value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<div class="config-item center">
				<p>接口选取</p>
				<div class="divider"></div>
				<p>图层接口:
					<el-select class="right-item" v-model="LayerInter" placeholder="请选择">
						<el-option v-for="item in LayerInterface" :key="item.layerApiId" :label="item.layerApiName" :value="item.layerApiId">
						</el-option>
					</el-select>
				</p>
			</div>
			<div class="config-item buttom">
				<p>图层属性
					<el-button size="mini" type="warning" round class="right-item" @click="Restore">恢复默认</el-button>
				</p>
				<div class="divider"></div>
				<p>显示小区名称:
					<el-switch v-model="villageName" style="float: right;" active-color="#13ce66" inactive-color="#ff4949">
					</el-switch>
				</p>
				<p>扇区半径:
					<el-input placeholder="请输入内容" class="radius" v-model="radius">
					</el-input>
				</p>
				<p style="display: flex;">半功率角:
					<el-slider v-model="power" class="power" show-stops :step="30" :min="30" :max="120">
					</el-slider>
				</p>
				<p>默认颜色:
					<el-input v-model="choColor" class="colorval"></el-input>
					<el-color-picker class="chooseCo" v-model="choColor"></el-color-picker>
				</p>
				<p style="display: flex;">透明度:
					<el-slider v-model="opcity" class="opcity" :step="1" :min="0" :max="100">
					</el-slider>
				</p>
				<el-button type="primary" @click="SaveDate">保存</el-button>
			</div>
			</p>

		</div>

	</div>
	</div>
</template>
<script>
	import { selLayerData } from '@/api/coverage.js'
	import { selLayerApiList } from '@/api/coverage.js'
	import { selLayeDefult } from '@/api/coverage.js'
	import { editLayerData } from '@/api/coverage.js'
	export default {
		props: ['FromParent'],
		data() {
			return {
				layerTypeId: '',
				layerId: '',
				network: '',
				networkVal: '',
				frequent: '',
				frequentVal: '',
				LayerInter: 1,
				networkOptions: [],
				frequentOptions: [],
				LayerInterface: [],
				villageName: true,
				radius: '',
				power: 0,
				opcity: 100,
				choColor: '',
				status: false
			};
		},
		watch: {
			status: {
				handler(val) {
					this.$store.commit('settingModel/SET_STATUS', val)
				}
			},
			opcity: {
				handler(val) {
					this.$store.commit('settingModel/SET_OPCITY', val)
				}
			}
		},
		methods: {
			Restore() {
				selLayeDefult({
					'layerTypeId': this.layerTypeId
				}).then(res => {
					if(res.code == 200) {
						var result = res.result;
						this.network = result.networkId;
						this.frequent = result.bandsId;
						if(result.showName == 0) {
							this.villageName = false
						} else {
							this.villageName = true
						}
						this.radius = result.radius;
						this.power = result.hPBW;
						this.opcity = result.fillopacity;
						this.choColor = result.colour;
					}
				})
			},

			// 获取父组件点击图层this.villageName传值
			getChildDate(tag) {
				let params = {
					"layerId": tag.layerId,
					"layerTypeId": tag.layerTypeId
				}
				this.networkOptions = this.FromParent.network;
				this.frequentOptions = this.FromParent.draw;
				this.layerTypeId = tag.layerTypeId;
				this.layerId = tag.layerId;
				//api接口数据
				selLayerApiList({
					'layerTypeId': tag.layerTypeId
				}).then(res => {
					if(res.code == 200) {
						this.LayerInterface = res.result;
					}
				})
				//图层数据
				selLayerData(params).then(res => {
					if(res.code == 200) {
						var result = res.result;
						this.network = result.networkId;
						this.networkVal = result.network;
						this.frequentVal = result.bands;
						this.frequent = result.bandsId;
						if(result.showName == 0) {
							this.villageName = false
						} else {
							this.villageName = true
						}
						this.LayerInter = result.layerApiId;
						this.radius = result.radius;
						this.power = result.hPBW;
						this.opcity = result.fillopacity;
						this.choColor = result.colour;
					}
				})
			},
			//保存修改数据
			SaveDate() {
				if(this.villageNamew == false) {
					var showName = 0
				} else {
					var showName = 1
				}
				let params = {
					"layerId": this.layerId,
					'network': this.networkVal,
					'networkId': this.network,
					'bandsId': this.frequent,
					'bands': this.frequentVal,
					'layerApiId': this.LayerInter,
					'showName': showName,
					'radius': this.radius,
					'HPBW': this.power,
					'colour': this.choColor,
					'fillopacity': this.opcity
				}

				editLayerData(params).then(res => {
					this.$message({
						type: 'success',
						message: '保存成功'
					});
				})
				this.status = true

			},
			onSelectedDraw(e) {
				let obj = {};
				obj = this.frequentOptions.find((item) => {
					return item.id === e; //筛选出匹配数据
				});
				this.frequentVal = obj.name;
				this.frequent = e;
			},
			onSelectedNetwork(e) {
				let obj = {};
				obj = this.networkOptions.find((item) => {
					return item.id === e; //筛选出匹配数据
				});
				this.networkVal = obj.name;
				this.network = e;
			}

		}
	};
</script>
<style lang="scss" scoped>
	.config-item {
		height: 10%;
		flex-grow: 1;
		margin-top: 10px;
		max-width: 220px;
		p {
			height: 28px;
			line-height: 28px;
			margin-bottom: 8px;
		}
		.right-item {
			max-width: 70%;
			float: right;
		}
	}
	
	.right {
		margin-left: 20px;
		text-align: left;
		&>h3 {
			margin-left: 80px;
		}
	}
	
	.center {
		margin-top: 55px;
	}
	
	.buttom {
		margin-top: 35px;
	}
	
	.radius {
		width: 120px;
		float: right;
	}
	
	.power {
		margin-top: -5px;
		width: 140px;
		margin-left: 29px;
	}
	
	.colorval {
		width: 120px;
		margin-left: 15px;
	}
	
	.chooseCo {
		float: right;
	}
	
	.opcity {
		margin-top: -5px;
		width: 140px;
		margin-left: 41px;
	}
</style>