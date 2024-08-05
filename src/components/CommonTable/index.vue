<!-- 没有文档，请看页面中具体使用步骤 -->
<template>
  <div class="common-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      header-row-class-name="common-table-thead"
      :row-key="tableTree ? tableTree.rowKey : ''"
      :tree-props="tableTree ? tableTree.treeProps : {}"
      border
    >
      <template v-for="(item, tabledataIndex) in tableProp">
        <template v-if="item.isShow !== undefined ? item.isShow : true">
          <!-- 序号 -->
          <el-table-column v-if="item.type === 'index'" :key="tabledataIndex" :label="item.label" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <!-- 显示文本 -->
          <el-table-column
            v-if="item.type === 'text'"
            :key="tabledataIndex"
            :prop="item.prop"
            show-overflow-tooltip
            :label="item.label"
            :width="item.width ? item.width : ''"
          />
          <el-table-column
            v-if="item.type === 'tagText'"
            :key="tabledataIndex"
            :prop="item.prop"
            show-overflow-tooltip
            :label="item.label"
            :width="item.width ? item.width : ''"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row[item.prop + 'Color']">{{ scope.row[item.prop] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.type === 'colorText'"
            :key="tabledataIndex"
            :prop="item.prop"
            show-overflow-tooltip
            :label="item.label"
            :width="item.width ? item.width : ''"
          >
            <template slot-scope="scope">
              <span :style="{ color: scope.row[item.prop + 'Color'] }">{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <!-- 显示操作栏 -->
          <el-table-column
            v-if="item.type === 'operation'"
            :key="tabledataIndex"
            :label="item.label"
            :width="item.width ? item.width : ''"
          >
            <template slot-scope="scope">
              <template v-for="(operationItem, operationIndex) in scope.row.operations">
                <template v-if="operationItem.type === 'dropdown'">
                  <el-dropdown
                    :key="operationIndex"
                    style="margin-left: 10px"
                    @command="
                      val => {
                        operationItem.fn(val, scope.row)
                      }
                    "
                  >
                    <el-button type="primary" size="mini">
                      {{ operationItem.label }}<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="menusItem in operationItem.menus"
                        :key="menusItem.command"
                        :command="menusItem.command"
                      >
                        {{ menusItem.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template v-else>
                  <el-button
                    v-if="operationItem.isshow === undefined ? true : operationItem.isshow"
                    :key="operationIndex"
                    :type="operationItem.type"
                    size="mini"
                    @click="operationClick(scope.row, scope, operationItem)"
                  >
                    {{ operationItem.label }}</el-button
                  >
                </template>
              </template>
            </template>
          </el-table-column>
          <!-- switch开关 -->
          <el-table-column
            v-if="item.type === 'switch'"
            :key="tabledataIndex"
            :label="item.label"
            :width="item.width ? item.width : ''"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row[item.prop]"
                :disabled="scope.row[item.prop + 'disabled']"
                :active-value="item.switchConfig.onValue ? item.switchConfig.onValue : true"
                :inactive-value="item.switchConfig.offValue ? item.switchConfig.offValue : false"
                :active-color="item.switchConfig.onColor ? item.switchConfig.onColor : ''"
                :inactive-color="item.switchConfig.offColor ? item.switchConfig.offColor : ''"
                :active-text="item.switchConfig.onText ? item.switchConfig.onText : ''"
                :inactive-text="item.switchConfig.offText ? item.switchConfig.offText : ''"
                @change="switchChange(scope.row[item.prop], scope.row, item)"
              />
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <div v-if="tablePage" class="customPage">
      <el-pagination
        :current-page="tablePage.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="tablePage.size"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="tablePage.total"
        @size-change="
          val => {
            return tablePage.handleSizeChange ? tablePage.handleSizeChange(val) : none
          }
        "
        @current-change="
          val => {
            return tablePage.handleCurrentChange ? tablePage.handleCurrentChange(val) : none
          }
        "
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    tableTree: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    none() {},
    switchChange(val, row, item) {
      this.$confirm('是否切换状态?')
        .then(() => {
          // 执行代码
          item.fn &&
            item.fn(row).catch(() => {
              let newVal = ''
              if (val === item.switchConfig.onValue) {
                newVal = item.switchConfig.offValue
              } else {
                newVal = item.switchConfig.onValue
              }
              row[item.prop] = newVal
            })
        })
        .catch(() => {
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
        })
          .then(() => {
            operationItem.fn && operationItem.fn(row, scope)
          })
          .catch(() => {})
      } else {
        operationItem.fn && operationItem.fn(row, scope)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';
.common-table {
  overflow: hidden;
  .common-table-thead {
    background-color: #f3f6fd;
    th {
      background-color: transparent;
      // color: $primary-text;
      // font-weight: $weight-semibold;
    }
  }
  .customPage {
    margin-top: 20px;
    float: right;
  }
}
</style>
