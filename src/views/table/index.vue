<template>
  <div class="system-page supplier-mgmt">
    <div class="content-wrapper">
      <div class="query-form row-between">
        <common-form :form-model="queryForm" size="medium" class="row-left" :form-rule="queryFormRules" label-width="auto" :form-items="queryFormItems" :gutter="10" :form-fn="queryFormFn" />
        <el-button type="primary" plain size="small" @click="onAdd">添加</el-button>
      </div>
      <common-table v-loading="loading" :table-data="tableData" :table-prop="tableCols" :table-page="pagi" />
      <el-dialog :title="dialogT" :visible.sync="dialogV" width="40%" top="10vh">
        <common-form v-if="dialogV" :form-model="form" :disabled="mode==='detail'" :form-items="dialogFormItems" :form-rule="dialogFormRules" :form-fn="dialogFormFn">
          <div slot="formSlot">
            <div class="refund-info required-form-item">退货信息：</div>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="收货人" prop="refundPersonName">
                  <el-input v-model="form.refundPersonName" placeholder="请输入收货人姓名" size="normal" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="refundPhone">
                  <el-input v-model="form.refundPhone" placeholder="请输入收货人手机号码" size="normal" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="退货地址">
              <el-row :gutter="0">
                <el-col :span="8">
                  <el-select v-model="form.province" disabled>
                    <el-option label="江苏省" value="江苏省" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="form.city" disabled>
                    <el-option label="泰兴市" value="泰兴市" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="form.country" disabled>
                    <el-option label="滨江镇" value="滨江镇" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" size="normal" />
            </el-form-item>
          </div>
        </common-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import FormMixin from '@/mixin/form'
import TableMixin from '@/mixin/table'
import regexps from '@/utils/regexps'
export default {
  mixins: [FormMixin, TableMixin],
  data() {
    return {
      loading: false,
      entityName: '供应商',
      queryForm: {
        name: '',
        phone: '',
        contact: ''
      },
      queryFormItems: [
        {
          label: '供应商名称',
          type: 'input',
          prop: 'name',
          span: 8
        },
        {
          label: '手机号',
          type: 'input',
          prop: 'phone',
          span: 8
        },
        {
          label: '联系人姓名',
          type: 'input',
          prop: 'contact',
          span: 8
        }
      ],
      queryFormRules: {},
      queryFormFn: [
        {
          label: '查询',
          size: 'small',
          btnType: 'primary',
          fn: this.doSearch
        }
      ],
      form: {
        address: '',
        bussinessDescription: '',
        city: '泰兴市',
        country: '滨江镇',
        province: '江苏省',
        contact: '',
        headImgList: [],
        name: '',
        phone: '',
        refundPersonName: '',
        refundPhone: '',
        servicePhone: '',
        serviceWx: '',
        supplierId: ''
      },
      dialogFormItems: [
        { label: '供应商名称', type: 'input', prop: 'name', span: 24, maxlength: 20, showWordLimit: true },
        { label: '联系人姓名', type: 'input', prop: 'contact', span: 24, maxlength: 12, showWordLimit: true },
        { label: '手机号', type: 'input', prop: 'phone', span: 24 },
        {
          type: 'upload', span: 24,
          accept: 'png,jpg,jpeg,gif',
          prop: 'headImgList', label: '头像上传',
          imgLimit: 3,
          uploadUrl: '/slideShow/uploadSlideShow'
        },
        { label: '客服号码', type: 'input', prop: 'servicePhone', span: 24 },
        { label: '客服微信', type: 'input', prop: 'serviceWx', span: 24 },
        { label: '主营业务', type: 'input', prop: 'bussinessDescription', span: 24, maxlength: 100, showWordLimit: true }
      ],
      requiredProps: [],
      dialogFormRules: {},
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
        { type: 'index', label: '序号' },
        { type: 'text', label: '供应商名称', prop: 'name' },
        { type: 'text', label: '联系人姓名', prop: 'contact' },
        { type: 'text', label: '手机号', prop: 'phone' },
        { type: 'text', label: '退货地址', prop: 'address' },
        { type: 'operation', label: '操作', width: '230px' }
      ],
      url: {
        list: '/supplier/webGetSupplierPage',
        add: '/supplier/webSaveOrEditSupplier',
        edit: '/supplier/webSaveOrEditSupplier',
        delete: '/supplier/webDeleteSupplier'
      },
      rowKey: 'supplierId'
    }
  },
  created() {
    this.getFormRules()
  },
  methods: {
    getTableData(){},
    onSubmit() {
      this.beforeSubmit()
      this.submitting = true
      this.doSubmit()
    },
    beforeSubmit() {
      this.form.headImgList = this.form.headImgList.map(item => item.url)
    },
    beforeAdd() {
      this.form = {
        address: '',
        bussinessDescription: '',
        city: '泰兴市',
        country: '滨江镇',
        province: '江苏省',
        contact: '',
        headImgList: [],
        name: '',
        phone: '',
        refundPersonName: '',
        refundPhone: '',
        servicePhone: '',
        serviceWx: '',
        supplierId: ''
      }
    },
    formatTableData(tableData) {
      tableData.forEach(row => (row.headImgList = row.headImgList.map(item => ({ name: item, url: item }))))
      return this.insertOperations(tableData)
    },
    insertOperations(arr) {
      arr.forEach(ele => {
        ele.operations = [
          {
            label: '编辑',
            type: 'primary',
            fn: this.onEdit
          },
          {
            label: '删除',
            type: 'danger',
            fn: this.onDelete
          }
        ]
      })
      return arr
    },
    getFormRules() {
      const notRequired = [
        'servicePhone',
        'serviceWx',
        'bussinessDescription'
      ]
      const extraItems = [
        { label: '收货人姓名', prop: 'refundPersonName' },
        { label: '收货人手机号码', prop: 'refundPhone' },
        { label: '详细地址', prop: 'address' }
      ]
      this.requiredItems = this.dialogFormItems.filter(item => !notRequired.includes(item.prop))
      const rules = {}
      this.requiredItems.concat(extraItems).forEach(item => {
        rules[item.prop] = [{ required: true, message: `请输入${item.label}！`, trigger: 'change' }]
      })
      // extra rules
      rules.phone.push({
        pattern: regexps.mobilePhone,
        message: '请输入正确格式的手机号码!',
        trigger: 'change'
      })
      rules.servicePhone = [{
        pattern: regexps.mobilePhone,
        message: '请输入正确格式的手机号码!',
        trigger: 'change'
      }]
      rules.refundPhone.push({
        pattern: regexps.mobilePhone,
        message: '请输入正确格式的手机号码!',
        trigger: 'change'
      })
      this.dialogFormRules = rules
    },
    closeDialog() {
      this.dialogV = false
      this.form = {}
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.system-page {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
  .content-wrapper{
    height: 100%;
    border-radius: 6px;
    background-color: white;
  }
  .query-form {
    height: 50px;
    margin-bottom: 10px;
    // border: 1px solid red;
    ::v-deep {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
::v-deep{
  .required-form-item{
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
    .el-dialog__body{
      padding-bottom: 50px;
      max-height: 75vh;
      overflow: auto;
    }
  }
}
</style>
