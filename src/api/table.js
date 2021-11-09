import axios from '@/utils/axios'

export function getList(params) {
  return axios({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export default {
  getList
}
