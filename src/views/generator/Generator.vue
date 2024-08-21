<template>
  <div class="generator">
    <div class="form-wrapper">
      <el-form
        ref="entityFormRef" :model="entityForm"
        label-width="100px" label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Entity Name">
              <el-input v-model="entityForm.entityName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="List URL">
              <el-input v-model="entityForm.urlList" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Add URL">
              <el-input v-model="entityForm.urlAdd" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Edit URL">
              <el-input v-model="entityForm.urlEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Remove URL">
              <el-input v-model="entityForm.urlRemove" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Toggle URL">
              <el-input v-model="entityForm.urlToggle" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- Table to input properties -->
        <el-form-item label="How much?">
          <el-input-number v-model="propNumber" size="normal" label="" :min="1" :controls="false" @blur="insertProps" />
          <el-button type="primary" style="margin-left:10px;" @click="addProperty">+1</el-button>
          <el-table :data="entityForm.properties" border stripe style="width: 100%; margin-top: 10px" class="props-table">
            <el-table-column prop="label" label="label" align="center" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.label" />
              </template>
            </el-table-column>
            <el-table-column prop="propName" label="propName" align="center" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.propName" />
              </template>
            </el-table-column>
            <el-table-column prop="type" label="type" align="center" width="140">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" filterable @change="onPropTypeChange($event,scope.row)">
                  <el-option label="input" value="input" />
                  <el-option label="select" value="select" />
                  <el-option label="textarea" value="areaInput" />
                  <el-option label="daterange" value="daterange" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="tableCol" width="100" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.tableCol" active-color="#13ce66" inactive-color="#ff4949" />
              </template>
            </el-table-column>
            <el-table-column label="queryForm" width="100" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.queryForm" active-color="#13ce66" inactive-color="#ff4949" />
              </template>
            </el-table-column>
            <el-table-column label="dialogForm" width="100" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.dialogForm" active-color="#13ce66" inactive-color="#ff4949" />
              </template>
            </el-table-column>
            <el-table-column label="required" width="100" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.required" active-color="#13ce66" inactive-color="#ff4949" />
              </template>
            </el-table-column>
            <el-table-column label="span" prop="span" width="130" align="center">
              <template slot-scope="scope">
                <el-input-number v-model.number="scope.row.span" :controls="false" style="width:100px;" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="removeProperty(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <div class="export-btn">
      <!-- <el-input v-model="fileName" placeholder="请输入文件名" style="width: 200px; margin-right: 10px" /> -->
      <el-button type="primary" plain @click="copy2Clipboard">Magic</el-button>
      <!-- <el-button type="primary" plain @click="exportVueFile">导出</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      propNumber: 1,
      entityForm: {
        entityName: '用户',
        urlList: '',
        urlAdd: '',
        urlEdit: '',
        urlRemove: '',
        urlToggle: '',
        properties: [
          {
            label: '姓名',
            type: 'input',
            propName: 'name',
            queryForm: false,
            dialogForm: true,
            required: true,
            tableCol: true,
            span: 24
          }
        ]
      },
      fileName: '' // 默认文件名
    }
  },
  methods: {
    addProperty() {
      this.entityForm.properties.push({
        label: '姓名',
        type: 'input',
        propName: 'name',
        queryForm: false,
        dialogForm: true,
        required: true,
        tableCol: true,
        span: 24
      })
    },
    insertProps() {
      this.entityForm.properties = []
      for (let i = 0; i < this.propNumber; i++) {
        this.addProperty()
      }
    },
    removeProperty(index) {
      this.entityForm.properties.splice(index, 1)
    },
    copy2Clipboard() {
      const result = this.generateResultVue()
      this.$copyText(result).then(() => {
        this.$message.success('复制成功')
      })
    },
    onPropTypeChange(type, row) {
      if (type === 'areaInput') {
        row.span = 24
        row.tableCol = false
        row.required = false
        row.queryForm = false
      }
    },
    insertTypeProps(item) {
      switch (item.type) {
        // case 'input': return
        case 'select': {
          item.options = []
          item.optionsConfig = { value: 'id', label: 'content' }
          item.changeFn = null
          break
        }
        case 'daterange': {
          item.prop = 'dates'
          item.valueFormat = 'timestamp'
          item.changeFn = this.onDateRangeChange
        }
      }
    },
    generateResultVue() {
      const {
        entityName,
        urlList,
        urlAdd,
        urlEdit,
        urlRemove,
        urlToggle,
        properties
      } = this.entityForm

      const queryForm = {}
      const queryFormItems = []
      const dialogForm = {}
      const dialogFormItems = []
      const tableCols = []

      properties.forEach((prop) => {
        if (prop.queryForm) {
          queryForm[prop.propName] = ''
          const item = {
            label: prop.label,
            type: prop.type,
            prop: prop.propName,
            span: prop.span
          }
          this.insertTypeProps(item)
          queryFormItems.push(item)
        }
        dialogForm[prop.propName] = ''
        if (prop.dialogForm) {
          const item = {
            label: prop.label,
            type: prop.type,
            prop: prop.propName,
            span: prop.span,
            required: prop.required
          }
          this.insertTypeProps(item)
          dialogFormItems.push(item)
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
      queryForm: ${this.stringifyWithoutQuotes(queryForm)},
      queryFormItems: ${this.stringifyWithoutQuotes(queryFormItems)},
      dialogForm: ${this.stringifyWithoutQuotes(dialogForm)},
      dialogFormItems: ${this.stringifyWithoutQuotes(dialogFormItems)},
      tableCols: ${this.stringifyWithoutQuotes(tableCols)},
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
    },
    stringifyWithoutQuotes(obj) {
      // 使用JSON.stringify()先转换为JSON字符串
      const jsonString = JSON.stringify(obj, null, 8)

      // 使用正则表达式替换掉属性值的双引号，注意这可能会导致语法错误如果属性值中包含逗号等特殊字符
      let resultString = jsonString.replace(/"([^"]*)":/g, '$1:')
      resultString = resultString.replace(/,"([^"]*)"/g, ',$1')
      resultString = resultString.replace(/^\{"/, '{').replace(/"\}$/, '}')

      return resultString
    }
  }
}
</script>

<style scoped lang="scss">
.generator {
  padding: 20px;
}
.form-wrapper {
  margin-bottom: 20px;
}
.export-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.props-table{
  ::v-deep{
    .el-input__inner{
      text-align: center;
    }
  }
}
</style>

