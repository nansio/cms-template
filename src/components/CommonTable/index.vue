<!-- 没有文档，请看页面中具体使用步骤 -->
<template>
  <div class="common-table">
    <el-table :data="tableData" style="width: 100%" :max-height="tableHeight" header-row-class-name="common-table-thead" :row-key="tableTree ? tableTree.rowKey : ''" :tree-props="tableTree ? tableTree.treeProps : {}">
      <template v-for="(item, tabledataIndex) in tableProp">
        <template v-if="item.show === undefined || item.show === true">
          <!-- 序号 -->
          <el-table-column v-if="item.type === 'index'" :key="tabledataIndex" :label="item.label" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 显示文本 -->
          <el-table-column v-if="item.type === 'text'" :key="tabledataIndex" :fixed="item.fixed" :prop="item.prop" show-overflow-tooltip :label="item.label" :width="item.width ? item.width : ''" />
          <!-- 显示操作栏 -->
          <el-table-column v-if="item.type === 'operation'" :key="tabledataIndex" :label="item.label" :width="item.width ? item.width : ''">
            <template slot-scope="scope">
              <template v-for="(operationItem, operationIndex) in scope.row.operations">
                <template v-if="operationItem.type === 'dropdown'">
                  <el-dropdown :key="operationIndex" style="margin-left: 10px;" @command="(val) => {operationItem.fn(val, scope.row)}">
                    <el-button type="primary" size="mini">
                      {{ operationItem.label }}<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="menusItem in operationItem.menus" :key="menusItem.command" :command="menusItem.command">{{ menusItem.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template v-else>
                  <el-button v-if="operationItem.isshow === undefined ? true : operationItem.isshow" :key="operationIndex" :type="operationItem.type" :disabled="operationItem.isDisabled === undefined ? false : operationItem.isDisabled" plain size="mini" @click="operationClick(scope.row, scope, operationItem)">{{ operationItem.label }}</el-button>
                </template>
              </template>
            </template>
          </el-table-column>
          <!-- switch开关 -->
          <el-table-column v-if="item.type === 'switch'" :key="tabledataIndex" :label="item.label" :width="item.width ? item.width : ''">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row[item.prop]"
                :disabled="scope.row[item.prop + 'disabled']"
                :active-value="item.switchConfig.onValue ? item.switchConfig.onValue : true" :inactive-value="item.switchConfig.offValue ? item.switchConfig.offValue : false" :active-color="item.switchConfig.onColor ? item.switchConfig.onColor : $variable.$primary"
                :inactive-color="item.switchConfig.offColor ? item.switchConfig.offColor : $variable.$danger" :active-text="item.switchConfig.onText ? item.switchConfig.onText : ''" :inactive-text="item.switchConfig.offText ? item.switchConfig.offText : ''"
                @change="switchChange(scope.row[item.prop], scope.row, item)"
              />
            </template>
          </el-table-column>
          <!-- 表示状态的带背景色的小圆点 -->
          <el-table-column v-if="item.type === 'status'" :key="tabledataIndex" align="center" :label="item.label" :width="item.width ? item.width : ''">
            <template slot-scope="scope">
              <span :style="{display: 'inline-block', width: '14px', height: '14px', backgroundColor: getColor(scope.row[item.prop]), borderRadius: '7px'}" />
            </template>
          </el-table-column>
          <!-- 发布状态 -->
          <el-table-column v-if="item.type === 'auditState'" :key="tabledataIndex" align="center" :label="item.label" :width="item.width ? item.width : ''">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center; justify-content: center;">
                <span :style="{display: 'inline-block', width: '14px', height: '14px', backgroundColor: getColor(scope.row[item.prop]), borderRadius: '7px'}" />
                <span style="margin-left: 5px;">{{ scope.row[item.prop] === 1 ? '已发布' : '未发布' }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 申请状态 -->
          <el-table-column v-if="item.type === 'applyState'" :key="tabledataIndex" align="center" :label="item.label" :width="item.width ? item.width : ''">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center; justify-content: center;">
                <el-button v-if="scope.row.applyState === 'APPLYING'" type="warning" icon="" circle size="mini" />
                <el-button v-if="scope.row.applyState === 'APPLIED'" type="primary" icon="" circle size="mini" />
                <el-button v-if="scope.row.applyState === 'REJECTED'" type="danger" icon="" circle size="mini" />
                <span style="margin-left: 10px;">{{ getText(scope.row.applyState) }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <div v-if="tablePage && isPage" class="customPage">
      <el-pagination
        :current-page="tablePage.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="tablePage.size"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="tablePage.total"
        @size-change="(val) => {return tablePage.handleSizeChange ? tablePage.handleSizeChange(val) : none}"
        @current-change="(val) => {return tablePage.handleCurrentChange ? tablePage.handleCurrentChange(val) : none}"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    props: {
      tableHeight: {
        type: String,
        default: () => {
          return null
        }
      },
      tableData: {
        type: Array,
        default: () => {
          return []
        }
      },
      tableProp: {
        type: Array,
        default: () => {
          return []
        }
      },
      tablePage: {
        type: Object,
        default: () => {
          return {
            page: 1,
            size: 10,
            total: 0,
            handleSizeChange: null,
            handleCurrentChange: null
          }
        }
      },
      isPage: {
        type: Boolean,
        default: () => {
          return true
        }
      },
      tableTree: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    methods: {
      none() {},
      switchChange(val, row, item) {
        this.$messageBox.confirm('是否切换状态?').then(() => {
          // 执行代码
          item.fn && item.fn(row).catch(() => {
            let newVal = ''
            if (val === item.switchConfig.onValue) {
              newVal = item.switchConfig.offValue
            } else {
              newVal = item.switchConfig.onValue
            }
            row[item.prop] = newVal
          })
        }).catch(() => {
          let newVal = ''
          if (val === item.switchConfig.onValue) {
            newVal = item.switchConfig.offValue
          } else {
            newVal = item.switchConfig.onValue
          }
          row[item.prop] = newVal
        })
      },
      operationClick(row, scope, operationItem) {
        if (operationItem.confirmText) {
          this.$confirm(operationItem.confirmText, '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            operationItem.fn && operationItem.fn(row, scope)
          }).catch(() => {})
        } else {
          operationItem.fn && operationItem.fn(row, scope)
        }
      },
      getColor(color) {
        if (color === 'red') {
          return this.$variable.$danger
        } else if (color === 'green') {
          return this.$variable.$primary
        } else if (color === 1) {
          return this.$variable.$primary
        } else if (color === 0) {
          return this.$variable.$danger
        }
      },
      getText(val) {
        if (val === 'APPLYING') {
          return '待审核'
        }
        if (val === 'APPLIED') {
          return '已通过'
        }
        if (val === 'REJECTED') {
          return '已驳回'
        }
        if (val === 'database') {
          return '数据库'
        }
        if (val === 'file') {
          return '文件'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.common-table {
  overflow: hidden;
  ::v-deep {
    .common-table-thead {
      height: 48px;
      .cell {
        height: 48px;
        line-height: 48px;
        color: #333;
        font-weight: 600;
        background-color: #ecf4f3;
      }
    }
    .el-table__row{
      height: 52px;
    }
  }
  .customPage {
    margin-top: 20px;
    float: right;
  }
}
</style>
