
<template>
  <div class="system-page">
    <div class="content-wrapper">
      <div class="query-form row-between">
        <common-form :form-model="queryForm" size="medium" class="row-left" :form-rule="queryFormRules" label-width="auto" :form-items="queryFormItems" :gutter="10" :form-fn="queryFormFn" />
        <el-button type="primary" plain size="small" @click="onAdd">添加</el-button>
      </div>
      <common-table v-loading="loading" :table-data="tableData" :table-prop="tableCols" :table-page="pagi" />
      <el-dialog :title="dialogT" :visible.sync="dialogV" width="40%" top="10vh">
        <common-form v-if="dialogV" :form-model="dialogForm" :disabled="mode==='detail'" :form-items="dialogFormItems" :form-rule="dialogFormRules" :form-fn="dialogFormFn" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/table.js'
import formMixin from '@/mixins/form.js'

export default {
  mixins: [tableMixin, formMixin],
  data() {
    return {
      entityName: '供需',
      url: {
        list: '',
        add: '',
        edit: '',
        delete: '',
        toggleState: ''
      },
      queryForm: {
        workTitle: '',
        keyword: ''
      },
      queryFormFn: [
        {
          label: '查询',
          size: 'small',
          btnType: 'primary',
          fn: this.doSearch
        }
      ],
      queryFormItems: [
        {
          label: '需求类型',
          type: 'select',
          prop: 'workTitle',
          span: 24,
          options: [],
          optionsConfig: {
            value: 'value',
            label: 'label'
          },
          changeFn: 'this.doSearch'
        },
        {
          label: '姓名',
          type: 'input',
          prop: 'keyword',
          span: 24
        }
      ],
      dialogForm: {
        name: '',
        workTitle: '',
        issuer: '',
        description: '',
        pubTime: '',
        viewNum: '',
        keyword: ''
      },
      dialogFormItems: [
        {
          label: '需求类型',
          type: 'select',
          prop: 'workTitle',
          span: 24,
          required: true,
          options: [],
          optionsConfig: {
            value: 'value',
            label: 'label'
          },
          changeFn: 'this.doSearch'
        },
        {
          label: '发布人',
          type: 'input',
          prop: 'issuer',
          span: 24,
          required: true
        },
        {
          label: '发布内容',
          type: 'input',
          prop: 'description',
          span: 24,
          required: true
        },
        {
          label: '发布时间',
          type: 'input',
          prop: 'pubTime',
          span: 24,
          required: true
        },
        {
          label: '浏览量',
          type: 'input',
          prop: 'viewNum',
          span: 24,
          required: true
        },
        {
          label: '姓名',
          type: 'input',
          prop: 'keyword',
          span: 24,
          required: true
        }
      ],
      dialogFormFn: [
        {
          label: '提交',
          btnType: 'primary',
          isValiDate: true,
          fn: this.onSubmit
        },
        {
          label: '取消',
          btnType: 'default',
          fn: this.closeDialog
        }
      ],
      tableCols: [
        {
          type: 'text',
          label: '序号',
          prop: 'name'
        },
        {
          type: 'text',
          label: '需求类型',
          prop: 'workTitle'
        },
        {
          type: 'text',
          label: '发布人',
          prop: 'issuer'
        },
        {
          type: 'text',
          label: '发布内容',
          prop: 'description'
        },
        {
          type: 'text',
          label: '发布时间',
          prop: 'pubTime'
        },
        {
          type: 'text',
          label: '浏览量',
          prop: 'viewNum'
        },
        {
          type: 'text',
          label: '姓名',
          prop: 'keyword'
        },
        {
          type: 'operation',
          label: '操作',
          width: '260px'
        }
      ],
      loading: false,
      dialogV: false,
      mode: 'add',
      tableData: [],
      queryFormRules: {},
      dialogFormRules: {},
      pagi: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    insertOperations(tableData) {
      tableData.forEach(row => {
        row.operations = [
          { label: '修改', type: 'primary', fn: this.onEdit },
          { label: '删除', type: 'danger', fn: this.onDelete }
        ]
      })
      return tableData
    }
  }
}
</script>

<style lang="scss" scoped>
.system-page {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
  .content-wrapper {
    height: 100%;
    border-radius: 6px;
    background-color: white;
  }
  .query-form {
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
