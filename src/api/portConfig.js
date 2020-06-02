import $axios from './index'

export default class portConfig {
  // 获取链接列表
  static getLayerApiList () {
    const url = '/gis-web/layerapi/getLayerApiList'
    return $axios.post(url)
  }

  // 查询单个链接
  static selLayerApi (data) {
    const url = '/gis-web/layerapi/selLayerApi'
    return $axios.post(url, data)
  }

  // 登录接口
  static login(data) {
    const url = '/gis-web/login/login'
    return $axios.post(url, data)
  }

  // 修改链接
  static editLayerApi(data) {
    const url = '/gis-web/layerapi/editLayerApi'
    return $axios.post(url, data)
  }

  // 新增链接api
  static addLayerApi(data) {
    const url = '/gis-web/layerapi/addLayerApi'
    return $axios.post(url, data)
  }

  // 删除链接
  static delLayerApi(data) {
    const url = '	/gis-web/layerapi/delLayerApi'
    return $axios.post(url, data)
  }
}
