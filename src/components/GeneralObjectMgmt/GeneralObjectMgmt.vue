<template>
  <div class="common-list">
    <div class="content-wrapper">
      <!-- Query -->
      <div class="query-form row-between">
        <!-- QueryForm -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules" inline size="medium">
          <el-form-item v-for="item in queryFormItems" :key="item.prop" :label="item.label">
            <el-input v-if="item.type === 'input'" v-model="queryForm[item.prop]" />
            <el-select v-model="queryForm[item.prop]" placeholder="" clearable filterable @change="doSearch">
              <el-option v-for="option in item.optionList" :key="option.optionKey" :label="option.optionLabel" :value="option.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- Buttons -->
        <div class="header-btns">
          <el-button v-if="query.showAddBtn" type="primary" size="medium" @click="onAdd">新增</el-button>
          <el-button v-for="btn in query.btns" :key="btn.code" :type="btn.type" size="medium" @click="btn.handler">{{ btn.name }}</el-button>
        </div>
      </div>
      <!-- Table -->
      <el-table :data="tableData">
        <el-table-column v-for="col in tableColumns" :key="col.prop" :prop="col.prop" :label="col.label" :align="config.align" />
        <el-table-column v-if="tableConfig.operation.show" label="操作" :align="config.align">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="onDetail(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GeneralObjectMgmt',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      api: {
        add: '',
        edit: '',
        detail: '',
        delete: ''
      },
      tableConfig: {
        operation: {
          show: true,
          btns: []
        }
      },
      dialogConfig: {},
      tableColumns: []
    }
  },
  created() {
    this.api = this.config.urls
    this.tableConfig = this.config.table
    this.dialogConfig = this.config.dialog
    this.tableColumns = this.tableConfig.columns
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.common-list {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
  .content-wrapper {
    height: 100%;
    border-radius: 6px;
    background-color: white;
  }
  .query-form-wrapper {
    height: 50px;
    margin-bottom: 10px;
    ::v-deep {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
::v-deep {
  .required-form-item {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 10px;
    &::before {
      content: '*';
      color: red;
      margin-right: 3px;
    }
  }
  .el-dialog {
    transform: none;
    left: 0;
    position: relative;
    margin: 0 auto;
    .el-dialog__body {
      padding-bottom: 50px;
      max-height: 75vh;
      overflow: auto;
    }
  }
}
</style>
