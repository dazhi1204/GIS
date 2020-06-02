export default {
  namespaced: true,
  state: {
    networkType: '12',//4G
    spaceType: '21',
    // 网元维度选中
    checkedData: [],//eciname
    checkedDatas: [],//eciId
    // 空间维度选中
    spaceCheck: [],
    spaceCheckId: [],
    dimen: 'network',
    typeRadio: 1,
    timeLine: null,
    // 右上参数详细，可以合并为一个对象
    pname: '',
    normName:'b_e_u0101',
    indexIds: '3',
    //保存空间维度数据查询参数
    senceList:[],
    //框选保存
    addstate:[],
    // 指标分析当前选中点的选中小区
    activePoint: null
  },
  mutations: {
    SET_ACTIVEPOINT(state, val) {
      state.activePoint = val
    },
    SET_PNAME(state, val) {
      state.pname = val
    },
    SET_NETTYPE(state, val) {
      state.networkType = val
    },
    SET_SPACETYPE(state, val) {
      state.spaceType = val
    },
    SET_CHECKDATA(state, val) {
      state.checkedData = val
    },
    SET_CHECKDATAS(state, val) {
      state.checkedDatas = val
    },
    SET_SPACECHECK(state, val) {
      state.spaceCheck = val
    },
    SET_SPACECHECKID(state, val) {
      state.spaceCheckId = val
    },
    SET_DIMEN(state, val) {
      state.dimen = val
    },
    SET_TYPERADIO(state, val) {
      state.typeRadio = val
    },
    SET_TIMELINE(state, val) {
      state.timeLine = val
    },
    SET_NORMNAME(state, val) {
      state.normName = val
    },
    SET_INDEXIDS(state, val) {
      state.indexIds = val
    },
    SET_SENCELIST(state, val) {
      state.senceList = val
    },
    SET_ADDSTATE(state, val) {
      state.addstate = val
    }
  }
}
