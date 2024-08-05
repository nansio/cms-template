export default {
  numbersOnly: /^[0-9]+$/,
  mobilePhone: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
  url: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9#:-~\/])+$/,
  longitude: /^[\-\+]?(0?\d{1,2}(\.\d{1,5})*|1[0-7]?\d{1}(\.\d{1,6})*|180(\.0{1,6})*)$/,
  latitude: /^[\-\+]?([0-8]?\d{1}(\.\d{1,6})*|90(\.0{1,6})*)$/,
  noHanzi: /^[^\u4e00-\u9fa5]*$/,
  idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  noSpecialCharacters: /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]*$/,
  strongestPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()+`\-={}:";'<>,.\/]).{8,16}$/,
  strongPassword: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>,.\/]).{8,16}$/,
  zhAndEn: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
  httpUrl: /^https:\/\/[^\s/$.?#].[^\s]*$/
}

export const isInclude_ = (rule, value, callback) => {
  if (value.indexOf('_') > -1) {
    callback(new Error("禁止输入'_'符号"))
  } else {
    callback()
  }
}
export const validatePass2 = (rule, value, callback, password) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
