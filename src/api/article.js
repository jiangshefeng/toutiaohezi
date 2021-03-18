import request from '../util/request'
export function getArticleInfo(params) {
  return request({
    url: '/mp/v1_0/articles',
    method: 'get',
    params
  })
}
