import request from '../util/request'

// 获取粉丝列表
export function getFansList(quary) {
  return request({
    url: '/mp/v1_0/followers',
    method: 'GET',
    params: quary
  })
}
