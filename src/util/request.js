import axios from 'axios'
import JSONbig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [
    function (data) {
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
export default request
