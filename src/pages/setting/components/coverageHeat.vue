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
						<el-option v-for="item in frequentOptions" :key="item.id" :label="item.name" :value="item.id">
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
				<p>热力图半径:
					<el-input placeholder="请输入内容" class="radius" v-model="heat">
					</el-input>
				</p>
				
				<p style="display: flex;">透明度:
					<el-slider v-model="opcity" class="opcity"  :step="1" :min="0" :max="100">
					</el-slider>
				</p>
				<el-button type="primary" @click="SaveDate">保存</el-button>
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
		props:['FromParent'],
		data() {
			return {
				layerTypeId:'',
				layerId:'',
				network: '',
				networkVal: '',
				frequent: '',
				frequentVal: '',
				LayerInter: 1,
				networkOptions: [],
				frequentOptions: [],
				LayerInterface: [],
				heat: '',
				opcity:0
				
			};
		},
		methods: {
			Restore(){
				selLayeDefult({'layerTypeId':this.layerTypeId}).then(res => {
					if(res.code == 200){
						var result = res.result;
						this.network = result.networkId;
						this.frequent = result.bandsId;
						this.heat = result.heatRadius;
						this.opcity = result.fillopacity;
					}
				})
			},
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
				selLayerApiList({'layerTypeId':tag.layerTypeId}).then(res => {
					if(res.code == 200){
						this.LayerInterface = res.result;
					}
				})
				//图层数据
				selLayerData(params).then(res => {
					if(res.code == 200){
						var result = res.result;
						this.network =result.networkId;
						this.frequent = result.bandsId;
						this.networkVal = result.network;
						this.frequentVal = result.bands;
						this.LayerInter = result.layerApiId;
						this.heat = result.heatRadius;
						this.opcity = result.fillopacity;
					}
				})
			},
			//保存修改数据
			SaveDate() {
				
				let params = {
					"layerId": this.layerId,
					'network': this.networkVal,
					'networkId': this.network,
					'bandsId': this.frequent,
					'bands': this.frequentVal,
					'layerApiId': this.LayerInter,
					'heatRadius': this.heat,
					'fillopacity': this.opcity
				}
				editLayerData(params).then(res => {
					this.$message({
						type: 'success',
						message: '保存成功'
					});
				})
			},

			onSelectedDraw(e) {
				let obj = {};
				obj = this.frequentOptions.find((item) => { //这里的userList就是上面遍历的数据源
					return item.id === e; //筛选出匹配数据
				});
				this.frequentVal = obj.name;
				this.frequent = e;
			},
			onSelectedNetwork(e) {
				let obj = {};
				obj = this.networkOptions.find((item) => { //这里的userList就是上面遍历的数据源
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
		margin-top: 64px;
	}
	
	.buttom {
		margin-top: 44px;
	}
	
	.radius {
		width: 150px;
		float: right;
	}
	.power{
		margin-top: -5px;
    width: 140px;
    margin-left: 29px;
	}
	.colorval{
		width: 120px;
		margin-left: 15px;
	}
	.chooseCo{
		float: right;
	}
	.opcity{
		margin-top: -5px;
    width: 140px;
    margin-left: 41px;
	}
</style>