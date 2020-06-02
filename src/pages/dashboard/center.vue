<template>
	<div class="map-box">
		<div id="map"></div>
		<div class="demin">
			<div></div>
			<span class="normName">{{ pname }}</span>】
			<span class="paramMax">{{ paramMax }}</span>
			<span class="paramMin">{{ paramMin }}</span>
		</div>
		<!--点击弹窗-->
		<detial-dialog
			v-show="mesFalse2 && rowDataList.length > 0"
			:row-data-list="rowDataList"
			:dialogStyle="dialogStyle"
			:village="village"
			@close="mesFalse2 = false"
		></detial-dialog>
		<senceModel v-show="SenceShow && senceData.length > 0" ref="senceModel" v-on:senceHide="senceHide"></senceModel>
	</div>
</template>
<script>
//	import mapStyle from '@/assets/js/mapStyle.js'
import { indexQuery } from '@/api/dashboard.js';
import { sectorQuery } from '@/api/dashboard.js';
import { layerQuery } from '@/api/dashboard.js';
import { ShowLayerData } from '@/api/dashboard.js';
import { sectorQueryByRange } from '@/api/dashboard.js';
//import { querySectorByScene } from '@/api/dashboard.js'

import { mapGetters } from 'vuex';
import BMap from 'BMap';
import funHelper from 'lodash';
let timer;
export default {
	name: 'center',
	components: {
		detialDialog: () => import('./components/detialDialog'),
		senceModel: () => import('./components/senceModel')
	},
	data() {
		return {
			map: null,
			mesFalse2: false,
			rowDataList: [],
			dialogStyle: '',
			paramMax: '',
			paramMin: '',
			village: '',
			//mapStyle: mapStyle.styleJson(),
			mapStyle: {
				style: 'midnight'
			},
			isOpend: false,
			DrawingMap: 'map',
			mapType: '',
			senceData: [],
			senceName: '',
			SenceShow: false,
			Point: [], //自定义场景描述点
			MorePol: [], //图层数据框选描述点
			LessPol: [] //栅格数据框选描述点
		};
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
			'indexIds',
			'mapCenter',
			'senceList',
			'setmodel',
			'spaceCheck',
			'pname',
			'selCity'
		]),
		dataRange() {
			const { time, timeTypeId, indexIds, cityId, checkedData, spaceCheck } = this;
			return { time, timeTypeId, cityId, indexIds, checkedData, spaceCheck };
		}
	},
	watch: {
		mesFalse2: {
			handler(val) {
				this.$store.commit('controlModel/SET_MESFAKSE', val);
			}
		},
		status(val) {
			setTimeout(() => {
				if (val == true) {
					this.WorkGinseng();
					this.$store.commit('settingModel/SET_STATUS', false);
				}
			}, 1000);
		},
		dimen(val) {
			if (this.isOpend == 'true') {
				this.drawingManager.close();
				this.SenceShow = false;
				this.senceData = [];
			}
		},
		spaceType(val) {
			if (this.isOpend == 'true') {
				this.drawingManager.close();
				this.SenceShow = false;
				this.senceData = [];
			}
		},
		setmodel(val) {
			setTimeout(() => {
				if (val == true) {
					this.WorkGinseng();
					this.$store.commit('controlModel/SET_SETMODEL', false);
				}
			}, 1000);
		},

		selCity(val) {
			if (val == '日喀则地区') {
				val = '珠穆朗玛峰';
				this.map.centerAndZoom(val, 11);
			} else {
				this.map.centerAndZoom(val, 11);
			}
		},
		dataRange(val) {
			this.WorkGinseng();
		},
		mapCenter(val) {
			this.WorkGinseng(); //清除所有覆盖物重新加载数据
			setTimeout(() => {
				var point = new BMap.Point(val[1], val[0]);
				this.map.centerAndZoom(point, 16);
				var marker = new BMap.Marker(point);
				this.map.addOverlay(marker);
				marker.setAnimation(BMAP_ANIMATION_BOUNCE);
			}, 1000);
		}
	},
	mounted() {
		this.createMap();
	},
	methods: {
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
						this.dialogStyle = {
							top: `${offsetTop}px`, // 往下偏移 30
							left: `${offsetLeft - 110}px` // 往左偏移 110
						};
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
		// //工参扇区图层查询接口 （防抖）
		// WorkGinseng: funHelper.debounce(
		// 	function() {
		// 		console.log('频点=' + this.checkedData);
		// 		this.map.clearOverlays();
		// 		if (this.networkType == '11') {
		// 			var networkType = '2G';
		// 		} else if (this.networkType == '12') {
		// 			var networkType = '4G';
		// 		} else {
		// 			var networkType = '5G';
		// 		}
		// 		if (this.spaceType == '21') {
		// 			var spacetype = '1';
		// 		} else if (this.spaceType == '22') {
		// 			var spacetype = '2';
		// 		} else {
		// 			var spacetype = '3';
		// 		}
		// 		if (this.dimen == 'network') {
		// 			var params = {
		// 				area: {
		// 					cityId: this.cityId
		// 				},
		// 				network: {
		// 					networkType: networkType,
		// 					networkValue: this.checkedData
		// 				}
		// 			};
		// 		} else {
		// 			var params = {
		// 				area: {
		// 					cityId: this.cityId
		// 				},
		// 				network: {
		// 					networkType: networkType,
		// 					networkValue: []
		// 				},
		// 				space: {
		// 					sceneTypeId: spacetype,
		// 					sceneList: this.senceList
		// 				}
		// 			};
		// 		}
		// 		this.$http.post('api/gis-web/layer/parameterQuery', params).then(res => {
		// 			var Data = []; //图层数据
		// 			var list = res.data.result.sectorList;
		// 			this.map.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
		// 			list.forEach(item =>
		// 				Data.push({
		// 					geometry: {
		// 						type: 'Point',
		// 						coordinates: [item.lngBd - 0, item.latBd - 0]
		// 					},
		// 					deg: item.azimuth - 0,
		// 					content: item.earfcn,
		// 					communityName: item.communityName,
		// 					eci: item.eci,
		// 					nettype: item.nettype,
		// 					lngBd: item.lngBd,
		// 					latBd: item.latBd,
		// 					index: -1,
		// 					//count: item.index/res.result.indexMax,
		// 					count: 30 * Math.random(),
		// 					maptype: 'more'
		// 				})
		// 			);
		// 			var options = {
		// 				draw: 'petal',
		// 				size: 500,
		// 				mixBlendMode: 'normal',
		// 				unit: 'm',
		// 				fillStyle: 'blue',
		// 				methods: {
		// 					click: (item, event) => {
		// 						if (item && item !== null) {
		// 							this.clickmarker(item, event);
		// 						}
		// 					}
		// 				}
		// 			};
		// 			var mapvLayer = new mapv.baiduMapLayer(this.map, new mapv.DataSet(Data), options);
		// 			this.DrawMap();
		// 		});
		// 	},
		// 	1000,
		// 	{ leading: true, trailing: false }
		// ),

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
				var Data = []; //图层数据
				var list = res.data.result.eciList;
				this.map.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
				list.forEach(item =>
					Data.push({
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
				var mapvLayer = new mapv.baiduMapLayer(this.map, new mapv.DataSet(Data), options);
				this.DrawMap();
			});
		},
		//创建地图
		createMap() {
			this.map = new BMap.Map('map', {
				enableMapClick: false,
				minZoom: 8,
				maxZoom: 19
				//	mapType:BMAP_SATELLITE_MAP
			});
			this.map.centerAndZoom(this.selCity, 11);
			this.map.setMapStyle(this.mapStyle);
			this.map.enableScrollWheelZoom(true);
			this.map.addControl(
				//添加地图类型控件
				new BMap.MapTypeControl({
					mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP],
					anchor: BMAP_ANCHOR_TOP_RIGHT,
					offset: new BMap.Size(30, 10)
				})
			);
			//添加比例尺
			this.map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, offset: new BMap.Size(10, 10) }));

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
			setTimeout(() => {
				this.WorkGinseng();
			}, 1000);
		},
		senceHide(e) {
			this.SenceShow = e;
		},

		//图层类型查询，数据渲染
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
									url: 'gis-web/sector/sectorQuery',
									data: params,
									type: 1,
									options: {
										draw: 'petal',
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
									maps: this.map,
									spaceType: this.spaceType,
									dimen: this.dimen
								};
								canvasMap(arr).then(res => {
									if (res) {
										this.paramMin = res.paramMin;
										this.paramMax = res.paramMax;
										console.log(res);
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
							case 2: //栅格
								var arr = {
									url: '/gis-web/rasterLayer/layerQuery',
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
									//调用方法所需参数
									url: 'gis-web/sector/sectorQuery', //接口
									data: params, //接口参数
									type: 3,
									options: {
										// 自定义图层所需属性
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
									maps: this.map, //渲染地图的的di盒模型
									spaceType: this.spaceType, //方法判断自定义框选渲染所需的字段
									dimen: this.dimen //方法判断自定义框选渲染所需的字段
								};
								canvasMap(arr).then(res => {
									if (res) {
										//方法返回数据处理
										this.paramMin = res.paramMin; //方法返回最小指标渲染
										this.paramMax = res.paramMax; //方法返回最大指标渲染
										if (res.MorePol)
											//点击自定义框选时将框选范围和数据渲染
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
										//没有数据时清空之前的赋值
										this.paramMin = '';
										this.paramMax = '';
									}
								});
								break;
							case 4: //飞线图层
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
									//将方法返回的数据渲染到vue页面
									if (res) {
										this.paramMin = res.paramMin; //最大最小指标
										this.paramMax = res.paramMax;
										if (res.MorePol)
											//框选范围渲染
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

		//框选完成退出框选
		exsitInt() {
			let self = this;
			self.drawingManager.prototype.close = function() {
				// 判断绘制状态是否已经开启
				if (this._isOpen == false) {
					return true;
				}
				var me = this;
				this._close();
				setTimeout(function() {
					me._map.enableDoubleClickZoom();
				}, 2000);
			};
		},

		//框选
		initdrawingManager(toggle) {
			this.isOpend = toggle;
			var styleOptions = {
				strokeColor: 'red', //边线颜色。
				fillColor: '', //填充颜色。当参数为空时，圆形将没有填充效果。
				strokeWeight: 1, //边线的宽度，以像素为单位。
				strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
				fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
				strokeStyle: 'solid' //边线的样式，solid或dashed。
			};
			//实例化鼠标绘制工具
			this.drawingManager = new BMapLib.DrawingManager(this.map, {
				isOpen: this.isOpend, //是否开启绘制模式
				enableDrawingTool: this.isOpend, //是否显示工具栏
				drawingToolOptions: {
					anchor: BMAP_ANCHOR_TOP_LEFT, //位置
					offset: new BMap.Size(0, 0), //偏离值
					drawingModes: [
						// 可见的操作选项
						//BMAP_DRAWING_MARKER,
						BMAP_DRAWING_CIRCLE,
						//BMAP_DRAWING_POLYLINE,
						BMAP_DRAWING_POLYGON,
						BMAP_DRAWING_RECTANGLE
					]
				},
				circleOptions: styleOptions, //圆的样式
				//polylineOptions: styleOptions, //线的样式
				polygonOptions: styleOptions, //多边形的样式
				rectangleOptions: styleOptions //矩形的样式
			});
			//添加鼠标绘制工具监听事件，用于获取绘制结果
			this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);
		},
		//获取框选描述点
		overlaycomplete(e) {
			let networkType = '';
			if (this.networkType == '11') {
				networkType = '2G';
			} else if (this.networkType == '12') {
				networkType = '4G';
			} else {
				networkType = '5G';
			}
			let spacetype = '';
			if (this.spaceType == '21') {
				spacetype = '1';
			} else if (this.spaceType == '22') {
				spacetype = '2';
			} else {
				spacetype = '3';
			}
			//多边形选区
			if (e.drawingMode == BMAP_DRAWING_POLYLINE || e.drawingMode == BMAP_DRAWING_POLYGON || e.drawingMode == BMAP_DRAWING_RECTANGLE) {
				var path = e.overlay.getPath();
				var polygonArr = new Array();
				for (var i in path) {
					polygonArr.push({
						longitude: path[i].lng,
						latitude: path[i].lat
					});
				}
				this.Point = polygonArr;
				var params = {
					cityId: this.cityId,
					networkType: networkType,
					geometryId: 2,
					points: polygonArr
				};
				sectorQueryByRange(params).then(res => {
					if (res.code == 200) {
						this.SenceShow = true;
						this.senceData = res.result.eciList;
						this.$refs.senceModel.ChangeName(this.senceData, polygonArr, 2);
						this.drawingManager.close();
					} else {
						this.drawingManager.close();
						this.$message({
							type: 'warning',
							message: res.massege
						});
					}
				});
			}
			//圆形选区
			if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
				var Radius = e.overlay.getRadius();
				var params = {
					cityId: this.cityId,
					networkType: networkType,
					geometryId: 1,
					circle: {
						longitude: e.overlay.getCenter().lng,
						latitude: e.overlay.getCenter().lat,
						radius: Radius
					}
				};
				var circle = {
					longitude: e.overlay.getCenter().lng,
					latitude: e.overlay.getCenter().lat,
					radius: Radius
				};
				sectorQueryByRange(params).then(res => {
					if (res.code == 200) {
						this.SenceShow = true;
						this.senceData = res.result.eciList;
						this.$refs.senceModel.ChangeName(this.senceData, circle, 1);
						this.drawingManager.close();
					} else {
						this.drawingManager.close();
						this.$message({
							type: 'warning',
							message: res.massege
						});
					}
				});
			}
		}
	},
	created() {}
};
</script>

<style lang="scss" scoped>
#map {
	position: relative;
	width: 100%;
	height: 100%;
}

.demin {
	position: absolute;
	width: 30px;
	height: 100px;
	bottom: 10px;
	left: 10px;
	background: linear-gradient(to top, #1b3eff, #59f63f, #ffe01b, #af2626);
}

.paramMax {
	position: absolute;
	bottom: 88px;
	left: 32px;
}

.paramMin {
	position: absolute;
	bottom: -4px;
	left: 32px;
}

.normName {
	position: absolute;
	width: 120px;
	top: -30px;
	text-align: left;
	left: 0px;
}

/deep/.BMap_cpyCtrl {
	display: none !important;
}

/deep/.anchorBL {
	display: none !important;
}

.map-box {
	position: relative;
	height: inherit;
}

.map_task {
	position: absolute;
	top: 10px;
	left: 150px;
}

p {
	margin-top: 5px;
}

.el-select-dropdown__item {
	padding: 0;
}

.ul_box {
	position: absolute;
	bottom: -400px;
	left: -40px;
	width: 600px;
	height: 60px;
	display: inline-block;
	float: left;
	margin-top: 2px;
}

.my_timeline_item {
	display: inline-block;
	width: 50px;
}

.my_timeline_node {
	box-sizing: border-box;
	cursor: pointer;
	background-color: rgb(228, 231, 237);
	width: 6px;
	height: 10px;
}

.my_timeline_node.active {
	background-color: #fff !important;
	border: 3px solid #f68720;
}

.my_timeline_item_line {
	width: 100%;
	height: 10px;
	border-top: 2px solid #e4e7ed;
	border-left: none;
}

.my_timeline_item_content {
	text-align: left;
}

.my_timeline_item:nth-last-child(1) .my_timeline_item_line {
	width: 1px;
}
/deep/.BMap_scaleTxt {
	color: #ffffff !important;
}
</style>
