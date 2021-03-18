import request from '../util/request'
export function getArticleInfo (params) {
  return request({
    url: '/mp/v1_0/articles',
    method: 'get',
    params
  })
}
export function getArticleChannel () {
  return request({
    url: '/mp/v1_0/channels',
    method: 'get'
  })
}
export function removeArticle (id) {
  return request({
    url: `/mp/v1_0/articles/${id}`,
    method: 'DELETE'
  })
}
