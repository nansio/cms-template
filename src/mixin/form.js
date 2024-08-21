
export default {
  data() {
    return {
      dialogForm: {},
      rules: {},
      submitting: false
    }
  },
  methods: {
    getFormDetail() {
      this.$post(this.url.detail, {
        id: this.currentRow[this.tableRowKey]
      }).then(res => {
        this.dialogForm = res.data
      })
    },
    onSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.beforeSubmit()
          this.submitting = true
          this.doSubmit()
        }
      })
    },
    doSubmit() {
      this.$post(this.url[this.mode], this.dialogForm).then(res => {
        this.$message.success('操作成功')
        this.dialogV = false
        this.afterSubmit()
      }).finally(() => (this.submitting = false))
    },
    beforeSubmit() {},
    afterSubmit() {
      this.getTableData()
    },
    onDateRangeChange(arr) {
      this.dialogForm.startTime = arr[0]
      this.dialogForm.endTime = arr[1]
    }
  }
}
