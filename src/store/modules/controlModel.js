export default {
  namespaced: true,
  state: {
    timeTypeId:4,
    time:'2020-02-02 12:00:00',
    cityId: 110100,
    screenType:1,
    mapCenter:'北京',
    setmodel:false,
    QuotaList:[],//四分屏选中指标
	QuotaListName:[],//四分屏选中指标名字
    SeQuota:[3],//二分屏选中指标
	SequotaName:[],//二分屏选中指标名字
    changeVal: null,
	selCity:'北京',//下拉选择城市
	mesFalse:false
  },
  mutations: {
    SET_CHANGEVAL(state, val) {
      state.changeVal = val
    },
    SET_TIMETYPE(state, val) {
      state.timeTypeId = val
    },
    SET_TIME(state, val) {
      state.time = val
    },
    SET_CITYID(state, val) {
      state.cityId = val
    },
    SET_SCREENTYPE(state, val) {
      state.screenType = val
    },
    SET_MAPCENTER(state, val) {
      state.mapCenter = val
    },
    SET_SETMODEL(state, val) {
      state.setmodel = val
    },
    SET_QUOTALIST(state, val) {
      state.QuotaList = val
    },
	SET_QUOTALISTNAME(state, val) {
	  state.QuotaListName = val
	},
    SET_SEQUOTA(state, val) {
      state.SeQuota = val
    },
	SET_SEQUOTANAME(state, val) {
	  state.SequotaName = val
	},
	SET_SELCITY(state,val){
		state.selCity = val
	},
	SET_MESFAKSE(state,val){
		state.mesFalse = val
	}
  }
}
