import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router/index'
// import { Promise } from 'core-js'
import types from '../store/type'
import store from '../store/index'

const baseApi = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

baseApi.interceptors.response.use(undefined, error => {
  if (error.messge.indexOf('timeout') >= 0) {
    // eslint-disable-next-line
    return Promise.reject('请求超时，请检查网络连接')
  }
  const { data, status } = error.response
  if (status === 401) {
    // token失效/过期 需要重新登录
    const { message } = data
    Message.warning({
      message
    })
    store.commit(types.CLEAR_LOGININFO)
    router.push('/login')
    // eslint-disable-next-line
    return Promise.reject()
  } else if (status === 403) {
    // 权限不足
    const { message } = data
    Message.warning({
      message
    })
    // eslint-disable-next-line
    return Promise.reject()
  }
  const errorMsg = `${error.response.data.message}(${
    error.response.data.code
  })`
  return Promise.reject(errorMsg)
})
export default baseApi
