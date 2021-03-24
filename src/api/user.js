import request from '../util/request'
// 用户登录api

export async function login() {
  try {
    this.loginLoading = true
    const res = await request({
      method: 'POST',
      url: '/mp/v1_0/authorizations',
      data: this.user
    })
    this.$message({
      type: 'success',
      message: '登录成功！'
    })

    const result = res.data.data
    const user = JSON.stringify(result)
    sessionStorage.setItem('user', user)
    this.$router.push({
      name: 'home'
    })
  } catch (e) {
    this.$message({
      type: 'error',
      message: '登录失败，手机号或验证码错误'
    })
  } finally {
    this.loginLoading = false
  }
}
export async function getUserInfo() {
  const res = await request({
    url: '/mp/v1_0/user/profile',
    method: 'get'
  })
  const userInfo = JSON.stringify(res.data.data)
  sessionStorage.setItem('userInfo', userInfo)
}
// 修改用户头像
export function updateUserPhoto(file) {
  return request({
    url: '/mp/v1_0/user/photo',
    method: 'PATCH',
    data: file
  })
}
// 修改用户信息
export function updateUserInfo(data) {
  return request({
    url: '/mp/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
