<template>
  <div class="zupload-component">
    <el-upload
      ref="zupload" :action="url" :headers="header"
      :limit="limit" multiple :accept="accept"
      :http-request="submitFiles" :auto-upload="false"
      :before-upload="beforeUpload" :mode="mode"
      :on-change="onChange" :on-remove="onRemove" :on-exceed="onExceed"
      :file-list="fileList" list-type="picture-card"
    >
      <i class="el-icon-plus" />
      <div v-if="showtip" slot="tip" class="el-upload__tip">{{ tips }}</div>
    </el-upload>
  </div>
</template>

<script>

export default {
  name: 'Zupload',
  props: {
    url: { // 上传的接口地址
      type: String,
      required: false,
      default: ''
    },
    accept: { // 允许上传的文件格式
      type: String,
      required: false,
      default: 'image/jpeg,image/jpg,image/png'
    },
    showtip: { // 是否展示提示信息 默认不展示
      type: Boolean,
      required: false,
      default: false
    },
    limit: {
      type: Number,
      required: false,
      default: 3
    },
    mode: {
      type: String,
      required: false,
      default: 'add'
    },
    doneList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      header: {
        token: this.$store.state.token
      },
      fileList: [], // 用于上传后显示的
      uploadFiles: [], // 用于上传前的文件列表
      fileUrls: []
    }
  },
  computed: {
    disabled: () => {
      return this.mode === 'read'
    }
  },
  created() {
    console.log('this.mode: ', this.mode)
    console.log('this.doneList: ', this.doneList)
    if (this.mode !== 'add') {
      this.fileList = this.doneList
      this.uploadFiles = this.doneList
    }
  },
  methods: {
    beforeUpload() {
      // do nothing...
    },
    onChange(file, fileList) {
      this.uploadFiles = fileList
    },
    onRemove(file, fileList) {
      this.uploadFiles = fileList
    },
    onExceed(files, fileList) {
      this.$notify.warning(`最多只能上传${this.limit}个文件`)
    },
    setFileList(fileList) { // 父组件调用
      // this.fileList = fileList
      this.uploadFiles = fileList
    },
    submitFiles() { // 父组件调用
      console.log('this.uploadFiles:', this.uploadFiles)
      return new Promise((resolve, reject) => {
        if (!this.uploadFiles || this.uploadFiles.length === 0) {
          this.$notify.warning('请先选择文件！')
          reject(false)
        }

        // 将已完成的 url 直接放入
        const finished = this.uploadFiles.filter(file => file.status === 'success')
        console.log('finished:', finished)
        finished.length > 0 && finished.forEach(file => {
          this.fileUrls.push(file.url)
        })
        // 未完成的上传
        const toUploads = this.uploadFiles.filter(file => file.status !== 'success')
        console.log('todos:', toUploads)
        toUploads.length > 0 && toUploads.forEach(file => {
          const form = new FormData()
          form.append('file', file.raw, file.name)
          this.$http.post(this.url, form).then(res => {
            const { data } = res
            this.fileUrls.push(data)
            if (this.fileUrls.length === this.uploadFiles.length) {
              resolve(this.fileUrls)
            }
          }).catch(err => {
            this.$notify.error('文件上传失败...')
            console.log('文件上传失败，err:', err)
            reject(false)
          })
        })
        if (toUploads.length === 0 && finished) {
          resolve(this.fileUrls)
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
