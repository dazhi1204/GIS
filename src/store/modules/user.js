// import { getInfo } from '@/api/login'
import { Message } from 'element-ui'
import router, { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token') ? localStorage.getItem('token') : '', // 认证凭证'
  // token: 'admin-token', // 认证凭证'
  userName: '',
  roles: []
}
const mutations = {
  SET_TOKEN(state, val) {
    state.token = val
    localStorage.setItem('token', val)
  },
  DEL_TOKEN(state) {
    state.token = ''
    state.userName = ''
    state.roles = ''
    state.introduce = ''
    localStorage.removeItem('token')
  },
  SET_ROLES(state, payload) {
    state.roles = payload
  },
  SET_NAME(state, payload) {
    state.userName = payload
  },
  SET_INTRODUCE(state, payload) {
    state.introduce = payload
  }
}
const actions = {
  _login({ commit }) {
    let res = {
      code: 0,
      data: {
        success: true,
        msg: '登陆成功',
        token: 'admin-token',
        user: 'admin'
      }
    }
    Message.success(res.data.msg)
    commit('SET_TOKEN', res.data.token)
    return res
  },
  loginOut({ commit }) {
    commit('DEL_TOKEN')
    resetRouter()
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  },
  _getInfo({ commit }) {
    let res = {
      code: 0,
      data: {
        name: 'admin',
        roles: [
          'Home',
          'Dashbord',
          'Driver',
          'Driver-index',
          'Permission',
          'PageUser',
          'PageAdmin',
          'Roles',
          'Table',
          'BaseTable',
          'ComplexTable',
          'Icons',
          'Icons-index',
          'Components',
          'Sldie-yz',
          'Upload',
          'Carousel',
          'Echarts',
          'Sldie-chart',
          'Dynamic-chart',
          'Map-chart',
          'Excel',
          'Excel-out',
          'Excel-in',
          'Mutiheader-out',
          'Error',
          'Page404',
          'Github',
          'NavTest',
          'Nav1',
          'Nav2',
          'Nav2-1',
          'Nav2-2',
          'Nav2-2-1',
          'Nav2-2-2',
          '*404'
        ],
        introduce:
          '持众身界长史精把战条并行思心且准日须决线级音这离统本国同方要表将活层温听其转系系选就布家种种构质。'
      },
      _res: { status: 200 }
    }
    const { name, roles, introduce } = res.data
    commit('SET_ROLES', roles)
    commit('SET_NAME', name)
    commit('SET_INTRODUCE', introduce)
    return res
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
