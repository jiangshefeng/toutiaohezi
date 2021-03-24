import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [
    function(data) {
      try {
        return JSONbig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})
request.interceptors.request.use(config => {
  const { token } = JSON.parse(sessionStorage.getItem('user')) || ''
  config.headers.Authorization = 'Bearer ' + token
  return config
})
request.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response
  },
  function(error) {
    if (error.response.status === 401 && error.response) {
      router.push('/login')
      sessionStorage.removeItem('user')
    }

    return Promise.reject(error)
  }
)
export default request
