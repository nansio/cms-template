
export default {
  data() {
    return {
      ApiPost: function() {},
      loading: false,
      tableData: [],
      currentRow: {},
      pagi: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      url: {
        add: '',
        edit: '',
        detail: '',
        list: '',
        delete: ''
      },
      mode: 'add',
      queryForm: {},
      dialogV: false,
      row: null,
      imgList: [],
      fileList: [],
      defaultGetTableData: true,
      rowKey: 'id' // 用于详情接口请求的参数 防止后端接口参数名不统一
    }
  },
  computed: {
    dialogT() {
      if (this.mode === 'add') return `新增${this.entityName}`
      if (this.mode === 'edit') return `编辑${this.entityName}`
      if (this.mode === 'detail') return `查看${this.entityName}`
    }
  },
  created() {
    this.defaultGetTableData && this.getTableData()
  },
  methods: {
    doSearch() {
      this.pagi.pageNo = 1
      this.getTableData()
    },
    getTableData() {
      this.loading = true
      const payload = {
        ...this.queryForm,
        pageNo: this.pagi.pageNo,
        pageSize: this.pagi.pageSize
      }
      const formattedPayload = this.formatQueryFormParams(payload)
      this.ApiPost(this.url.list, formattedPayload).then(res => {
        this.loading = false
        this.tableData = this.formatTableData(res.data.records)
        this.pagi.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    formatQueryFormParams(payload) {
      return payload
    },
    formatTableData(tableData) {
      return this.insertOperations(tableData)
    },
    insertOperations(tableData) {
      return tableData
    },
    beforeAdd() {},
    onAdd() {
      this.mode = 'add'
      this.currentRow = {}
      this.dialogForm = {}
      this.resetDialogForm()
      this.beforeAdd()
      this.dialogV = true
    },
    onEdit(row) {
      this.mode = 'edit'
      this.currentRow = row
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.formatFormDetails()
      this.dialogV = true
    },
    onDetail(row) {
      this.mode = 'detail'
      this.currentRow = row
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.formatFormDetails()
      this.dialogV = true
    },
    onDelete(row) {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        params[this.rowKey] = row[this.rowKey]
        this.ApiPost(this.url.delete, null, { params }).then(res => {
          if (res.flag) {
            this.getTableData()
            this.$message.success('操作成功')
          }
        })
      }).catch(() => this.$message.info('已取消删除!'))
    },
    formatFormDetails() {
      // format form properties
    },
    resetSearchForm() {
      this.$refs.queryFormRef.resetFields()
      this.doSearch()
    },
    toggleState(row) {
      this.$confirm(`此操作将${row.pubStatus ? '下架' : '发布'}该${this.entityName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        params[this.rowKey] = row[this.rowKey]
        this.ApiPost(this.url.toggleState, null, params).then(res => {
          this.$message.success('操作成功')
          this.getTableData()
        })
      })
    },
    onSizeChange(val) {
      this.pagi.pageNo = 1
      this.pagi.pageSize = val
      this.getTableData()
    },
    onPageChange(val) {
      this.pagi.pageNo = val
      this.getTableData()
    },
    closeDialog() {
      this.dialogV = false
      this.resetDialogForm()
      // this.$refs.dialogFormRef.resetFields()
      this.getTableData()
    },
    resetDialogForm() {
    }
  }
}
