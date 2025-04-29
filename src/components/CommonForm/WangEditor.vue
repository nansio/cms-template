<template>
  <div>
    <div class="w-e-for-vue">
      <!-- 工具栏 -->
      <Toolbar class="w-e-for-vue-toolbar" :editor="editor" :mode="mode" :default-config="toolbarConfig" />

      <!-- 编辑器 -->
      <Editor
        v-model="localContent" class="w-e-for-vue-editor" :style="'height: ' + height"
        :disabled="isDisabled"
        :default-config="editorConfig" :mode="mode" @onChange="onChange"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import { i18nChangeLanguage } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { getToken } from '@/utils/auth'
const _this = this
export default {
  name: 'WangEditor',
  components: { Editor, Toolbar },
  // props: [
  //   'editorParams'
  // ],
  props: {
    content: {
      type: String,
      default: () => {
        return ''
      }
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      editor: null, // 富文本编辑器对象
      // localContent: '', // 富文本内容
      placeholder: null, // 富文本占位内容
      // uploadImageUrl: process.env.VUE_APP_UPLOAD_URL + '/file/uploadFile', // 富文本上传图片的地址
      // uploadVideoUrl: process.env.VUE_APP_UPLOAD_URL + '/file/uploadFile', // 富文本上传视频的地址
      // packagePath: 'volunteerActivity/content', //富文本编辑框上传图片、视频的文件夹名称
      height: '300px', // 富文本最小高度
      // isDisabled: false, // 富文本是否禁用
      // 工具栏配置
      toolbarConfig: {
        // toolbarKeys: [], // 显示指定的菜单项
        excludeKeys: [] // 隐藏指定的菜单项
      },
      // 编辑器配置
      editorConfig: {
        placeholder: '请输入内容......',
        MENU_CONF: {
          uploadImage: {
            fieldName: 'file', // 文件字段名， 默认值 'wangeditor-uploaded-image'
            maxFileSize: 10 * 1024 * 1024, // 单个文件的最大体积限制，默认为 2M，此次设置为 1M
            maxNumberOfFiles: 10, // 最多可上传几个文件，默认为 100
            allowedFileTypes: ['image/*'], // 选择文件时的类型限制，默认为 ['image/*'] ，若不想限制，则设置为 []
            meta: {
              // 自定义上传参数，例如传递验证的 token 等，参数会被添加到 formData 中，一起上传到服务端
              // path: 'volunteerActivity/content'
            },
            metaWithUrl: false, // 将 meta 拼接到 URL 参数中，默认 false
            headers: {
              // 设置 HTTP 请求头信息
              token: getToken()
            },
            // server: process.env.VUE_APP_UPLOAD_URL + '/file/uploadFile', // 上传图片接口地址
            server: process.env.VUE_APP_UPLOAD_URL + '/file/uploadFile',
            withCredentials: false, // 跨域是否传递 cookie ，默认为 false
            timeout: 5 * 1000, // 超时时间，默认为 10 秒，此次设置为 5 秒
            // 小于该值就插入 base64 格式（而不上传），默认为 0
            base64LimitSize: 5 * 1024, // 5kb
            async customInsert(res, insertFn) {
              // res 即服务端的返回结果
              // console.log("上传图片的结果：", res)
              // 从 res 中找到 url alt href ，然后插入图片
              insertFn(res.data, '', '')
            },
            // 上传之前触发
            onBeforeUpload(file) {
              return file
            },
            // 上传进度的回调函数
            onProgress(progress) {
              console.log('progress', progress)
            },
            // 单个文件上传成功之后
            onSuccess(file, res) {
              console.log(`${file.name} 上传成功`, res)
            },
            // 单个文件上传失败
            onFailed(file, res) {
              console.log(`${file.name} 上传失败`, res)
              _this.$modal.msgError(`${file.name} 上传失败!`)
            },

            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
              console.log(`${file.name} 上传出错`, err, res)
              // 如果异常为文件超出限制，提示用户
              if (err.message.indexOf('exceeds maximum')) {
                const msg = `文件${file.name} 上传出错，超过图片大小的限制，图片限制在${2 * 1024 * 1024 / (1024 * 1024)} mb以内。`
                _this.$modal.msgError(msg)
              } else {
                _this.$modal.msgError(`${file.name} 上传出错,请联系管理员.`)
              }
            }
          },
          uploadVideo: {
            server: process.env.VUE_APP_UPLOAD_URL + '/file/uploadFile',
            timeout: 5 * 1000, // 5s
            fieldName: 'file',
            meta: {
              // path: 'volunteerActivity/content'
            },
            metaWithUrl: false, // join params to url
            headers: {
              // 设置 HTTP 请求头信息
              token: getToken()
            },
            maxNumberOfFiles: 1,
            maxFileSize: 2 * 1024 * 1024, // 10M
            async customInsert(res, insertFn) {
              // res 即服务端的返回结果
              // console.log("上传图片的结果：", res)
              // 从 res 中找到 url alt href ，然后插入图片
              insertFn(res.data, '', '')
            },
            onBeforeUpload(file) {
              console.log('onBeforeUpload', file)
              return file // will upload this file
              // return false // prevent upload
            },
            onProgress(progress) {
              console.log('onProgress', progress)
            },
            onSuccess(file, res) {
              console.log('onSuccess', file, res)
            },
            onFailed(file, res) {
              console.log('onFailed', file, res)
            },
            onError(file, err, res) {
              console.log(`${file.name} 上传出错`, err, res)
              // 如果异常为文件超出限制，提示用户
              if (err.message.indexOf('exceeds maximum')) {
                const msg = `视频${file.name} 上传出错，超过视频大小的限制，视频限制在${2 * 1024 * 1024 / (1024 * 1024)} mb以内。`
                _this.$modal.msgError(msg)
              } else {
                _this.$modal.msgError(`${file.name} 上传出错,请联系管理员.`)
              }
            }
          }
        },
        maxLength: 2000
      },
      mode: 'default' // or 'default'
    }
  },
  computed: {
    localContent: {
      get() {
        return this.content
      },
      set(newVal) {
        if (newVal === '<p><br></p>') {
          this.$emit('change', '')
        } else {
          this.$emit('change', newVal)
        }
      }
    }
  },
  mounted() {
    this.setSpellCheckFasle() // 设置拼写检查 spellcheck 为假
    document.activeElement.blur() // 取消富文本自动聚焦且禁止虚拟键盘弹出
  },
  /**
   * 销毁富文本编辑器
   */
  beforeDestroy() {
    const editor = this.editor
    if (editor != null) {
      editor.destroy()
    }
  },
  methods: {
    /**
     * 实例化富文本编辑器
     * 文档链接：https://www.wangeditor.com/
     */
    onCreated(editor) {
      this.editor = Object.seal(editor)
      // this.setIsDisabled()
    },

    /**
     * 监听富文本编辑器
     */
    onChange() {
      // console.log('change', this.localContent)
      // this.$emit('change', this.localContent)
      // console.log('onChange =>', editor.getHtml())
    },

    /**
     * this.editor.getConfig().spellcheck = false
     * 由于在配置中关闭拼写检查，值虽然设置成功，但是依然显示红色波浪线
     * 因此在富文本编辑器组件挂载完成后，操作 Dom 元素设置拼写检查 spellcheck 为假
     */
    async setSpellCheckFasle() {
      const doms = await document.getElementsByClassName('w-e-scroll')
      for (const vo of doms) {
        if (vo) {
          if (vo.children.length > 0) {
            vo.children[0].setAttribute('spellcheck', 'false')
          }
        }
      }
    },

    /**
     * 设置富文本是否禁用
     */
    // async setIsDisabled() {
    //   //console.log('setIsDisabled',this.editor,this.isDisabled)
    //   if (this.editor) {
    //     this.isDisabled ? (this.editor.disable()) : (this.editor.enable())
    //   }
    // },
    /**
     * 获取编辑器文本内容
     */
    getEditorText() {
      const editor = this.editor
      if (editor != null) {
        return editor.getText()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.w-e-full-screen-container {
  z-index: 99;
}

.w-e-for-vue {
  margin: 0;
  border: 1px solid #ccc;

  .w-e-for-vue-toolbar {
    border-bottom: 1px solid #ccc;
  }

  .w-e-for-vue-editor {
    height: auto;

    .w-e-text-container {

      .w-e-text-placeholder {
        top: 6px;
        color: #666;
      }

      pre {

        code {
          text-shadow: unset;
        }
      }

      p {
        margin: 5px 0;
        font-size: 14px; // 设置编辑器的默认字体大小为14px
      }
    }
  }
}
</style>
