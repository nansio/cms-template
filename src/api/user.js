import axios from '@/utils/axios'

export function login(data) {
  return axios({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return axios({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return axios({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export default {
  login,
  getInfo,
  logout
}
