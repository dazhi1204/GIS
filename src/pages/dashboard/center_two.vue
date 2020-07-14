<template>
	<div id="map-box">
		<div class="maps">
			<div id="map" @click="changeStyle('0', 'map1')" :class="{ changeStyle: changeSelectStyle == 0 }"></div>
			<!--图1图例-->
			<div class="demin">
				<div></div>
				<span class="normName">{{ pname }}</span>
				<span class="paramMax">{{ paramMax }}</span>
				<span class="paramMin">{{ paramMin }}</span>
			</div>
		</div>

		<div class="mapt">
			<div id="map_two" @click="changeStyle('1', 'map2')" :class="{ changeStyle: changeSelectStyle == 1 }"></div>
			<div class="Select">
				<el-select placeholder="对比频点" filterable v-model="point" @change="getCouponPoint($event, 'point')">
					<el-option v-for="item in Frequency" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-select placeholder="对比场景" filterable v-model="scene" @change="getCouponPoint($event, 'scene')">
					<el-option v-for="item in Scene" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-select placeholder="对比指标" filterable v-model="quota" @change="getCouponPoint($event, 'quota')">
					<el-option v-for="item in Quota" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</div>
			<!--图2图例-->
			<div class="demins">
				<div></div>
				<span class="normName">{{ name_two }}</span>
				<span class="paramMax">{{ paramMax_two }}</span>
				<span class="paramMin">{{ paramMin_two }}</span>
			</div>
		</div>
		<!--点击弹窗-->
		<detial-dialog
			v-show="mesFalse2 && rowDataList.length > 0"
			:row-data-list="rowDataList"
			:dialogStyle="dialogStyle"
			:village="village"
			@close="mesFalse2 = false"
		></detial-dialog>
	</div>
</template>
<script>
import mapStyle from '@/assets/js/mapStyle.js';
import { indexQuery } from '@/api/dashboard.js';
import { mulsectorQuery } from '@/api/dashboard.js';
import { canvasMap } from '@/api/Method.js';
import { multiScreenLayerQuery } from '@/api/dashboard.js';
import { multiFlylineQuery } from '@/api/dashboard.js';
import { ShowLayerData } from '@/api/dashboard.js';
import { selectSectorByRegion } from '@/api/dashboard.js';
import { earfcnSceneIndexQuery } from '@/api/dashboard.js';
import { mapGetters } from 'vuex';
import BMap from 'BMap';
export default {
	name: 'center',
	components: {
		detialDialog: () => import('./components/detialDialog')
	},
	data() {
		return {
			map: null,
			map2: null,
			mesFalse2: false,
			rowDataList: [],
			dialogStyle: '',
			village: '',
			//mapStyle: mapStyle.styleJson(),
			changeSelectStyle: '',
			mapStyle: {
				style: 'midnight',
				backgroundColor: 'red'
			},
			//图例
			paramMax: '',
			paramMin: '',
			name_two: '',
			paramMax_two: '',
			paramMin_two: '',

			//下拉数据
			Frequency: [],
			point: '',
			Scene: [],
			scene: '',
			Quota: [],
			quota: '',
			isOpend: false,
			DrawingMap: 'map1',
			SeQuota: [], //二分屏选中指标
			SequotaName: [] //二分屏选中指标名字
		};
	},

	computed: {
		...mapGetters([
			'networkType',
			'timeTypeId',
			'time',
			'spaceType',
			'checkedData',
			'spaceCheck',
			'cityId',
			'dimen',
			'indexIds',
			'indexIds',
			'setmodel',
			'pname',
			'mapCenter',
			'senceList',
			'selCity',
			'QuotaListName'
		]),
		dataRange() {
			const { time, timeTypeId, indexIds, cityId, checkedData, spaceCheck } = this;
			return { time, timeTypeId, indexIds, cityId, checkedData, spaceCheck };
		}
	},
	watch: {
		mesFalse2: {
			handler(val) {
				this.$store.commit('controlModel/SET_MESFAKSE', val);
			}
		},
		dataRange(val) {
			this.WorkGinseng();
		},
		setmodel(val) {
			setTimeout(() => {
				if (val == true) {
					this.WorkGinseng();
					this.$store.commit('controlModel/SET_SETMODEL', false);
				}
			}, 1000);
		},
		indexIds(val) {
			this.SeQuota[0] = val;
		},

		selCity(val) {
			if (val == '日喀则地区') {
				val = '珠穆朗玛峰';
				this.map.centerAndZoom(val, 11);
				this.map2.centerAndZoom(val, 11);
			} else {
				this.map2.centerAndZoom(val, 11);
				this.map.centerAndZoom(val, 11);
			}
		},
		networkType(val) {
			this.SceneIndexQuery();
		},

		//选择下拉指标
		SeQuota: {
			handler(val) {
				this.$store.commit('controlModel/SET_SEQUOTA', val);
				this.QuotaQuery();
				this.$store.commit('controlModel/SET_SEQUOTANAME', this.SequotaName);
			},
			immediate: true
		},
		indexIds(val) {
			this.QuotaQuery();
		},

		mapCenter(val) {
			this.WorkGinseng(); //清除所有覆盖物重新加载数据
			setTimeout(() => {
				var point = new BMap.Point(val[1], val[0]);
				this.map.centerAndZoom(point, 16);
				this.map2.centerAndZoom(point, 16);
				var marker = new BMap.Marker(point);
				var marker2 = new BMap.Marker(point);
				this.map.addOverlay(marker);
				this.map2.addOverlay(marker2);
				marker.setAnimation(BMAP_ANIMATION_BOUNCE);
				marker2.setAnimation(BMAP_ANIMATION_BOUNCE);
			}, 1000);
		}
	},
	methods: {
		changeStyle(index, Map) {
			this.changeSelectStyle = index;
			this.DrawingMap = Map;
		},
		// 点击弹窗
		clickmarker(item, event) {
			if (this.networkType == '11') {
				var networkType = '2G';
			} else if (this.networkType == '12') {
				var networkType = '4G';
			} else {
				var networkType = '5G';
			}

			if (item.maptype == 4) {
				var params = {
					networkType: networkType,
					cityId: this.cityId,
					pointList: [
						{
							longitude: item.lngBd,
							latitude: item.latBd
						},
						{
							longitude: item.longitude,
							latitude: item.latitude
						}
					],
					azimuth: item.deg
				};
			} else {
				var params = {
					networkType: networkType,
					cityId: this.cityId,
					pointList: [
						{
							longitude: item.lngBd,
							latitude: item.latBd
						}
					],
					azimuth: item.deg
				};
			}
			var url = 'api/gis-web/layer/eciQuery';
			this.$http
				.post(url, params)
				.then(res => {
					if (res.status == 200) {
						this.rowDataList = [];
						this.mesFalse2 = true;
						let offsetTop = event.offsetY;
						let offsetLeft = event.offsetX;
						let Width = event.target.width;
						let Height = event.target.height;
						switch (this.DrawingMap) {
							case 'map1':
								this.dialogStyle = {
									top: `${offsetTop}px`, // 往下偏移 30
									left: `${offsetLeft - 110}px` // 往左偏移 110
								};
								break;
							case 'map2':
								this.dialogStyle = {
									top: `${offsetTop}px`, // 往下偏移 30
									left: `${offsetLeft - 110 + Width}px` // 往左偏移 110
								};
								break;
							default:
								break;
						}

						this.village = item.maptype;

						if (res.data.result !== null) {
							this.rowDataList = res.data.result.eciList;
						} else {
							this.$message({
								type: 'warning',
								message: '查询不到小区!'
							});
						}
					}
				})
				.catch(err => {
					this.$message({
						type: 'warning',
						message: err.data.massege
					});
				});
		},

		//工参扇区图层查询接口
		WorkGinseng() {
			this.map.clearOverlays();
			if (this.networkType == '11') {
				var networkType = '2G';
			} else if (this.networkType == '12') {
				var networkType = '4G';
			} else {
				var networkType = '5G';
			}
			if (this.spaceType == '21') {
				var spacetype = '1';
			} else if (this.spaceType == '22') {
				var spacetype = '2';
			} else {
				var spacetype = '3';
			}
			if (this.dimen == 'network') {
				var params = {
					area: {
						cityId: this.cityId
					},
					network: {
						networkType: networkType,
						networkValue: this.checkedData
					}
				};
			} else {
				var params = {
					area: {
						cityId: this.cityId
					},
					network: {
						networkType: networkType,
						networkValue: []
					},
					space: {
						sceneTypeId: spacetype,
						sceneList: this.senceList
					}
				};
			}
			this.$http.post('api/gis-web/layer/parameterQuery', params).then(res => {
				var data = []; //图层数据
				var list = res.data.result.eciList;
				this.map.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 8);
				this.map2.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 8);
				list.forEach(item =>
					data.push({
						geometry: {
							type: 'Point',
							coordinates: [item.lngBd - 0, item.latBd - 0]
						},
						deg: item.azimuth - 0,
						content: item.earfcn,
						communityName: item.communityName,
						eci: item.eci,
						nettype: item.nettype,
						lngBd: item.lngBd,
						latBd: item.latBd,
						index: -1,
						//count: item.index/res.result.indexMax,
						count: 30 * Math.random(),
						maptype: 'more'
					})
				);
				var options = {
					draw: 'petal',
					size: 500,
					mixBlendMode: 'normal',
					unit: 'm',
					fillStyle: 'blue',
					methods: {
						click: (item, event) => {
							if (item && item !== null) {
								this.clickmarker(item, event);
							}
						}
					}
				};
				var mapvLayer = new mapv.baiduMapLayer(this.map, new mapv.DataSet(data), options);
				var mapvLayer = new mapv.baiduMapLayer(this.map2, new mapv.DataSet(data), options);
				this.DrawMap();
			});
		},
		createMap() {
			this.map = new BMap.Map('map', {
				enableMapClick: false,
				minZoom: 11,
				maxZoom: 19
			});
			this.map.centerAndZoom(this.selCity, 8);
			this.map.setMapStyle(this.mapStyle);
			this.map.enableScrollWheelZoom(true);

			this.map2 = new BMap.Map('map_two', {
				enableMapClick: false,
				minZoom: 11,
				maxZoom: 19
			});
			this.map2.centerAndZoom(this.selCity, 8);
			this.map2.setMapStyle(this.mapStyle);
			this.map2.enableScrollWheelZoom(true);
			this.map.addEventListener('click', () => {
				if (this.mesFalse2) {
					this.mesFalse2 = false;
				}
				if (this.mesFalse) {
					this.mesFalse = false;
				}
			});
			this.map.addEventListener('zoomend', () => {
				if (this.mesFalse2) {
					this.mesFalse2 = false;
				}
				if (this.mesFalse) {
					this.mesFalse = false;
				}
			});
			this.map.addEventListener('dragstart', () => {
				if (this.mesFalse2) {
					this.mesFalse2 = false;
				}
				if (this.mesFalse) {
					this.mesFalse = false;
				}
			});
			this.map2.addEventListener('click', () => {
				if (this.mesFalse2) {
					this.mesFalse2 = false;
				}
				if (this.mesFalse) {
					this.mesFalse = false;
				}
			});
			this.map2.addEventListener('zoomend', () => {
				if (this.mesFalse2) {
					this.mesFalse2 = false;
				}
				if (this.mesFalse) {
					this.mesFalse = false;
				}
			});
			this.map2.addEventListener('dragstart', () => {
				if (this.mesFalse2) {
					this.mesFalse2 = false;
				}
				if (this.mesFalse) {
					this.mesFalse = false;
				}
			});
			setTimeout(() => {
				this.WorkGinseng();
			}, 1000);
		},

		DrawMap() {
			this.MorePol = [];
			var styleOptions = {
				strokeColor: 'red', //边线颜色。
				fillColor: '', //填充颜色。当参数为空时，圆形将没有填充效果。
				strokeWeight: 1, //边线的宽度，以像素为单位。
				strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
				fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
				strokeStyle: 'solid' //边线的样式，solid或dashed。
			};
			if (this.networkType == '11') {
				var networkType = '2G';
			} else if (this.networkType == '12') {
				var networkType = '4G';
			} else {
				var networkType = '5G';
			}
			if (this.spaceType == '21') {
				var spacetype = '1';
			} else if (this.spaceType == '22') {
				var spacetype = '2';
			} else {
				var spacetype = '3';
			}

			//图层类型接口
			ShowLayerData().then(res => {
				if (res.code == 200) {
					let Datalist = res.result;
					for (let i in Datalist) {
						if (this.dimen == 'network') {
							//判断空间或者网元给接口不同的参数
							if (Datalist[i].layerTypeId == 4) {
								var params = {
									//网元维度飞线图层参数
									area: {
										cityId: this.cityId
									},
									time: {
										timeTypeId: this.timeTypeId,
										timeValue: this.time
									},
									business: {
										indexId: this.indexIds
									},
									network: {
										networkType: networkType,
										networkValue: this.checkedData
									},
									showLayerVO: {
										flylineType: Datalist[i].flylineType
									}
								};
							} else {
								var params = {
									//网元维度其他图层参数
									area: {
										cityId: this.cityId
									},
									time: {
										timeTypeId: this.timeTypeId,
										timeValue: this.time
									},
									business: {
										indexId: this.indexIds
									},
									network: {
										networkType: networkType,
										networkValue: this.checkedData
									}
								};
							}
						} else {
							if (Datalist[i].layerTypeId == 4) {
								var params = {
									//空间维度飞线图层参数
									area: {
										cityId: this.cityId
									},
									time: {
										timeTypeId: this.timeTypeId,
										timeValue: this.time
									},
									business: {
										indexId: this.indexIds
									},
									network: {
										networkType: networkType,
										networkValue: []
									},

									space: {
										sceneTypeId: spacetype,
										sceneList: this.senceList
									},
									showLayerVO: {
										flylineType: Datalist[i].flylineType
									}
								};
							} else {
								var params = {
									//空间维度其他图层参数
									area: {
										cityId: this.cityId
									},
									time: {
										timeTypeId: this.timeTypeId,
										timeValue: this.time
									},
									business: {
										indexId: this.indexIds
									},
									network: {
										networkType: networkType,
										networkValue: []
									},

									space: {
										sceneTypeId: spacetype,
										sceneList: this.senceList
									}
								};
							}
						}
						switch (Datalist[i].layerTypeId) {
							case 1: //扇区
								var arr = {
									url: 'gis-web/sector/sectorQuery', //图层数据接口
									data: params, //图层数据接口参数
									type: 1, //判断图层类型，扇区1、栅格2、热力图3、飞线图4、点图5
									options: {
										//图层样式设置，可为空
										draw: 'petal', //option不为空时依赖draw划图层类型，扇区:petal、栅格:grid、热力图:heatmap、飞线图:intensity、点图:intensity
										size: Datalist[i].radius,
										mixBlendMode: 'normal',
										unit: 'm',
										fillStyle: 'blue',
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										}
									},
									maps: this.map, //渲染地图的容器
									spaceType: this.spaceType, //判断选中的是否是自定义场景选项
									dimen: this.dimen //判断空间和网元选中
								};
								//方法调用
								canvasMap(arr).then(res => {
									if (res) {
										//将方法返回的数据渲染到vue页面
										this.paramMin = res.paramMin;
										this.paramMax = res.paramMax;
										if (res.MorePol)
											//判断自定义框选范围是否为空，不为空则渲染到页面
											res.MorePol.forEach(items => {
												if (items.geometryId == 2) {
													let polArray = [];
													items.points.forEach(item => {
														let p = new BMap.Point(item.longitude, item.latitude);
														polArray.push(p);
													});
													let polygon = new BMap.Polygon(polArray, styleOptions);
													this.map.addOverlay(polygon);
												} else {
													var point = new BMap.Point(items.circle.longitude, items.circle.latitude);
													var radius = items.circle.radius;
													let polygon = new BMap.Circle(point, radius, styleOptions);
													this.map.addOverlay(polygon);
												}
											});
									} else {
										this.paramMin = '';
										this.paramMax = '';
									}
								});
								break;
							case 2: //栅格
								var arr = {
									url: 'gis-web/sector/sectorQuery',
									data: params,
									type: 2,
									options: {
										size: 500,
										globalAlpha: 0.7,
										unit: 'm',
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										},

										draw: 'grid'
									},
									maps: this.map,
									spaceType: this.spaceType,
									dimen: this.dimen
								};
								canvasMap(arr).then(res => {
									if (res) {
										this.paramMin = res.paramMin;
										this.paramMax = res.paramMax;
										if (res.MorePol)
											res.MorePol.forEach(items => {
												if (items.geometryId == 2) {
													let polArray = [];
													items.points.forEach(item => {
														let p = new BMap.Point(item.longitude, item.latitude);
														polArray.push(p);
													});
													let polygon = new BMap.Polygon(polArray, styleOptions);
													this.map.addOverlay(polygon);
												} else {
													var point = new BMap.Point(items.circle.longitude, items.circle.latitude);
													var radius = items.circle.radius;
													let polygon = new BMap.Circle(point, radius, styleOptions);
													this.map.addOverlay(polygon);
												}
											});
									} else {
										this.paramMin = '';
										this.paramMax = '';
									}
								});
								break;
							case 3: //热力图option
								var arr = {
									url: 'gis-web/sector/sectorQuery',
									data: params,
									type: 3,
									options: {
										size: 13,
										gradient: {
											0.25: 'rgb(0,0,255)',
											0.55: 'rgb(0,255,0)',
											0.85: 'yellow',
											1.0: 'rgb(255,0,0)'
										},
										max: 100,
										maxOpacity: 0.7,
										draw: 'heatmap'
									},
									maps: this.map,
									spaceType: this.spaceType,
									dimen: this.dimen
								};
								canvasMap(arr).then(res => {
									if (res) {
										this.paramMin = res.paramMin;
										this.paramMax = res.paramMax;
										if (res.MorePol)
											res.MorePol.forEach(items => {
												if (items.geometryId == 2) {
													let polArray = [];
													items.points.forEach(item => {
														let p = new BMap.Point(item.longitude, item.latitude);
														polArray.push(p);
													});
													let polygon = new BMap.Polygon(polArray, styleOptions);
													this.map.addOverlay(polygon);
												} else {
													var point = new BMap.Point(items.circle.longitude, items.circle.latitude);
													var radius = items.circle.radius;
													let polygon = new BMap.Circle(point, radius, styleOptions);
													this.map.addOverlay(polygon);
												}
											});
									} else {
										this.paramMin = '';
										this.paramMax = '';
									}
								});
								break;
							case 4:
								var arr = {
									url: 'gis-web/flyline/flylineQuery',
									data: params,
									type: 4,
									options: {
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										},
										lineWidth: 3,
										max: 30,
										draw: 'intensity'
									},
									maps: this.map,
									spaceType: this.spaceType,
									dimen: this.dimen
								};
								canvasMap(arr).then(res => {
									if (res) {
										this.paramMin = res.paramMin;
										this.paramMax = res.paramMax;
										if (res.MorePol)
											res.MorePol.forEach(items => {
												if (items.geometryId == 2) {
													let polArray = [];
													items.points.forEach(item => {
														let p = new BMap.Point(item.longitude, item.latitude);
														polArray.push(p);
													});
													let polygon = new BMap.Polygon(polArray, styleOptions);
													this.map.addOverlay(polygon);
												} else {
													var point = new BMap.Point(items.circle.longitude, items.circle.latitude);
													var radius = items.circle.radius;
													let polygon = new BMap.Circle(point, radius, styleOptions);
													this.map.addOverlay(polygon);
												}
											});
									} else {
										this.paramMin = '';
										this.paramMax = '';
									}
								});
								break;
							case 5: //点图option
								var arr = {
									url: 'gis-web/sector/sectorQuery',
									data: params,
									type: 5,
									options: {
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										},
										max: 30,
										draw: 'intensity'
									},
									maps: this.map,
									spaceType: this.spaceType,
									dimen: this.dimen
								};
								canvasMap(arr).then(res => {
									if (res) {
										this.paramMin = res.paramMin;
										this.paramMax = res.paramMax;
										if (res.MorePol)
											res.MorePol.forEach(items => {
												if (items.geometryId == 2) {
													let polArray = [];
													items.points.forEach(item => {
														let p = new BMap.Point(item.longitude, item.latitude);
														polArray.push(p);
													});
													let polygon = new BMap.Polygon(polArray, styleOptions);
													this.map.addOverlay(polygon);
												} else {
													var point = new BMap.Point(items.circle.longitude, items.circle.latitude);
													var radius = items.circle.radius;
													let polygon = new BMap.Circle(point, radius, styleOptions);
													this.map.addOverlay(polygon);
												}
											});
									} else {
										this.paramMin = '';
										this.paramMax = '';
									}
								});
								break;
							case 6:
								this.mapType = 'grid';
								break;
							default:
								break;
						}
					}
				} else {
					this.$message({
						type: 'warning',
						message: res.massege
					});
				}
			});
		},

		//分屏下拉接口数据
		SceneIndexQuery() {
			let networkType = '';
			if (this.networkType == '11') {
				networkType = '2G';
			} else if (this.networkType == '12') {
				networkType = '4G';
			} else {
				networkType = '5G';
			}
			let params = {
				networkType: networkType,
				cityId: this.cityId
			};
			this.Frequency = [];
			this.Quota = [];
			this.Scene = [];
			earfcnSceneIndexQuery(params).then(res => {
				if ((res.code = 1041)) {
					let earfcn = res.result.earfcnList;
					let index = res.result.indexList;
					let scene = res.result.sceneList;
					for (var i in earfcn) {
						this.Frequency.push({
							value: earfcn[i].earfcnId,
							label: earfcn[i].earfcnName
						});
					}
					for (var i in index) {
						this.Quota.push({
							value: index[i].id,
							label: index[i].pname,
							labels: index[i].name
						});
					}
					for (var i in scene) {
						this.Scene.push({
							value: scene[i].sceneId,
							label: scene[i].sceneName
						});
					}
				}
				this.SeQuota = [this.indexIds];
				this.QuotaQuery();
			});
		},
		//下拉对比查询数据
		getCouponPoint(val, type) {
			this.map2.clearOverlays(); //先清除原有的图层数据
			let networkType = '';
			if (this.networkType == '11') {
				networkType = '2G';
			} else if (this.networkType == '12') {
				networkType = '4G';
			} else {
				networkType = '5G';
			}
			ShowLayerData().then(res => {
				if (res.code == 200) {
					let Datalist = res.result;
					for (let i in Datalist) {
						if (type == 'point') {
							//频点change
							this.scene = '';
							this.quota = '';
							this.SeQuota = [];
							this.SeQuota = [this.indexIds, this.quota];
							this.SeQuota = this.SeQuota.filter(item => {
								if (item !== '') {
									return true;
								}
							});
							var changeVal = [];
							var obj = {};
							obj = this.Frequency.find(function(item) {
								return item.value === val;
							});
							changeVal.push(obj.label);
							this.name_two = this.pname;
							var params = {
								area: {
									cityId: this.cityId
								},
								time: {
									timeTypeId: this.timeTypeId,
									timeValue: this.time
								},
								business: {
									indexId: this.indexIds
								},
								network: {
									networkType: networkType,
									networkValue: changeVal
								},
								showLayerVO: {
									flylineType: Datalist[i].flylineType
								}
							};
						} else if (type == 'scene') {
							//场景change
							this.point = '';
							this.quota = '';
							this.SeQuota = [];

							this.SeQuota = [this.indexIds, this.quota];
							this.SeQuota = this.SeQuota.filter(item => {
								if (item !== '') {
									return true;
								}
							});
							var obj = {};
							obj = this.Scene.find(function(item) {
								return item.value === val;
							});
							this.name_two = this.pname;
							var params = {
								area: {
									cityId: this.cityId
								},
								time: {
									timeTypeId: this.timeTypeId,
									timeValue: this.time
								},
								business: {
									indexId: this.indexIds
								},
								network: {
									networkType: networkType,
									networkValue: []
								},
								space: {
									sceneTypeId: 1,
									sceneList: [
										{
											sceneId: '',
											sceneName: obj.label
										}
									]
								},
								showLayerVO: {
									flylineType: Datalist[i].flylineType
								}
							};
						} else {
							this.point = '';
							this.scene = '';
							this.SeQuota = [];

							this.SeQuota = [this.indexIds, this.quota];
							this.SeQuota = this.SeQuota.filter(item => {
								if (item !== '') {
									return true;
								}
							});
							var obj = {};
							obj = this.Quota.find(function(item) {
								return item.value === val;
							});
							this.name_two = obj.label;
							var params = {
								area: {
									cityId: this.cityId
								},
								time: {
									timeTypeId: this.timeTypeId,
									timeValue: this.time
								},
								business: {
									indexId: obj.value
								},
								network: {
									networkType: networkType,
									networkValue: this.checkedData
								},
								showLayerVO: {
									flylineType: Datalist[i].flylineType
								}
							};
						}
						switch (Datalist[i].layerTypeId) {
							case 1: //扇区
								mulsectorQuery(params).then(res => {
									var Data = [];
									var list = res.result.sectorList;
									this.paramMax_two = res.result.indexMax;
									this.paramMin_two = res.result.indexMin;
									this.map2.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
									for (let i in list) {
										Data.push({
											geometry: {
												type: 'Point',
												coordinates: [list[i].lngBd - 0, list[i].latBd - 0]
											},
											lngBd: list[i].lngBd,
											latBd: list[i].latBd,
											deg: list[i].azimuth - 0,
											content: list[i].earfcn,
											communityName: list[i].communityName,
											eci: list[i].eci,
											nettype: list[i].nettype,
											index: list[i].index / res.result.indexMax,
											count: 30 * Math.random(),
											maptype: 'more'
										});
									}
									var options = {
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										},
										draw: 'petal',
										size: Datalist[i].radius,
										mixBlendMode: 'normal',
										unit: 'm',
										fillStyle: 'blue',
										globalAlpha: this.opcity / 100
									};
									var mapvLayer = new mapv.baiduMapLayer(this.map2, new mapv.DataSet(Data), options);
								});

								break;
							case 2: //栅格
								multiScreenLayerQuery(params).then(res => {
									var Data = [];
									var list = res.result.sectorList;
									for (let i in list) {
										Data.push({
											geometry: {
												type: 'Point',
												coordinates: [list[i].lngBd - 0, list[i].latBd - 0]
											},
											content: list[i].earfcn,
											communityName: list[i].communityName,
											eci: list[i].eci,
											lngBd: list[i].lngBd,
											latBd: list[i].latBd,
											nettype: list[i].nettype,
											index: list[i].index / res.result.indexMax,
											count: 30 * Math.random(),
											maptype: 2
										});
									}
									var options = {
										fillStyle: 'rgba(55, 50, 250, 0.5)',
										shadowBlur: 20,
										size: 500,
										globalAlpha: 0.7,
										unit: 'm',
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										},
										draw: 'grid'
									};
									var mapvLayer = new mapv.baiduMapLayer(this.map2, new mapv.DataSet(Data), options);
								});
								break;
							case 3: //热力图option
								mulsectorQuery(params).then(res => {
									var Data = [];
									var list = res.result.sectorList;
									this.paramMax_two = res.result.indexMax;
									this.paramMin_two = res.result.indexMin;
									this.map2.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
									for (let i in list) {
										Data.push({
											geometry: {
												type: 'Point',
												coordinates: [list[i].lngBd - 0, list[i].latBd - 0]
											},
											lngBd: list[i].lngBd,
											latBd: list[i].latBd,
											deg: list[i].azimuth - 0,
											content: list[i].earfcn,
											communityName: list[i].communityName,
											eci: list[i].eci,
											nettype: list[i].nettype,
											index: list[i].index / res.result.indexMax,
											count: list[i].index,
											maptype: 'more'
										});
									}
									var options = {
										size: 13,
										gradient: {
											0.25: 'rgb(0,0,255)',
											0.55: 'rgb(0,255,0)',
											0.85: 'yellow',
											1.0: 'rgb(255,0,0)'
										},
										max: 100,
										maxOpacity: 0.7,
										draw: 'heatmap'
									};
									var mapvLayer = new mapv.baiduMapLayer(this.map2, new mapv.DataSet(Data), options);
								});

								break;
							case 4:
								multiFlylineQuery(params).then(res => {
									var Data = [];
									var list = res.result.sectorList;
									this.paramMax_two = res.result.indexMax;
									this.paramMin_two = res.result.indexMin;
									this.map2.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
									list.forEach(item =>
										Data.push({
											geometry: {
												type: 'LineString',
												coordinates: [[item.longitude - 0, item.latitude - 0], [item.lngBd - 0, item.latBd - 0]]
											},
											lngBd: item.lngBd,
											latBd: item.latBd,
											longitude: item.longitude,
											latitude: item.latitude,
											deg: item.azimuth - 0,
											content: item.earfcn,
											communityName: item.communityName,
											eci: item.eci,
											cgi: item.cgi,
											flylineType: item.flylineType,
											nettype: item.nettype,
											index: item.index / res.result.indexMax,
											zero: false,
											count: 30 * Math.random(),
											maptype: 4
										})
									);
									var options = {
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										},
										lineWidth: 2,
										max: 30,
										draw: 'intensity'
									};
									var mapvLayer = new mapv.baiduMapLayer(this.map2, new mapv.DataSet(Data), options);
								});
								break;
							case 5: //点图option
								mulsectorQuery(params).then(res => {
									var Data = [];
									var list = res.result.sectorList;
									this.paramMax_two = res.result.indexMax;
									this.paramMin_two = res.result.indexMin;
									this.map2.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
									for (let i in list) {
										Data.push({
											geometry: {
												type: 'Point',
												coordinates: [list[i].lngBd - 0, list[i].latBd - 0]
											},
											lngBd: list[i].lngBd,
											latBd: list[i].latBd,
											deg: list[i].azimuth - 0,
											content: list[i].earfcn,
											communityName: list[i].communityName,
											eci: list[i].eci,
											nettype: list[i].nettype,
											index: list[i].index / res.result.indexMax,
											count: 30 * Math.random(),
											maptype: 'more'
										});
									}
									var options = {
										draw: 'intensity',
										methods: {
											click: (item, event) => {
												if (item && item !== null) {
													this.clickmarker(item, event);
												}
											}
										}
									};

									var mapvLayer = new mapv.baiduMapLayer(this.map2, new mapv.DataSet(Data), options);
								});

								break;
							case 6:
								this.mapType = 'grid';
								break;
							default:
								break;
						}
					}
				}
			});
		},
		QuotaQuery() {
			this.SequotaName = [];
			this.SeQuota.forEach(item => {
				this.Quota.forEach(items => {
					if (item == items.value) {
						this.SequotaName.push(items.label);
					}
				});
			});
		}
	},
	mounted() {
		this.createMap();
		this.SceneIndexQuery();
	}
};
</script>

<style lang="scss" scoped>
#map,
#map_two {
	width: 100%;
	height: 100%;
	border: 1px solid #0e417f;
}

.maps,
.mapt {
	position: relative;
	width: 50%;
	height: 100%;
	float: left;
}

.Select {
	position: absolute;
	right: 0;
	top: 0;
}

.Select div {
	width: 110px;
}

/deep/.BMap_cpyCtrl {
	display: none !important;
}

/deep/.anchorBL {
	display: none !important;
}

#map-box {
	position: relative;
	height: inherit;
}

.changeStyle {
	border: 1px solid #4cb1ff !important;
}

.demin,
.demins {
	position: absolute;
	width: 20px;
	height: 60px;
	bottom: 10px;
	left: 10px;
	background: linear-gradient(to top, #1b3eff, #59f63f, #ffe01b, #af2626);
}

.paramMax {
	position: absolute;
	bottom: 48px;
	left: 22px;
}

.paramMin {
	position: absolute;
	bottom: -4px;
	left: 22px;
}

.normName {
	position: absolute;
	width: 120px;
	top: -30px;
	text-align: left;
	left: 0px;
}

/deep/.el-input__inner {
	background: #0b1c74;
	border-color: #0733b5;
	color: #ffffff;
}
</style>
