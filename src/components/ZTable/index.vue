<template>
  <div class="ZTable">
    <el-table
      :ref="config.refName"
      :data="config.data"
      fit
      :border="config.bordered"
      :stripe="config.stripped"
      style="width: 100%"
      :max-height="config.maxHeight"
      :empty-text="config.emptyText"
      :header-cell-style="tableHeaderStyle"
      :row-class-name="rowClassName"
      :highlight-current-row="config.highlightCurrentRow"
      @current-change="config.currentChange"
      @selection-change="config.selectChange"
    >
      <template v-for="(column, index) in columns_">
        <!-- 图片 -->
        <el-table-column
          v-if="column.type == 'img'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row[column.prop]"
              :style="{height:column.height}"
            >
          </template>
        </el-table-column>
        <!-- 链接 -->
        <el-table-column
          v-if="column.type == 'link'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        >
          <template slot-scope="scope">
            <a
              :href="scope.row[column.prop].link"
              :style="scope.row[column.prop].style"
              :title="scope.row[column.prop].title"
            >{{ scope.row[column.prop].label }}</a>
          </template>
        </el-table-column>
        <!-- 输入框编辑 -->
        <el-table-column
          v-if="column.type == 'editInput'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        >
          <template slot-scope="scope">
            <el-popover
              v-prop="column.click"
              trigger="click"
              placement="top"
            >
              <el-input
                v-prop="editModel"
                style="width: 60%"
              />
              <el-button
                type="primary"
                @click="scope.row[column.prop]=editModel;column.click=false"
              ><i class="el-icon-edit" /></el-button>
              <el-button @click="column.click=false"><i class="el-icon-close" /></el-button>
              <div
                slot="reference"
                class="name-wrapper"
                @click="editModel=scope.row[column.prop]"
              >{{ scope.row[column.prop] }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 数字编辑 -->
        <el-table-column
          v-if="column.type == 'editNumber'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        >
          <template slot-scope="scope">
            <el-popover
              v-prop="column.click"
              trigger="click"
              placement="top"
            >
              <el-input-number
                v-prop="editModel"
                controls-position="right"
              />
              <el-button
                type="primary"
                @click="scope.row[column.prop]=editModel;column.click=false"
              ><i class="el-icon-edit" /></el-button>
              <el-button @click="column.click=false"><i class="el-icon-close" /></el-button>
              <div
                slot="reference"
                class="name-wrapper"
                @click="editModel=scope.row[column.prop]"
              >{{ scope.row[column.prop] }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 时间选择编辑 -->
        <el-table-column
          v-if="column.type == 'editTime'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        >
          <template slot-scope="scope">
            <el-popover
              v-prop="column.click"
              trigger="click"
              placement="top"
            >
              <el-date-picker
                v-prop="editModel"
                type="datetime"
                :format="$t('upms.language.format')"
              />
              <el-button
                type="primary"
                @click="scope.row[column.prop]=editModel;column.click=false"
              ><i class="el-icon-edit" /></el-button>
              <el-button @click="column.click=false"><i class="el-icon-close" /></el-button>
              <div
                slot="reference"
                class="name-wrapper"
                @click="editModel=scope.row[column.prop]"
              >{{ scope.row[column.prop]|formatDate($t('upms.language.format')) }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 选择编辑 -->
        <el-table-column
          v-if="column.type == 'editSelect'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        >
          <template slot-scope="scope">
            <el-popover
              v-prop="column.click"
              trigger="click"
              placement="top"
            >
              <el-select v-prop="editModel">
                <el-option
                  v-for="choose in column.option"
                  :key="choose.value"
                  :label="choose.label"
                  :value="choose.value"
                />
              </el-select>
              <el-button
                type="primary"
                @click="scope.row[column.prop]=editModel;column.click=false"
              ><i class="el-icon-edit" /></el-button>
              <el-button @click="column.click=false"><i class="el-icon-close" /></el-button>
              <div
                slot="reference"
                class="name-wrapper"
                @click="editModel=scope.row[column.prop]"
              >{{ scope.row[column.prop] }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 文本 -->
        <el-table-column
          v-else-if="column.type == 'text'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        />
        <!-- 时间 -->
        <el-table-column
          v-else-if="column.type == 'time'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :formatter="column.formatter"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        />
        <!-- 数字状态列 -->
        <el-table-column
          v-else-if="column.type == 'state'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :formatter="column.formatter"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        />
        <!-- 空文本替代 -->
        <el-table-column
          v-else-if="column.type == 'emptyText'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :formatter="column.formatter"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        />
        <!-- 国际化 -->
        <el-table-column
          v-else-if="column.type == 'locale'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :formatter="localeFormatter"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        />
        <!-- 多选 -->
        <el-table-column
          v-else-if="column.type == 'selection'"
          :key="index"
          :align="column.align"
          type="selection"
          :label="column.label"
          :width="column.width"
          :fixed="column.fixed"
          :show-overflow-tooltip="tableTooltipFlag"
        />
        <!-- 操作 -->
        <el-table-column
          v-else-if="column.type == 'operation'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
        >
          <template slot-scope="scope">
            <span
              v-for="(operate, operateIndex) in scope.row[column.prop]"
              v-show="operate.show"
              :key="operateIndex"
              :title="operate.title"
              @click="operate.func(scope)"
              v-html="operate.label"
            />
          </template>
        </el-table-column>
        <!-- 划过 -->
        <el-table-column
          v-else-if="column.type == 'hover'"
          :key="index"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              :placement="scope.row[column.prop].position"
              :class="scope.row[column.prop].class"
            >
              <p v-html="scope.row[column.prop].hoverText" />
              <div
                slot="reference"
                class="name-wrapper"
                v-html="scope.row[column.prop].title"
              />
            </el-popover>
          </template>
        </el-table-column>
        <!-- 下标 -->
        <el-table-column
          v-else-if="column.type == 'index'"
          :key="index"
          :align="column.align"
          type="index"
          :index="indexMethod"
          label="序号"
          :width="column.width"
          :fixed="column.fixed"
          show-overflow-tooltip
        />
        <!-- 树下标 -->
        <el-table-tree-column
          v-else-if="column.type == 'treeIndex'"
          :key="index"
          :align="column.align"
          file-icon="icon icon-file"
          child-key="children"
          :show-overflow-tooltip="true"
          :indent-size="20"
          folder-icon="icon icon-folder"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          parent-key="pId"
          class="tree-column"
        />
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagi-wrapper">
      <el-pagination
        v-if="config.withPagination"
        :current-page="config.pagi.curPage"
        :page-size="config.pagi.pageSize"
        :page-sizes="config.pagi.pageSizes"
        :total="config.pagi.total"
        layout="total, sizes, prev, pager, next, jumper"
        :background="config.hasBackground || true"
        @size-change="config.pagi.handleSizeChange"
        @current-change="config.pagi.handlePageChange"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ZTable',
  props: {
    config: { // 表格样式配置
      type: Object,
      required: true
    },
    columns: { // 表格列配置
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tableTooltipFlag: window.config?.tableTooltipFlag,
      editModel: '',
      selectedData: [],
      selectedRowKeys: []
    }
  },
  computed: {
    ...mapGetters(['tableHeaderStyle']),
    columns_() { // 将 columns 中某些字段设置默认值
      return this.columns.map(column => ({
        ...column,
        type: column.type ? column.type : 'text',
        align: column.align ? column.align : 'center'
      }))
    },
    tableData() {
      return this.$props.config.data
    }
  },
  mounted() {
    this.setConfigDefaults()
  },
  methods: {
    rowClick(row) {
      this.curRow = row
      row.selected = !row.selected
      if (row.selected) {
        this.$refs['el-table'].setCurrentRow(row)
      } else {
        this.$refs['el-table'].setCurrentRow()
      }
    },
    setConfigDefaults() {
      Object.assign(this.config, {
        data: this.config.data.map(item => ({ ...item, selected: false })),
        emptyText: this.config.emptyText ? this.config.emptyText : '暂未查找到相关数据',
        highlightCurrentRow: this.config.highlightCurrentRow ? this.config.highlightCurrentRow : false,
        currentChange: this.config.currentChange ? this.config.currentChange : this.defaultCurrentChange
      })
    },
    defaultCurrentChange(curRow, oldRow) {
      // ...
    },
    localeFormatter(row, column, cellValue, index) {
      return this.$t(cellValue)
    },
    indexMethod(index) { //    下标
      if (this.$props.config.isPage) {
        return index + (this.$props.config.pagi.curPage - 1) * this.$props.pagi.pageSize + 1
      } else {
        return index * 1 + 1
      }
    },
    selectChange(row) {
      this.selectedData = row
      this.$emit('listenToSelectDataEvent', this.selectedData)
    },
    clearSelection() {
      this.$refs[this.config.refName].clearSelection()
    },
    setSelectedRows(rowKeys) { //  手动设置多选行
      console.log('ZTable手动设置选定行(rowKeys):', rowKeys)
      rowKeys.forEach(key => {
        const row = this.$props.config.data.find(row => Number(row.id) === ~~key)
        this.$refs[this.config.refName].toggleRowSelection(row, true)
      })
    },
    getLocale(cellValue) {
      var _this = this
      if (!cellValue) {
        return ''
      } else {
        return this.$t(_this.$props.config.localgroup + cellValue)
      }
    },
    getFormat(cellValue) {
      return this.$formatDate(cellValue, this.$t('upms.language.format'))
    },
    rowClassName({ row, rowIndex }) { //    设置表格选定行的颜色
      if (this.config.selected && this.config.selected.split(',').includes(row.id.toString())) {
        return 'selected-row'
      }
    }
  }
}
</script>

<style lang="scss">
.ZTable{
  width: 100%;
}
</style>
