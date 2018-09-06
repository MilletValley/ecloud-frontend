import baseApi from './base'

const fetchServer = () =>
  baseApi.request({
    method: 'get',
    url: '/home/servertotal'
  })

const fetchHardware = () =>
  baseApi.request({
    method: 'get',
    url: '/home/hardwaretotal'
  })

const fetchApplication = () =>
  baseApi.request({
    method: 'get',
    url: '/home/applicationtotal'
  })

export {
  fetchServer,
  fetchHardware,
  fetchApplication
}
