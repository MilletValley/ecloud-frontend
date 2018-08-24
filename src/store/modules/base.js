import types from '../type'
import { login, logout, validateToken } from '../../api/user'
import { userToken } from '../../utils/storage'
import isEmpty from 'lodash/isEmpty'

const state = {
  token: '',
  userInfo: {}
}

const mutations = {
  [types.SET_TOKEN] (state, { token }) {
    state.token = token
  },
  [types.CLEAR_TOKEN] (state) {
    state.token = ''
  },
  [types.SET_USERINFO] (state, payload) {
    state.userInfo = payload
  },
  [types.CLEAR_LOGININFO] (state) {
    state.token = ''
    state.userInfo = {}
  }
}

const actions = {
  // 登录获得Token
  loginForToken ({ commit }, loginData) {
    return login(loginData)
      .then(res => {
        const { data } = res.data
        userToken.save(data.token, loginData.rememberMe ? 7 : undefined)
        commit(types.SET_TOKEN, data)
        return res.data
      })
      .catch(error => Promise.reject(error))
  },
  // 根据token获取用户信息
  getUserInfo ({ commit }, { token }) {
    return validateToken(token).then(res => {
      const { data: user, message } = res.data
      if (isEmpty(user)) {
        return Promise.reject(message)
      }
      commit(types.SET_USERINFO, user)
      return user
    })
  },
  // 全套登录流程
  loginForAll ({ dispatch }, loginData) {
    return dispatch('loginForToken', loginData).then(({ data }) =>
      dispatch('getUserInfo', { token: data.token })
    )
  },
  // 登出
  logout ({ commit }, token) {
    return logout({ token }).then(res => {
      const { message } = res.data
      commit(types.CLEAR_LOGININFO)
      userToken.remove()
      return message
    })
  }
}

export default {
  state,
  mutations,
  actions
}
