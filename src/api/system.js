import baseApi from './base'

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/systemservers'
  })

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/systemservers/${data.id}`,
    data
  })

// 批量修改
const modifySome = data =>
  baseApi.request({
    method: 'patch',
    url: `/systemservers`,
    data
  })

// 批量删除
const deleteSome = data =>
  baseApi.request({
    method: 'delete',
    url: `/systemservers`,
    data
  })
export {
  fetchAll,
  modifyOne,
  modifySome,
  deleteSome
}
