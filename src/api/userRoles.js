import request from '@/utils/request'
import requestMethod from '@/utils/requestMethod.js'
// 获取权限列表
export function loadAuthRoleLists(params) {
  const data = requestMethod({
    ...params
  })
  return request({
    url: 'auth/authRole/loadAuthRoleList',
    method: 'post',
    data
  })
}

// 查询某些App
export function SearchAuthApps(params) {
  const data = requestMethod({
    ...params
  })
  return request({
    url: 'auth/authApp/loadAuthAppList',
    method: 'post',
    data
  })
}

// 获取所有APP权限
export function loadAuthAppLists(params) {
  const data = requestMethod({
    params
  })
  return request({
    url: 'auth/authApp/loadAuthAppList',
    method: 'POST',
    data
  })
}
// 修改权限信息
export function updateRoles(params) {
  const data = requestMethod({
    ...params
  })
  return request({
    url: 'auth/authRole/updateRole',
    method: 'POST',
    data
  })
}

// 删除权限信息
export function deletAuthRoles(params) {
  const data = requestMethod({
    ...params
  })
  return request({
    url: 'auth/authRole/deletAuthRole',
    method: 'POST',
    data
  })
}

// 添加权限
export function addRoles(params) {
  const data = requestMethod({
    ...params
  })
  return request({
    url: 'auth/authRole/addRole',
    method: 'POST',
    data
  })
}

