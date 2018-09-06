import baseApi from './base'

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/storages'
  })

export {
  fetchAll
}
