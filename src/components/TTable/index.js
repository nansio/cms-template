import MyTable from './TTable.vue'
const Table = {
  install: function(Vue) {
    Vue.component('Table', MyTable)
  }
}
// 导出组件
export default Table
