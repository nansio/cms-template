<template>
  <div>
    <transition-group>
      <!-- action必选参数, 上传的地址 -->
      <div v-for="(item, inde) in video" :key="item" class="draggable-item">
        <video :src="item" class="avatar ImgStyle" controls="controls">
          您的浏览器不支持视频播放
        </video>
        <div v-if="!disabled" class="shadow" @click="onRemoveHandler(inde)">
          <i class="el-icon-delete" />
        </div>
      </div>
    </transition-group>
    <el-upload v-if="!disabled" name="file" :headers="header" :action="serverUrlTop" :show-file-list="false" list-type="picture-card" :on-success="handleVideoSuccess" :before-upload="beforeUploadVideo" :on-progress="uploadVideoProcess">
      <img v-if="videoFlag == false" class="upDataImg" src="@/assets/pngs/plus.png" alt="">
      <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:12px;" />
    </el-upload>

    <!-- <P class="text" style="color: #999999">支持扩展名：MP4</P> -->
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
    }
  },
  data() {
    return {
      // videoForm: {
      //   video: [...this.value]
      // },
      videoUploadPercent: 0, // 上传进度
      videoFlag: false,
      serverUrlTop: process.env.VUE_APP_BASE_API + '/upload/add', // 上传的图片服务器地址
      header: {
        token: getToken()
      }
    }
  },
  computed: {
    video() {
      return [...this.value]
    }
  },
  methods: {
    handleVideoSuccess(res, file) {
      // 获取上传视频地址
      this.videoFlag = false
      this.videoUploadPercent = 0
      this.video.push(res.data)
      this.$emit('videoData', this.video)
    },
    // 显示进度
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      // this.videoUploadPercent = file.percentage.toFixed(0)
      this.videoUploadPercent = Math.floor(event.percent)
    },
    // 视频上传之前
    beforeUploadVideo(file) {
      const isLt1024M = file.size / 1024 / 1024 / 1024 < 1
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt1024M) {
        this.$message.error('上传视频大小不能超过1024MB哦!')
        return false
      }
    },
    // 視頻删除
    onRemoveHandler(index) {
      this.video.splice(index, 1)
      this.$emit('videoData', this.video)
      this.$message({
        type: 'info',
        message: '已删除原有视频',
        duration: 1000
      })
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
