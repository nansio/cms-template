<template>
  <div class="t-table">
    <div v-if="isShow('toolbar')" class="tableTop">
      <el-row :gutter="20">
        <el-col :span="12">
          <div style="min-height: 40px">
            <slot name="toolbar" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="f-r">
            <el-button v-for="(item, index) in getToolbarBtn" :key="index" class="r_btn" size="medium" :type="item.type||'primary'" @click="item.fun(item)">
              {{ item.text }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table ref="el-table" v-loading="table.loading" :cell-style="cellStyle" :header-cell-style="headStyle" tooltip-effect="dark" :data="table.data"
              :height="height? fixHeight? fixHeight: undefined:undefined" v-bind="$attrs" border v-on="$listeners" @row-click="rowClick" @cell-dblclick="cellDblclick"
              @selection-change="handleSelectionChange">
      <!-- 序列号/复选框 -->
      <div v-if="table.firstColumn">
        <el-table-column v-if="table.firstColumn.type!=='index'" :type="table.firstColumn.type" width="50" :label="table.firstColumn.label" align="center" />
        <el-table-column v-if="table.firstColumn.type==='index'" :type="table.firstColumn.type" width="50" :reserve-selection="table.firstColumn.isPaging||false" :label="table.firstColumn.label"
                         align="center">
          <template slot-scope="scope">
            <span>{{ isShowPagination?((table.currentPage - 1) * table.pageSize + scope.$index + 1):scope.$index + 1 }}</span>
          </template>
        </el-table-column>
      </div>
      <slot name="begin" />

      <el-table-column v-for="(item, index) in columnList" :key="index" :type="item.type" :label="item.label" :prop="item.prop" :min-width="item['min-width'] || item.minWidth || item.width"
                       :sortable="item.sort" :align="item.align || 'center'" :show-overflow-tooltip="item.noShowTip" v-bind="$attrs" v-on="$listeners">
        <template slot-scope="scope">
          <template v-if="item.slotName">
            <slot :name="item.slotName" :param="scope" />
          </template>
          <div v-if="!item.filters&&!item.slotName" :style="{color:txtChangeColor(scope)}">{{ scope.row[item.prop] }}</div>
          <div v-if="item.filters" :style="{color:txtChangeColor(scope)}">
            <span v-if="item.filters.param">{{ scope.row[item.prop] |constantKey2Value(item.filters.param) }}</span>
            <span v-if="!item.filters.param&&item.filters.method==='￥'">{{ scope.row[item.prop] |currencyFilter }}</span>
            <span v-if="!item.filters.param&&item.filters.method==='%'">{{ scope.row[item.prop] |percentFilter }}</span>
            <span v-if="!item.filters.param&&item.filters.method==='dateFormatFilter'">{{ scope.row[item.prop] |dateFormatFilter }}</span>
            <span v-if="!item.filters.param&&item.filters.method==='timeFormatFilter'">{{ scope.row[item.prop] |timeFormatFilter }}</span>
          </div>
        </template>
      </el-table-column>
      <slot />

      <el-table-column v-if="table.operator" :fixed="table.operatorConfig && table.operatorConfig.fixed" :label="(table.operatorConfig && table.operatorConfig.label) || '操作'"
                       :min-width="(table.operatorConfig && table.operatorConfig.width || table.operatorConfig.minWidth) || 100" align="center">
        <template slot-scope="scope">
          <el-image v-if="table.operatorImage" :id="scope.row.id" :src="scope.row.src" :style="table.operatorImage.style ? table.operatorImage.style : ''" :preview-src-list="scope.row.srcList" fit="fill" />
          <el-button v-for="(item, index) in table.operator" v-show="checkIsShow(scope,item)" :key="index" :type="item.type"
                     :icon="item.icon ? item.icon : ''" :style="item.style ? item.style : ''" @click="item.fun(scope.row)"
          >{{ item.text }}
          </el-button>
        </template>
      </el-table-column>
      <slot name="end" />
    </el-table>
    <el-pagination v-show="table.data && table.data.length && isShowPagination" :current-page="table.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="table.pageSize"
                   :layout="size?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'" :total="table.total" v-bind="$attrs" background @current-change="handleCurrentChange"
                   @size-change="handleSizeChange" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  name: 'TTable',
  components: {},
  props: {
    // table所需数据
    table: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    },
    // 是否复制单元格
    isCopy: {
      type: Boolean,
      default: false
    },
    // 是否固定高度
    height: {
      type: Boolean,
      default: true
    },
    // 是否需要固定表头
    fixHeight: {
      type: String || Number,
      default: ''
    },
    // 是否需要显示切换页条数
    size: {
      type: Boolean,
      default: false
    },
    // 是否显示分页
    isShowPagination: {
      type: Boolean,
      default: true
    },
    // 唯一ID
    idKey: {
      type: String || Number,
      default: ''
    }
  },
  data() {
    return {
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      otherHeight: 0,
      rowData: ''
    }
  },
  computed: {
    tableData() {
      return this.table.firstColumn.isPaging ? this.table.data : []
    },
    columnList() {
      return this.table.column.filter(item => {
        return !item.noShowColumn
      })
    },
    getToolbarBtn() {
      return this.table.toolbar ? this.table.toolbar.slice(0, 3) : []
    },
    getToolbarDown() {
      return this.getToolbarBtn.length === 3 ? this.table.toolbar.slice(3, this.table.toolbar.length) : []
    }
  },
  watch: {
    tableData() {
      setTimeout(() => {
        this.setSelectRow()
      }, 200)
    }
  },
  mounted() {
    const toolBarHeight = this.isShow('toolbar') ? 60 : 0
    const pageHeight = 60
    this.$nextTick(() => {
      this.otherHeight = toolBarHeight + pageHeight
    })
  },
  methods: {
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return
      }
      // 标识当前行的唯一键的名称
      const idKey = this.idKey
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs['el-table'].clearSelection()
      for (var i = 0; i < this.table.data.length; i++) {
        if (selectAllIds.indexOf(this.table.data[i][idKey]) >= 0) {
          // 设置选中
          this.$refs['el-table'].toggleRowSelection(this.table.data[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      const idKey = this.idKey
      const that = this
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      // 总选择里面的key集合
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      const selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row)
        }
      })
      const noSelectIds = []
      // 得到当前页没有选中的id
      this.table.data.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    // 当前页选择的数据
    handleSelectionChange(val) {
      // table组件选中事件
      this.multipleSelection = val
    },
    // 双击复制单元格内容
    cellDblclick(row, column) {
      if (!this.isCopy) {
        return false
      }
      this.$copyText(row[column.property]).then(() => {
        this.$message.success('已复制')
      }, () => {
        this.$message.error('复制失败')
      })
    },
    // 是否显示表格操作按钮
    checkIsShow(scope, item) {
      let isNoShow = false
      if (item.noshow) {
        item.noshow.map(rs => {
          rs.isShow = typeof rs.val === 'string'
            ? (rs.val === 'isHadVal' ? (scope.row[rs.key] ? 'true' : 'false') : 'true')
            : (rs.val.includes(scope.row[rs.key]) ? 'false' : 'true')
        })
        isNoShow = item.noshow.every(key => {
          return key.isShow === 'true'
        })
      } else {
        isNoShow = true
      }
      return (!item.show || item.show.val.includes(scope.row[item.show.key])) && isNoShow
    },
    // 控制表格字体颜色
    txtChangeColor(scope) {
      if (this.table.changeColor && scope.row[this.table.changeColor.key] === this.table.changeColor.val) {
        return this.table.changeColor.txtStyle
      } else {
        return ''
      }
    },
    // 当前页码
    handleCurrentChange(val) {
      if (this.table.firstColumn.isPaging) {
        this.changePageCoreRecordData()
      }
      this.$emit('page-change', val)
    },
    // 当前条数
    handleSizeChange(val) {
      if (this.table.firstColumn.isPaging) {
        this.changePageCoreRecordData()
      }
      this.$emit('size-change-handle', val)
    },
    rowClick(row) {
      this.rowData = row
      row.selectFlag = !row.selectFlag
      if (row.selectFlag) {
        this.$refs['el-table'].setCurrentRow(row)
      } else {
        this.$refs['el-table'].setCurrentRow()
      }
    },
    // 表格头部按钮
    toolbarFun(item) {
      if (!this.rowData) {
        this.$message({
          type: 'warning',
          message: '请选中行'
        })
        return
      }
      if (!this.rowData.selectFlag) {
        this.$message({
          type: 'warning',
          message: '请选中行'
        })
        return
      }
      item.fun(this.rowData)
    },
    isShow(name) {
      return Object.keys(this.$slots).includes(name)
    },
    // 内容行高与字体
    cellStyle() {
      return {
        'font-size': '16px',
        color: '#666666'
      }
    },
    // 表头样式
    headStyle() {
      return {
        background: '#FAFAFA',
        color: '#000000',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-pagination.is-background .el-pagerli:not(.disabled) {
    background-color: #fff; /*进行修改未选中背景和字体 */
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #3168f5; /*进行修改选中项背景和字体 */
    color: #fff;
  }
}
</style>

<style lang="scss">
.t-table {
  scrollbar-color: #e5e5e5 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
  -ms-scrollbar-track-color: #f5f7fa;
  z-index: 0;
  background-color: #fff;
  padding: 10px;
  // border-radius: 4px;
  // 表格外右侧按钮
  .tableTop {
    margin-bottom: 20px;
    .f-r {
      float: right;
      .r_btn {
        border-radius: 6px;
        border: 1px solid #3168f5;
        background: #ffffff;
        font-size: 18px;
        color: #3168f5;
      }
    }
  }

  .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    // margin-right: 60px;
    margin-right: calc(2% - 20px);
    background-color: #fff;
  }
  .el-table th,
  .el-table td {
    padding: 8px 0;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 5px;
  }
  .el-table .cell {
    padding: 0 5px;
  }
  // .el-table::before {
  //   // height: 0;
  // }
  // .el-table--group::after,
  // .el-table--border::after {
  //   // width: 0;
  // }
  .el-table--scrollable-y .el-table__fixed-right {
    right: 8px !important;
  }
  // .toolbar_top {
  //   display: flex;
  //   padding: 10px 0;
  //   align-items: center;
  //   .toolbar {
  //     display: flex;
  //     justify-content: flex-end;
  //     width: 100%;
  //   }
  //   .el-button--small {
  //     height: 32px;
  //   }
  //   .el-button--success {
  //     background-color: #53a8ff;
  //     border: 1px solid #53a8ff;
  //   }
  // }
  .el-table--scrollable-y .el-table__body-wrapper {
    overflow-x: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      margin-top: 110px;
      width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
      // height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #b3b3b3;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ededed;
    }
  }
}
.operator_pop {
  margin-left: 10px;
  min-width: 70px;
  padding: 0;
  .ulClose {
    font-size: 14px;
    padding: 0;
    margin: 5px 0;
    li {
      padding: 0 10px;
      text-align: center !important;
      font-size: 12px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 32px;
      cursor: pointer;
    }
    li:hover {
      color: #66b1ff;
      background: #ecf5ff;
    }
  }
  .el-popoverbtn {
    border: none;
    padding: 0 3px;
    padding-left: 6px;
  }
  .el-popoverbtn:hover {
    color: #66b1ff;
    background: #fff;
  }
}
</style>
