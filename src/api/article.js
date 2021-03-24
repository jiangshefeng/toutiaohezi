import request from '../util/request'
// 获取文章
export function getArticleInfo(params) {
  return request({
    url: '/mp/v1_0/articles',
    method: 'get',
    params
  })
}
// 获取文章频道
export function getArticleChannel() {
  return request({
    url: '/mp/v1_0/channels',
    method: 'get'
  })
}
// 删除文章
export function removeArticle(id) {
  return request({
    url: `/mp/v1_0/articles/${id}`,
    method: 'DELETE'
  })
}
// 发布文章
export function publishArticle(data, draft = false) {
  return request({
    url: '/mp/v1_0/articles',
    method: 'post',
    params: { draft: draft },
    data
  })
}
// 修改文章
export function editArticle(id, data, draft = false) {
  return request({
    url: `/mp/v1_0/articles/${id}`,
    method: 'put',
    params: { draft: draft },
    data
  })
}
// 获取指定文章
export function getArticleById(id) {
  return request({
    url: `/mp/v1_0/articles/${id}`,
    method: 'get'
  })
}
// 修改文章评论状态
export function updateCommentStatus(id, commentStatus) {
  return request({
    url: '/mp/v1_0/comments/status',
    method: 'put',
    params: {
      article_id: id
    },
    data: {
      allow_comment: commentStatus
    }
  })
}
