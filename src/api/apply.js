import baseApi from './base'

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/businessapplys'
  })

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/businessapplys/${id}`
  })

const createOne = apply =>
  baseApi.request({
    method: 'post',
    url: '/businessapplys',
    data: apply
  })

const modifyOne = apply =>
  baseApi.request({
    method: 'patch',
    url: `/businessapplys/${apply.id}`,
    data: apply
  })

export {
  fetchAll,
  deleteOne,
  createOne,
  modifyOne
}
