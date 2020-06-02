const getters = {
  activePoint: state => state.controlLeft.activePoint,
  pname:state => state.controlLeft.pname,
  // 右上选中id
  indexIds:state => state.controlLeft.indexIds,
  // 右上选中命名
  normName:state => state.controlLeft.normName,
  timeLine: state => state.controlLeft.timeLine,
  // 维度类型，网元，空间
  typeRadio: state => state.controlLeft.typeRadio,
  dimen: state => state.controlLeft.dimen,
  // 网元维度勾选label
  checkedData: state => state.controlLeft.checkedData,
  // 网元维度勾选id
  checkedDatas: state => state.controlLeft.checkedDatas,
  // 空间维度勾选
  spaceCheck: state => state.controlLeft.spaceCheck,
  spaceCheckId: state => state.controlLeft.spaceCheckId,
  spaceType: state => state.controlLeft.spaceType,
  // 网元类型2G,4G,5G
  networkType: state => state.controlLeft.networkType,
  //空间维度勾选id
  senceList: state => state.controlLeft.senceList,
  //判断框选状态刷新数据
  addstate:state => state.controlLeft.addstate,
  
  token: state => state.user.token,
  userName: state => state.user.userName,
  roles: state => state.user.roles,
  introduce: state => state.user.introduce,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  opened: state => {
    if (state.app.opened === 'false') {
      return false
    } else if (state.app.opened === 'true') {
      return true
    }
  },
  msgIsShow: state => state.app.msgIsShow,
  showDriver: state => state.app.showDriver,
  // 加减时间
  changeVal:state => state.controlModel.changeVal,
//时间维度
  timeTypeId: state => state.controlModel.timeTypeId,
  //时间
  time: state => state.controlModel.time,
  //城市
  cityId: state => state.controlModel.cityId,
  //单分屏
  screenType: state => state.controlModel.screenType,
  //地图中心
  mapCenter:state => state.controlModel.mapCenter,
  //设置弹窗状态
  setmodel:state => state.controlModel.setmodel,
  //四分屏选中指标
  QuotaList:state => state.controlModel.QuotaList,
  //四分屏选中指标名字
  QuotaListName:state => state.controlModel.QuotaListName,
  
  
  
  //二分屏指标
  SeQuota:state => state.controlModel.SeQuota,
  
  //分屏选中指标名字
  SequotaName:state => state.controlModel.SequotaName,


  //下拉选择城市
  selCity:state => state.controlModel.selCity,
  //指标弹窗状态
  mesFalse:state => state.controlModel.mesFalse,
  
  
  
  
  status: state => state.settingModel.status,
  opcity: state => state.settingModel.opcity,
}
export default getters
