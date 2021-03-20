import request from '../util/request'

// 上传图片
export function uploadImg(data) {
  return request({
    url: '/mp/v1_0/user/images',
    method: 'post',
    data
  })
}

// 获取图片素材
export function getImg(params = {}) {
  return request({
    url: '/mp/v1_0/user/images',
    params
  })
}

// 删除图片素材
export function deleteImg(id) {
  return request({
    url: `/mp/v1_0/user/images/${id}`,
    method: 'delete'
  })
}

// 收藏图片
export function collectImage(id, collect) {
  return request({
    url: `/mp/v1_0/user/images/${id}`,
    method: 'PUT',
    data: {
      collect
    }
  })
}
