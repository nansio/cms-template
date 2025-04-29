<template>
  <div class="form-upload-file">
    <el-upload
      v-if="isShow"
      :id="uploadId"
      :ref="formItem.prop + 'upload'"
      :multiple="true"
      :headers="formItem.headers || {
        token: getToken()
      } "
      :action="formItem.action || VUE_APP_BASE_API"
      :list-type="formItem.listType || 'picture-card'"
      :on-preview="handlePictureCardPreview"
      :on-success="onFileSuccess"
      :on-remove="handleImageRemove"
      :file-list="fileList"
      :on-change="imageChange"
      :limit="formItem.limit"
      :on-exceed="handleExceed"
      :drag="formItem.drag"
    >
      <template v-if="formItem.listType">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </template>
      <template v-else>
        <i class="el-icon-plus" />
      </template>
      <div slot="tip" class="el-upload__tip">
        <span v-if="formItem.dimensionPic">建议图片尺寸为{{ formItem.dimensionPic }},</span>
        <span v-if="formItem.dimensionVideo">建议视频比例为{{ formItem.dimensionVideo }},</span>
        <span v-if="formItem.fileSizeLimit">小于{{ formItem.fileSizeLimit }}MB,</span><span v-if="formItem.accept">仅支持{{ formItem.accept }}格式</span>
        <span> {{ formItem.limit ? '(' + fileList.length + '/' + formItem.limit + ')' : '' }}</span>
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
import { getToken } from '@/utils/auth'
/* eslint-disable */
export default {
  props: {
    formItem: {
      type: Object,
      default: () => {
        return {
          listType: 'picture-card'
        }
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
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API + '/file/uploadFile',
      isShow: true,
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
    getToken() {
      return getToken()
    },
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
        this.$message.warning(`当前限制选择图片${this.formItem.limit}张`)
      } else {
        this.$message.warning(`当前限制选择文件${this.formItem.limit}个`)
      }
    },
    imageChange(file, fileList) {
      
    },
    // 这个方法用于设置当前的上传图片功能中显示已上传的图片列表
    onFileSuccess(response, file, fileList) {
      // 检验文件名重复
      let flag = this.fileList.some(item => {
        return item.name == file.name
      })
      if (flag) {
        this.$message.error('上传文件名称重复!')
        fileList.splice(-1, 1)
        return
      }
      // 校验文件格式是否符合要求(由于文件格式有人喜欢用大写字母，有人喜欢用小写字母，所以这里大小写都考虑进去)
      const fileType = file.raw.type.split('/')[1]
      let lowImgType = fileType ? fileType.toLowerCase() : null
      let upImgType = fileType ? fileType.toUpperCase() : null
      // docx文件特殊，他的实际格式为vnd.openxmlformats-officedocument.wordprocessingml.document
      if (lowImgType === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
        lowImgType = 'docx'
      }
      if (upImgType === 'VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT') {
        upImgType = 'DOCX'
      }
      // console.log(file)
      // console.log(this.formItem.accept, '++++++++++', lowImgType, '***********', upImgType)
      const isImage = this.formItem.accept.indexOf(lowImgType) > -1 || this.formItem.accept.indexOf(upImgType) > -1 ? true : false
      if (!isImage) {
        this.$message.error(`上传只能是${this.formItem.accept}格式文件!`)
      }
      // 校验文件大小是否符合要求
      const isLt2M = this.formItem.fileSizeLimit ? file.size < this.formItem.fileSizeLimit * 1024 * 1024 : true
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${this.formItem.fileSizeLimit}MB!`)
      }
      if (isImage && isLt2M) {
        this.fileList = fileList
      } else {
        fileList.splice(-1, 1)
        return
      }
      // 这里统一把fileList中所有元素格式变成{fileName: '', url: '', status: '', }
      this.fileList = fileList.map(ele => {
        return {
          name: ele.name || ele.fileName,
          url: ele.response ? ele.response.data : ele.url,
          size: ele.size ? ele.size : '',
          status: 'success'
        }
      })
      this.monitorFileList(this.fileList)
      this.$emit('fileChange', this.fileList)
    },
    // 这个方法用于控制图片上传时，显示和隐藏上传大按钮。如果没有上传预览功能，只是把上传的文件用一个列表展示，那么就不执行这个方法
    monitorFileList(fileList) {
      if (this.formItem.listType === 'text') return
      // 监听文件列表长度
      // 如果有文件数量限制的话,且上传的文件是图片
      if (this.formItem.limit && (this.formItem.accept.indexOf('jpg') > -1 || this.formItem.accept.indexOf('png') > -1 || this.formItem.accept.indexOf('jpeg') > -1)) {
        if (fileList.length === this.formItem.limit) {
          // 如果文件列表的文件数量等于限制的文件数量，则隐藏上传的按钮
          const parent = document.getElementById(this.uploadId)
          const child = parent.getElementsByClassName('el-upload--picture-card')[0]
          child.style.display = 'none'
        } else {
          const parent = document.getElementById(this.uploadId)
          const child = parent.getElementsByClassName('el-upload--picture-card')[0]
          child.style.display = 'inline-block'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.form-upload-file {
  // min-height: 22px;
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