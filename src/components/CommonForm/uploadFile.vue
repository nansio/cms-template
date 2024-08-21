<template>
  <div class="form-upload-file">
    <el-upload
      :id="uploadId"
      :ref="formItem.prop + 'upload'"
      :multiple="true"
      :action="formItem.action ? formItem.action : ''"
      :list-type="formItem.listType || 'picture-card'"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleImageRemove"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="imageChange"
      :limit="formItem.imgLimit"
      :on-exceed="handleExceed"
      :drag="formItem.drag"
      :http-request="httpRequest"
    >
      <template v-if="formItem.listType">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </template>
      <template v-else>
        <i class="el-icon-plus" />
      </template>
      <div slot="tip" class="el-upload__tip">
        <span v-if="formItem.imgSizeLimit">小于{{ formItem.imgSizeLimit }}mb,</span><span v-if="formItem.accept">支持{{ formItem.accept }}格式</span>
        <span> {{ formItem.imgLimit ? '(' + fileList.length + '/' + formItem.imgLimit + ')' : '' }}</span>
      </div>
    </el-upload>
    <!-- 图片预览 -->
    <el-dialog custom-class="upload-file-review" :visible.sync="dialog_pic_visible" title="预览" append-to-body width="600px">
      <template v-if="'.mp4.MP4.avi.AVI.wmv.WMV.mov.MOV.flv.FLV.rmvb.RMVB'.indexOf(dialog_imageUrl.split('.')[dialog_imageUrl.split('.').length - 1]) > -1">
        <video :src="dialog_imageUrl" controls />
      </template>
      <template v-else>
        <el-image :src="dialog_imageUrl" style="width: 100%; height: 100%" fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import { uploadFileGetFileNameAndUrl } from '@/api/files'
/* eslint-disable */
export default {
  props: {
    formItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    initFileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    uploadId() {
      return this.formItem.prop + 'uploadId' + Math.random()
    }
  },
  data() {
    return {
      fileList: [],
      //图片预览属性
      dialog_imageUrl: '',
      dialog_pic_visible: false
    }
  },
  mounted() {
    this.fileList = this.initFileList
    this.monitorFileList(this.fileList)
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialog_imageUrl = file.url
      this.dialog_pic_visible = true
    },
    handleImageRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('fileChange', fileList)
      this.monitorFileList(fileList)
    },
    handleExceed() {
      if (this.formItem.accept.indexOf('jpg') > -1) {
        this.$message.warning(`当前限制选择图片${this.formItem.imgLimit}张`)
      } else {
        this.$message.warning(`当前限制选择文件${this.formItem.imgLimit}个`)
      }
    },
    imageChange(file, fileList) {
      // 检验文件名重复
      let flag = this.fileList.some(item => {
        return item.name == file.name
      })
      if (flag) {
        this.$message.error('上传文件名称重复!')
        fileList.splice(-1, 1)
        return
      }
      // 检验文件名长度
      let fname = file.name.split('.')
      if (fname && fname[0].length > 20) {
        fileList.splice(-1, 1)
        this.$message.error('文件名称应该小于20个字符!')
        return
      }
      // 校验文件格式是否符合要求(由于文件格式有人喜欢用大写字母，有人喜欢用小写字母，所以这里大小写都考虑进去)
      // console.log()
      const fileType = file.raw.type.split('/')[1]
      const lowImgType = fileType ? fileType.toLowerCase() : null
      const upImgType = fileType ? fileType.toUpperCase() : null
      const isImage =
        this.formItem.accept.indexOf(lowImgType) > -1 || this.formItem.accept.indexOf(upImgType) > -1 ? true : false
      if (!isImage) {
        this.$message.error(`上传只能是${this.formItem.accept}格式文件!`)
      }
      // 校验文件大小是否符合要求
      const isLt2M = this.formItem.imgSizeLimit ? file.size < this.formItem.imgSizeLimit * 1024 * 1024 : true
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${this.formItem.imgSizeLimit}MB!`)
      }
      if (isImage && isLt2M) {
        this.fileList = fileList
      } else {
        fileList.splice(-1, 1)
        return
      }
      this.fileList = fileList
      this.monitorFileList(fileList)
      this.$emit('fileChange', fileList)
    },
    monitorFileList(fileList) {
      // 监听文件列表长度
      // 如果有文件数量限制的话,且上传的文件是图片
      if (this.formItem.imgLimit && this.formItem.accept.indexOf('jpg') > -1) {
        if (fileList.length === this.formItem.imgLimit) {
          // 如果文件列表的文件数量等于限制的文件数量，则隐藏上传的按钮
          const parent = document.getElementById(this.uploadId)
          const child = parent.getElementsByClassName('el-upload--picture-card')[0]
          child.style.display = 'none'
        } else {
          const parent = document.getElementById(this.uploadId)
          const child = parent.getElementsByClassName('el-upload--picture-card')[0]
          child.style.display = 'inline-block'
          // setTimeout(() => {
          //   child.style.display = 'inline-block'
          // }, 1000)
        }
      }
    },
    httpRequest() {
      // const fileList = this.formItem.fileList
      if (this.fileList.length < 1) {
        return new Promise(resolve => {
          resolve({ fileList: [], prop: this.formItem.prop })
        })
      } else {
        const requestArr = this.fileList.map(file => {
          if (!file.url || file.url.indexOf('blob') !== -1) {
            let formData = new FormData()
            formData.append('file', file.raw)
            if (this.formItem.uploadUrl) {
              return this.$http({
                url: this.formItem.uploadUrl,
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
              })
            } else {
              return uploadFileGetFileNameAndUrl(formData)
            }
          } else {
            return new Promise((resolve, reject) => {
              resolve(file)
            })
          }
        })
        return new Promise((resolve, reject) => {
          Promise.all(requestArr).then(res => {
            // 得出一个新的fileList,并赋值给fileList
            this.fileList = []
            res.forEach(ele => {
              // 如果ele这个对象中有code,flag,message,data这四个对象，说明他是由接口返回的数据结构，取fileName和url时，路径为ele.data.fileName，ele.data.url
              // 反之，则去ele.fileName,ele.url
              let obj = {}
              if (ele.code) {
                obj = {
                  fileName: Date.now().toString(),
                  url: ele.data
                }
              } else {
                obj = {
                  fileName: ele.fileName ? ele.fileName : Math.random().toString(),
                  url: ele.url
                }
              }
              this.fileList.push(obj)
            })
            resolve({ fileList: this.fileList, prop: this.formItem.prop })
          })
        })
      }
    },
    // 上传文件返回文件名称和路径
    uploadFileGetFileNameAndUrl(data) {
      this.$axios.request({
        url: '/file/uploadFileGetFileNameAndUrl',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      })
    }
  }
}
</script>

<style lang="scss">
.form-upload-file {
  min-height: 195px;
  .el-upload__tip {
    margin-top: 0px;
    font-size: 14px;
    line-height: 20px;
  }
  .el-upload-list__item {
    transition: none !important;
    -webkit-transition: none !important;
  }

  .el-upload-list__item-name {
    transition: none !important;
    -webkit-transition: none !important;
  }
  
}
.upload-file-review {
  video {
    width: 100%;
  }
}
</style>