import $axios from './index'

export function getMainInfo(data) {
	const url = '/getMainInfo.action'
	return $axios.post(url, data)
}
export function getAlarmInfo(data) {
	const url = '/getAlarmInfo.action'
	return $axios.post(url, data)
}
export function getCellInfo(data) {
	const url = '/getCellInfo.action'
	return $axios.post(url, data)
}
export function getSleepInfo(data) {
	const url = '/getSleepInfo.action'
	return $axios.post(url, data)
}
export function getSaveelectric(data) {
	const url = '/getSaveelectric.action'
	return $axios.post(url, data)
}
export function getOperateprogress(data) {
	const url = '/getOperateprogress.action'
	return $axios.post(url, data)
}

//地理纬度
export function selProAndCityList(data) {
	const url = '/gis-web/layerbus/selProAndCityList'
	return $axios.post(url, data)
}

//图层数据
export function sectorQuery(data) {
	//const url = '/gis-web/sector/sectorQueryNew'
	const url = 'gis-web/sector/sectorQuery'
	return $axios.post(url, data)
}
//栅格图层数据
export function layerQuery(data) {
	//const url = '/gis-web/sector/sectorQueryNew'
	const url = 'gis-web/rasterLayer/layerQuery'
	return $axios.post(url, data)
}

//栅格指标
export function rasterLayerIndexQuery(data) {
	const url = 'gis-web/rasterLayer/rasterLayerIndexQuery'
	return $axios.post(url, data)
}
//显示图层
export function ShowLayerData(data) {
	const url = '/gis-web/gislayer/selectShowLayerData'
	return $axios.get(url)
}
//框选
export function sectorQueryByRange(data) {
	const url = '/gis-web/scene/ECIQueryByCustomScene'
	return $axios.post(url, data)
}
//保存框选场景
export function creatScene(data) {
	const url = '/gis-web/scene/createCustomScene'
	return $axios.post(url, data)
}
//多屏频点场景指标查询接口
export function earfcnSceneIndexQuery(data) {
	const url = '/gis-web/multiScreen/earfcnSceneIndexQuery'
	return $axios.post(url, data)
}
//分屏其他图层数据
export function mulsectorQuery(data) {
	const url = '/gis-web/multiScreen/sectorQuery'
	return $axios.post(url, data)
}

//分屏栅格图层数据
export function multiScreenLayerQuery(data) {
	const url = '/gis-web/rasterLayer/multiScreenLayerQuery'
	return $axios.post(url, data)
}
//分屏飞线图层数据
export function multiFlylineQuery(data) {
	const url = '/gis-web/flyline/multiFlylineQuery'
	return $axios.post(url, data)
}
//问题小区滚动列表
export function getProCellName(data) {
	const url = '/gis-web/layerindex/getProCellName'
	return $axios.post(url, data)
}
//问题小区列表
export function getProblemCellList(data) {
	const url = '/gis-web/layerindex/getProblemCellList'
	return $axios.post(url, data)
}

//小区搜索
export function selCellListByName(data) {
	const url = '/gis-web/layerindex/selCellListByName'
	return $axios.post(url, data)
}