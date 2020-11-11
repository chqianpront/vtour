import request from '@/utils/request'
import qs from 'querystring'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

export function userList (params) {
  return request({
    url: '/wandering/user/v1/getMiniUsers',
    method: 'get',
    params: params
  })
}

export function tripList (params) {
  return request({
    url: '/wandering/trip/v1/pageTrips',
    method: 'get',
    params: params
  })
}

export function userDetail (params) {
  return request({
    url: '/wandering/user/v1/getMiniUserDetail',
    method: 'get',
    params: params
  })
}

export function operateUser (params) {
  return request({
    url: '/wandering/user/v1/operateMiniUser',
    method: 'delete',
    params: params
  })
}

export function operateTrip (params) {
  return request({
    useJson: true,
    url: '/wandering/trip/v1/operateTrip',
    method: 'post',
    data: params
  })
}

export function deleteTrips (params) {
  return request({
    url: '/wandering/trip/v1/deleteTrips',
    method: 'delete',
    params: params
  })
}

export function tripDetail (id) {
  return request({
    url: `/wandering/trip/v1/trips/${id}`,
    method: 'get'
  })
}

export function commentList (params) {
  return request({
    url: `/wandering/comment/v1/pageComments`,
    method: 'get',
    params: params
  })
}

export function deleteComment (id, param) {
  return request({
    url: `/wandering/comment/v1/commentInfo/${id}`,
    method: 'delete',
    params: param
  })
}

export function deleteTravel (id, param) {
  return request({
    url: `/wandering/travel/v1/travelNotes/${id}`,
    method: 'delete',
    params: param
  })
}

export function listTravel (params) {
  return request({
    url: `/wandering/travel/v1/pageTravels`,
    method: 'get',
    params: params
  })
}

export function listTheme (params) {
  return request({
    url: `/wandering/travel/v1/pageThemes`,
    method: 'get',
    params: params
  })
}

export function coreIndicators () {
  return request({
    url: `/wandering/home/v1/coreIndicators`,
    method: 'get'
  })
}

export function coreIndicatorsChart (params) {
  return request({
    url: `/wandering/home/v1/coreIndicatorsChart`,
    method: 'get',
    params: params
  })
}

export function listShieldWords (params) {
  return request({
    url: `/wandering/shield/v1/pageShieldWords`,
    method: 'get',
    params: params
  })
}

export function listAllShieldWords () {
  return request({
    url: `/wandering/shield/v1/allShieldWords`,
    method: 'get'
  })
}

export function deleteShieldWords (param) {
  return request({
    url: `/wandering/shield/v1/relShieldWords`,
    method: 'delete',
    params: param
  })
}

export function addShieldWords (params) {
  return request({
    url: `/wandering/shield/v1/addShieldWords`,
    method: 'post',
    data: qs.stringify(params)
  })
}

export function updateShieldWords (params) {
  return request({
    url: `/wandering/shield/v1/modifyShieldWords`,
    method: 'post',
    data: qs.stringify(params)
  })
}
export function listDustComments (params) {
  return request({
    url: `/wandering/dustbin/v1/pageDustbinComments`,
    method: 'get',
    params: params
  })
}
export function listDustTravels (params) {
  return request({
    url: `/wandering/dustbin/v1/pageDustbinTravels`,
    method: 'get',
    params: params
  })
}
export function listDustTrips (params) {
  return request({
    url: `/wandering/dustbin/v1/pageDustbinTrips`,
    method: 'get',
    params: params
  })
}

export function getExamineStatus (params) {
  return request({
    url: `/wandering/examine/v1/getExamineStatus`,
    method: 'get',
    params: params
  })
}

export function listExamineComments (params) {
  return request({
    url: `/wandering/examine/v1/pageExamineComments`,
    method: 'get',
    params: params
  })
}

export function listExamineTravels (params) {
  return request({
    url: `/wandering/examine/v1/pageExamineTravels`,
    method: 'get',
    params: params
  })
}

export function listExamineTrips (params) {
  return request({
    url: `/wandering/examine/v1/pageExamineTrips`,
    method: 'get',
    params: params
  })
}

export function updateExamineStatus (params) {
  return request({
    url: `/wandering/examine/v1/updateExamineStatus`,
    method: 'post',
    data: qs.stringify(params)
  })
}

export function examineChange (params) {
  return request({
    useJson: true,
    url: `/wandering/examine/v1/examineChange`,
    method: 'post',
    data: params
  })
}
