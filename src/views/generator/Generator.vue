<template>
  <div class="generator">
    <div class="form-wrapper">
      <el-form
        ref="entityFormRef"
        :model="entityForm"
        label-width="100px"
      >
        <el-form-item label="Entity Name">
          <el-input v-model="entityForm.entityName" />
        </el-form-item>

        <!-- Multiple URL inputs -->
        <el-form-item label="List URL">
          <el-input v-model="entityForm.urlList" />
        </el-form-item>
        <el-form-item label="Add URL">
          <el-input v-model="entityForm.urlAdd" />
        </el-form-item>
        <el-form-item label="Edit URL">
          <el-input v-model="entityForm.urlEdit" />
        </el-form-item>
        <el-form-item label="Remove URL">
          <el-input v-model="entityForm.urlRemove" />
        </el-form-item>
        <el-form-item label="Toggle URL">
          <el-input v-model="entityForm.urlToggle" />
        </el-form-item>

        <!-- Table to input properties -->
        <el-form-item label="属性和变量名">
          <el-button
            type="primary"
            @click="addProperty"
          >添加属性</el-button>
          <el-table
            :data="entityForm.properties"
            border
            stripe
            style="width: 100%; margin-top: 10px;"
          >
            <el-table-column
              prop="label"
              label="属性名"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.label" />
              </template>
            </el-table-column>

            <el-table-column
              prop="propName"
              label="变量名"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.propName" />
              </template>
            </el-table-column>
            <el-table-column label="queryForm">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.queryForm"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column label="dialogForm">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.dialogForm"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="dialogFormItemSpan"
              label="dialogFormItemSpan"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.dialogFormItemSpan"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column label="tableCol">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.tableCol"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column label="必填">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.required"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="removeProperty(scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <div class="export-btn">
      <el-input
        v-model="fileName"
        placeholder="请输入文件名"
        style="width: 200px; margin-right: 10px;"
      />
      <el-button
        type="primary"
        @click="exportVueFile"
      >导出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entityForm: {
        entityName: '用户',
        urlList: '',
        urlAdd: '',
        urlEdit: '',
        urlRemove: '',
        urlToggle: '',
        properties: [
          {
            label: '',
            propName: '',
            queryForm: false,
            dialogForm: true,
            required: true,
            tableCol: true,
            dialogFormItemSpan: 24
          }
        ]
      },
      fileName: 'result' // 默认文件名
    }
  },
  methods: {
    addProperty() {
      this.entityForm.properties.push(
        {
          label: '',
          propName: '',
          queryForm: false,
          dialogForm: true,
          required: true,
          tableCol: true,
          dialogFormItemSpan: 24
        }
      )
    },
    removeProperty(index) {
      this.entityForm.properties.splice(index, 1)
    },
    generateResultVue() {
      const { entityName, urlList, urlAdd, urlEdit, urlRemove, urlToggle, properties } = this.entityForm

      const queryForm = {}
      const queryFormItems = []
      const dialogForm = {}
      const dialogFormItems = []
      const tableCols = []

      properties.forEach(prop => {
        if (prop.queryForm) {
          queryForm[prop.propName] = ''
          queryFormItems.push({
            label: prop.label,
            type: 'input', // 根据需求调整类型
            prop: prop.label,
            span: 8 // 可以根据需要调整
          })
        }
        dialogForm[prop.propName] = ''
        if (prop.dialogForm) {
          dialogFormItems.push({
            label: prop.label,
            type: 'input', // 根据需求调整类型
            prop: prop.propName,
            span: 8, // 可以根据需要调整
            required: prop.required // 如果必填，插入required:true
          })
        }
        tableCols.push({
          label: prop.label,
          prop: prop.propName
        })
      })

      const resultVueTemplate = `
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
import tableMixin from './table.js';
import formMixin from './form.js';

export default {
  mixins: [tableMixin, formMixin],
  data() {
    return {
      entity: '${entityName}',
      url: {
        list: '${urlList}',
        add: '${urlAdd}',
        edit: '${urlEdit}',
        delete: '${urlRemove}',
        toggleState: '${urlToggle}'
      },
      queryForm: ${JSON.stringify(queryForm, null, 2)},
      queryFormItems: ${JSON.stringify(queryFormItems, null, 2)},
      dialogForm: ${JSON.stringify(dialogForm, null, 2)},
      dialogFormItems: ${JSON.stringify(dialogFormItems, null, 2)},
      tableCols: ${JSON.stringify(tableCols, null, 2)},
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
      entityName: '${entityName}',
      dialogT: ''
    }
  },
  methods: {
    // 这里可以定义其他方法
  }
}
<\/script>

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
`

      return resultVueTemplate
    },
    exportVueFile() {
      const content = this.generateResultVue()
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${this.fileName}.vue`
      link.click()
      URL.revokeObjectURL(link.href)
    }
  }
}
</script>

<style scoped>
.generator {
  padding: 20px;
}
</style>
