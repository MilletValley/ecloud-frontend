import baseApi from './base'

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/securitygroups'
  })

export {
  fetchAll
}
