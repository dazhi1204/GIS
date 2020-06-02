// @author wupeng
// @date   19.12.17
// @description 首页图标相关api
import $axios from './index'

export default class echartApi {
  // 登录接口
  static login (data) {
    const url = '/gis-web/login/login'
    return $axios.post(url, data)
  }
  // 网元维度查询
  static selEarfcnList (data) {
    const url = '/gis-web/layerbus/selEarfcnList'
    return $axios.post(url, data)
  }

  // 空间维度查询
  static selSceneList (data) {
    const url = '/gis-web/layerbus/selSceneList'
    return $axios.post(url,data)
  }

  // 指标统计分析
  static selIndexAnalyse (data) {
    const url = '/gis-web/layerbus/selIndexAnalyseNew'
    return $axios.post(url, data)
  }

  // 分频点指标分析
  static selIndexAnalyse2 (data) {
    const url = '/gis-web/layerbus/selIndexAnalyse2New'
    return $axios.post(url, data)
  }

  // 分场景指标分析
  static getSceneAnalyse (data) {
    const url = '/gis-web/layerAnalyse/getSceneAnalyseNew'
    return $axios.post(url, data)
  }
  // 分场景指标分析  多场景
  static getSceneAnalyse2 (data) {
    const url = '/gis-web/layerAnalyse/getSceneAnalyse2New'
    return $axios.post(url, data)
  }

  // 频点--散点图查询小区列表的接口
  static getIndexAnalyCellList (data) {
    const url = '/gis-web/layerbus/getIndexAnalyCellList'
    return $axios.post(url, data)
  }

  // 场景--散点图查询小区列表的接口
  static getSceneAnalyCellList (data) {
    const url = '/gis-web/layerAnalyse/getSceneAnalyCellList'
    return $axios.post(url, data)
  }

  // 下载分场景工参获得下载列表
  static downExcelGetList (data) {
    const url = '/gis-web/layerbus/downExcelGetList'
    return $axios.post(url, data)
  }
  // 下载分场景工参
  static downExcel (data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerbus/downExcel',
      data,
      binary: true
    })
  }
  // 下载工参模板
  static creatExcel (data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerbus/creatExcel',
      data,
      binary: true
    })
  }
  // 删除工参模板
  static delExcel (data) {
    const url = '/gis-web/layerbus/delExcel'
    return $axios.post(url, data)
  }

  // 上传分场景工参
  static insExcel (data) {
    console.log(data)
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerbus/insExcel',
      data
    })
  }

  // 业务维度查询头
  static getIndexListFirst (data) {
    const url = '/gis-web/layerindex/getIndexListFirst'
    return $axios.post(url, data)
  }

  // 业务维度查询
  static selIndexList (data) {
    const url = '/gis-web/layerindex/selIndexList'
    return $axios.post(url, data)
  }
  // 业务维度总表展示
  static selIndexList1 (data) {
    const url = '/gis-web/layerindex/selAllIndexList1'
    return $axios.post(url, data)
  }
   // 配置门限值
   static updateIndex(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: 'gis-web/updateThreshold/updateIndex',
      data
    })
  }
  // 总表下载
  static downAllIndexList (data) {
    // const url = '/gis-web/layerindex/downAllIndexList'
    // return $axios.post(url, data)
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerindex/downAllIndexList',
      data,
      binary: true
    })
  }
  // 业务维度获得调整指标  获得指标列表
  static getConfigurationIndicators(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerindex/getConfigurationIndicators',
      data
    })
  }
  // 业务维度获得调整指标 调整指标列表
  static editConfigurationIndicators(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerindex/editConfigurationIndicators',
      data
    })
  }
  // 业务维度获得调整指标 恢复默认指标列表
  static getDefaultConfigurationIndicators(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerindex/getDefaultConfigurationIndicators',
      data
    })
  }

  // 分频点天级趋势图
  static getEarfcnDayTrend(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerAnalyse/getEarfcnDayTrend',
      data
    })
  }

  // 分场景天级趋势图
  static getSceneDayTrend(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerAnalyse/getSceneDayTrend',
      data
    })
  }
  
  //重新计算指标
  static setEarfcnSceneIndexTrendsCount(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/taskController/setEarfcnSceneIndexTrendsCount',
      data
    })
  }

  // 时间趋势图
  static get15minTrend(data) {
    return $axios.sendRequest({
      method: 'POST',
      url: '/gis-web/layerAnalyse/get15minTrend',
      data
    })
  }

}