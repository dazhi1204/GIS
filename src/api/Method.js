//mavp方法封装调用
import $axios from './index'
export const canvasMap = function(obj) {
	return $axios.post(obj.url, obj.data).then(res => {
		var data = []; //图层数据
		if (!res.isSuccess) return
		var list = res.result.sectorList;
		var listZero = res.result.sectorListZero;
		var paramMax = res.result.indexMax;
		var paramMin = res.result.indexMin;
		//obj.maps.centerAndZoom(new BMap.Point(list[0].lngBd, list[0].latBd), 11);
		var MorePol = [];
		if (obj.spaceType == 23 && obj.dimen == 'space') {
			MorePol = res.result.sceneList;
		}


		if (obj.type == 2) { //栅格
			if (list !== null) {
				list.forEach(item => data.push({
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
					index: item.index / res.result.indexMax,
					zero: false,
					//count: item.index/res.result.indexMax,
					count: 30 * Math.random(),
					maptype: 2
				}));

			}

			if (listZero !== null) {
				listZero.forEach(item => data.push({
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
					zero: true,
					//count: item.index/res.result.indexMax,
					count: 30 * Math.random(),
					maptype: 2
				}))
			}

		} else if (obj.type == 4) { //飞线
			if (list !== null) {
				list.forEach(item => data.push({
					geometry: {
						type: 'LineString',
						coordinates: [
							[item.longitude - 0, item.latitude - 0],
							[item.lngBd - 0, item.latBd - 0]
						]
					},
					deg: item.azimuth - 0,
					content: item.earfcn,
					communityName: item.communityName,
					eci: item.eci,
					cgi: item.cgi,
					flylineType: item.flylineType,
					nettype: item.nettype,
					lngBd: item.lngBd,
					latBd: item.latBd,
					longitude: item.longitude,
					latitude: item.latitude,
					index: item.index / res.result.indexMax,
					zero: false,
					count: 30 * Math.random(),
					maptype: 4
				}));
			}
			if (listZero !== null) {
				listZero.forEach(item => data.push({
					geometry: {
						type: 'LineString',
						coordinates: [
							[item.lngBd - 0, item.latBd - 0],
							[item.lngBd - 0, item.latBd - 0]
						]
					},
					deg: item.azimuth - 0,
					content: item.earfcn,
					communityName: item.communityName,
					eci: item.eci,
					cgi: item.cgi,
					flylineType: item.flylineType,
					nettype: item.nettype,
					lngBd: item.lngBd,
					latBd: item.latBd,
					index: -1,
					zero: false,
					count: 30 * Math.random(),
					maptype: 4
				}))
			}
		} else {
			if (list !== null) {
				list.forEach(item => data.push({
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
					index: item.index / res.result.indexMax,
					zero: false,
					count: item.index,
					//count: 30 * Math.random(),
					maptype: 'more'

				}));
			}
			if (listZero !== null) {
				listZero.forEach(item => data.push({
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
					zero: true,
					count: item.index/res.result.indexMax,
					//count: 30 * Math.random(),
					maptype: 'more'
				}))
			}

		}
		switch (obj.type) {
			case 1:
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
				}
				break;
			case 2:
				var options = {
					draw: 'grid',
					size: 40,
					label: { // 网格中显示累加的值总和
						show: true,
						fillStyle: 'white',
						shadowColor: 'yellow',
						font: '20px Arial',
						shadowBlur: 10,
					},
					gradient: {
						.1: 'rgba(27,62,255,0.7)',
						.2: 'rgba(16, 167, 255, 0.7)',
						.3: 'rgba(27, 230, 247, 0.7)',
						.4: 'rgba(89, 246, 63, 0.7)',
						.5: 'rgba(169, 255, 74, 0.7)',
						.6: 'rgba(247, 255, 67, 0.7)',
						.7: 'rgba(255, 224, 27, 0.7)',
						.8: 'rgba(255, 155, 0, 0.7)',
						.9: 'rgba(255, 120, 58, 0.7)',
						1: 'rgba(175, 38, 38, 0.7)'
					},
					methods: {
						click: (item, event) => {
							if (item && item !== null) {
								this.clickmarker(item, event);
							}
						}
					}
				}
				break;
			case 3:
				var options = {
					size: 130,
					gradient: {
						0.25: "rgb(0,0,255)",
						0.55: "rgb(0,255,0)",
						0.85: "yellow",
						1.0: "rgb(255,0,0)"
					},
					max: 100,
					// range: [0, 100], // 过滤显示数据范围
					// minOpacity: 0.5, // 热力图透明度
					// maxOpacity: 1,
					draw: 'heatmap'
				}
				break;
			case 4:
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
				}
				break;
			case 5:
				var options = {
					draw: 'intensity',
					max: 100, // 最大阈值
					min: 0, // 最小阈值
					gradient: { // 显示的颜色渐变范围
						0: 'blue',
						0.5: 'yellow',
						1: 'red'
					},
					methods: {
						click: (item, event) => {
							if (item && item !== null) {
								this.clickmarker(item, event);
							}
						}
					}
				}
				break;
			default:
				break;
		}
		options = JSON.stringify(obj.options) == '{}' ? options : obj.options;
		var mapvLayer = new mapv.baiduMapLayer(obj.maps, new mapv.DataSet(data), options);

		return {
			paramMin,
			MorePol,
			paramMax
		}
	})
}
