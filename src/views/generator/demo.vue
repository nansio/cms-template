
<template>
  <div class="system-page">
    <div class="content-wrapper">
      <div class="query-form row-between">
        <common-form :form-model="queryForm" size="medium" class="row-left" :form-rule="queryFormRules" label-width="auto" :form-items="queryFormItems" :gutter="10" :form-fn="queryFormFn" />
        <el-button type="primary" plain size="small" @click="onAdd">添加</el-button>
      </div>
      <common-table v-loading="loading" :table-data="tableData" :table-prop="tableCols" :table-page="pagi" />
      <el-dialog :title="dialogT" :visible.sync="dialogV" width="40%" top="10vh">
        <common-form v-if="dialogV" :form-model="form" :disabled="mode==='detail'" :form-items="dialogFormItems" :form-rule="dialogFormRules" :form-fn="dialogFormFn" />
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
      entity: '用户',
      url: {
        list: '',
        add: '',
        edit: '',
        delete: '',
        toggleState: ''
      },
      queryForm: {},
      queryFormItems: [],
      dialogForm: {
        expertStatu: '',
        userName: '',
        phoneNumber: '',
        password: '',
        name: ''
      },
      dialogFormItems: [
        {
          label: '角色',
          type: 'select',
          prop: 'expertStatu',
          span: 24,
          required: true,
          options: [],
          optionsConfig: {
            value: 'id',
            label: 'content'
          },
          changeFn: null
        },
        {
          label: '用户名称',
          type: 'input',
          prop: 'userName',
          span: 24,
          required: true
        },
        {
          label: '账号',
          type: 'input',
          prop: 'phoneNumber',
          span: 24,
          required: true
        },
        {
          label: '密码',
          type: 'input',
          prop: 'password',
          span: 24,
          required: true
        },
        {
          label: '账号状态',
          type: 'select',
          prop: 'name',
          span: 24,
          required: true,
          options: [],
          optionsConfig: {
            value: 'id',
            label: 'content'
          },
          changeFn: null
        }
      ],
      tableCols: [
        {
          label: '角色',
          prop: 'expertStatu'
        },
        {
          label: '用户名称',
          prop: 'userName'
        },
        {
          label: '账号',
          prop: 'phoneNumber'
        },
        {
          label: '密码',
          prop: 'password'
        },
        {
          label: '账号状态',
          prop: 'name'
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
      },
      entityName: '用户',
      dialogT: ''
    }
  },
  methods: {
    // 这里可以定义其他方法
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
