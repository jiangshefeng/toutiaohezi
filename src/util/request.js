import axios from 'axios'
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net'
})
request.interceptors.request.use(config => {
  const { token } = JSON.parse(sessionStorage.getItem('user')) || ''
  config.headers.Authorization = 'Bearer ' + token
  return config
})
export default request
