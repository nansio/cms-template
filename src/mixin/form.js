
export default {
  data() {
    return {
      form: {},
      rules: {},
      submitting: false
    }
  },
  methods: {
    getFormDetail() {
      this.$post(this.url.detail, {
        id: this.currentRow[this.tableRowKey]
      }).then(res => {
        this.form = res.data
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
      this.$post(this.url[this.mode], this.form).then(res => {
        this.$message.success('操作成功')
        this.dialogV = false
        this.afterSubmit()
      }).finally(() => (this.submitting = false))
    },
    beforeSubmit() {},
    afterSubmit() {
      this.getTableData()
    }
  }
}
