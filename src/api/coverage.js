import $axios from './index'


//弹窗打开默认查询图层列表
export function getLayerAll(data) {
  const url = '/gis-web/gislayer/getLayerAll'
  return $axios.post(url, data)
}

//新建图层
export function insLayer(data) {
  const url = '/gis-web/gislayer/insLayer'
  return $axios.post(url, data)
}

//删除图层
export function delLayer(data) {
  const url = '/gis-web/gislayer/delLayer'
  return $axios.post(url, data)
}

//查询图层数据
export function selLayerData(data) {
  const url = '/gis-web/gislayer/selLayerData'
  return $axios.post(url, data)
}

//图层网络制式列表
export function selSectorNetwork(data) {
  const url = '/gis-web/gislayer/selSectorNetwork'
  return $axios.post(url, data)
}

//频点频段列表
export function selSectorDraw(data) {
  const url = '/gis-web/gislayer/selSectorBands'
  return $axios.post(url, data)
}

//查询图层api列表接口
export function selLayerApiList(data) {
  const url = '/gis-web/gislayer/selLayerApiList'
  return $axios.post(url, data)
}
//恢复默认
export function selLayeDefult(data) {
  const url = '/gis-web/gislayer/selLayerDefult'
  return $axios.post(url, data)
}

//修改图层数据
export function editLayerData(data) {
  const url = '/gis-web/gislayer/editLayerData'
  return $axios.post(url, data)
}
//飞线图层类型
export function getFillineType(data) {
  const url = '/gis-web/gislayer/getFillineType'
  return $axios.post(url, data)
}

//修改图层名称
export function editLayerName(data) {
  const url = '/gis-web/gislayer/editLayerName'
  return $axios.post(url, data)
}

//控制显示图层
export function setLayerShow(data) {
  const url = '/gis-web/gislayer/setLayerShow'
  return $axios.post(url, data)
}