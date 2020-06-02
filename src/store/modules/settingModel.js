export default {
  namespaced: true,
  state: {
    status:false,
    opcity:100
  },
  mutations: {
    SET_STATUS(state, val) {
      state.status = val
    },
    SET_OPCITY(state, val) {
      state.opcity = val
    }
  }
}
