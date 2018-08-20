import axios from 'axios'

const baseApi = axios.create({
  baseURL: '/api/v1',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default baseApi
