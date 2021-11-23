<template>
  <div>
    <transition-group>
      <div v-for="(item, inde) in imgData" :key="item" class="draggable-item">
        <el-image class="ImgStyle" :src="item" :preview-src-list="imgData" />
        <div v-if="!disabled" class="shadow" @click="handleRemove(inde)">
          <i class="el-icon-delete" />
        </div>
      </div>
    </transition-group>
    <el-upload v-if="!disabled" ref="upload" class="upload-demo" :show-file-list="false" :action="serverUrlTop" name="file" :headers="header" :on-change="handleChange" accept=".jpg,.jpeg,.png,.gif" :on-success="topUploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture-card">
      <img class="upDataImg" src="@/assets/pngs/plus.png" alt="">
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    index: {
      type: Number,
      default: null,
      required: false
    }
  },
  data() {
    return {
      // imgData: [...this.value],
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [], // 上传图片列表
      serverUrlTop: process.env.VUE_APP_BASE_API + '/upload/add', // 上传的图片服务器地址
      header: {
        token: getToken()
      }
    }
  },
  computed: {
    imgData() {
      return [...this.value]
    }
  },
  methods: {
    // 图片上传成功
    topUploadSuccess(res, file) {
      this.imgData.push(res.data)
      this.emit()
    },
    // 预览图片放大
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 预览图片删除
    handleRemove(index) {
      this.imgData.splice(index, 1)
      this.emit()
      this.$message({
        type: 'info',
        message: '已删除原有图片',
        duration: 1000
      })
    },
    emit() {
      if (this.index !== null) {
        this.$emit('imgData', this.imgData, this.index)
      } else {
        this.$emit('imgData', this.imgData)
      }
    },
    // 图片改变事件
    handleChange(file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-upload--picture-card {
  background: rgba(50, 105, 245, 0.04);
  border-radius: 4px;
  border: 1px solid rgba(49, 104, 245, 0.7);
}
.upDataImg {
  margin-top: 50px;
}

// 过度动画
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateY(80px);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.6s ease;
}
.v-move {
  transition: all 0.6s ease;
}
.v-leave-active {
  position: absolute;
}

.draggable-item {
  float: left;
  width: 150px;
  height: 150px;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  .ImgStyle {
    width: 100%;
    height: 100%;
  }
  .shadow {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    padding: 2px;
    cursor: pointer;
  }
  &:hover {
    .shadow {
      opacity: 1;
    }
  }
}
</style>
