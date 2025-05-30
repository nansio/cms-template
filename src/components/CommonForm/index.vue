<template>
  <div class="common-form">
    <el-form
      ref="commonForm"
      :disabled="disabled"
      :model="localFormModel"
      :rules="localFormRule"
      :label-position="labelPosition"
      :label-width="labelWidth"
    >
      <el-row :gutter="gutter">
        <template v-for="(formItem, formItemIndex) in formItems">
          <el-col
            :key="formItemIndex"
            :span="formItem.span ? formItem.span : 24"
            :class="'el-col-' + formItem.prop"
            :style="formItem.colStyle"
          >
            <el-form-item
              v-if="formItem.type === 'slot'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <slot :name="formItem.prop" />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'input'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="[
                formItem.prop,
                formItem.popTitle ? 'poptitle-el-form-item' : '',
              ]"
            >
              <el-input
                v-model="localFormModel[formItem.prop]"
                :placeholder="formItem.placeholder? formItem.placeholder:'请输入' + formItem.label"
                :disabled="
                  formItem.isDisabled === undefined
                    ? false
                    : formItem.isDisabled
                "
                :maxlength="formItem.maxlength"
                show-word-limit
                :show-password="formItem.showPassword"
                clearable
                :readonly="formItem.readonly"
                @input="
                  (val) => {
                    return formItem.inputFn ? formItem.inputFn(val) : null;
                  }
                "
                @focus="
                  (event) => {
                    return formItem.focusFn ? formItem.focusFn(event) : null;
                  }
                "
              />
              <span v-if="formItem.popTitle" class="popTitle">{{
                formItem.popTitle
              }}</span>
            </el-form-item>
            <!-- 新加一个input类型，此功能目前只在平台配置-系统权限管理中的ACCESS_TOKEN使用,由于业务要求这个输入框为密码框，只读。 -->
            <el-form-item
              v-if="formItem.type === 'passwordReadonly'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="[
                formItem.prop,
                formItem.popTitle ? 'poptitle-el-form-item' : '',
                'passwordReadonly'
              ]"
            >
              <el-input
                v-model="localFormModel[formItem.prop]"
                :placeholder="formItem.placeholder? formItem.placeholder:'请输入' + formItem.label"
                :disabled=" formItem.isDisabled === undefined ? false : formItem.isDisabled"
                show-word-limit
                :show-password="formItem.isPassword"
                :readonly="formItem.readonly"
              />
              <i class="el-icon-view" @click="formItem.isPassword = !formItem.isPassword" />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'mapInput'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="[
                formItem.prop,
                formItem.popTitle ? 'poptitle-el-form-item' : '',
              ]"
            >
              <el-input
                v-model="localFormModel[formItem.prop]"
                :placeholder="'请输入' + formItem.label"
                :disabled="
                  formItem.isDisabled === undefined
                    ? false
                    : formItem.isDisabled
                "
                :maxlength="formItem.maxlength"
                show-word-limit
                :show-password="formItem.showPassword"
                clearable
                @input="
                  (val) => {
                    return formItem.inputFn ? formItem.inputFn(val) : null;
                  }
                "
                @focus="
                  (event) => {
                    isShowMap = true;
                    return formItem.focusFn ? formItem.focusFn(event) : null;
                  }
                "
              />
              <span v-if="formItem.popTitle" class="popTitle">{{
                formItem.popTitle
              }}</span>
              <!-- 这里是表单中弹出的地图弹框 -->
              <drag-dialog
                v-if="isShowMap"
                :title="formItem.mapTitle || '地图'"
                :width="formItem.mapWidth || '500px'"
                :position="formItem.mapPosition || 'right-bottom'"
                @close="isShowMap = false"
              >
                <form-map
                  v-if="isShowMap"
                  :height="formItem.mapHeight || '400px'"
                  :lnglat="
                    localFormModel[formItem.prop]
                      ? localFormModel[formItem.prop].split(',')
                      : []
                  "
                  :prop-name="formItem.prop"
                  @getPoint="getMapPoint"
                />
              </drag-dialog>
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'areaInput'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-input
                v-model="localFormModel[formItem.prop]"
                type="textarea"
                :placeholder="
                  formItem.placeholder
                    ? formItem.placeholder
                    : '请输入' + formItem.label
                "
                :autosize="{ minRows: 4, maxRows: 6 }"
                :disabled="
                  formItem.isDisabled === undefined
                    ? false
                    : formItem.isDisabled
                "
                :maxlength="formItem.maxlength"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'select'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-select
                v-model="localFormModel[formItem.prop]"
                :placeholder="'请选择' + formItem.label"
                :disabled="
                  formItem.isDisabled === undefined
                    ? false
                    : formItem.isDisabled
                "
                :filterable="formItem.filterable"
                :remote="formItem.remote"
                :remote-method="
                  (val) => {
                    return formItem.remoteMethod
                      ? formItem.remoteMethod(val)
                      : null;
                  }
                "
                :multiple="formItem.multiple"
                :collapse-tags="formItem.collapseTags"
                clearable
                @change="
                  (val) => {
                    return formItem.changeFn
                      ? formItem.changeFn(val, formItem.options)
                      : null;
                  }
                "
              >
                <el-option
                  v-for="(optionItem, optionIndex) in formItem.options"
                  :key="optionIndex"
                  :label="
                    formItem.optionsConfig
                      ? optionItem[formItem.optionsConfig.label]
                      : optionItem.label
                  "
                  :value="
                    formItem.optionsConfig
                      ? optionItem[formItem.optionsConfig.value]
                      : optionItem.value
                  "
                />
              </el-select>
              <slot :name="formItem.prop + '_slot'" />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'selectTree'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-select
                :ref="'out' + formItem.prop"
                v-model="localFormModel[formItem.prop]"
                :disabled="
                  formItem.isDisabled === undefined
                    ? false
                    : formItem.isDisabled
                "
                :placeholder="'请选择' + formItem.label"
                popper-class="select-tree-popper"
                clearable
                @clear="clear(formItem.prop)"
                @change="(val) => { formItem.changeFn(val) || null }"
              >
                <el-option
                  v-for="(item, index) in formselectData(
                    formItem.options,
                    formItem.treeprops
                  )"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  style="display: none"
                />
                <div class="select-tree-content">
                  <el-tree
                    :ref="'tree' + formItem.prop"
                    class="form-common-tree"
                    :expand-on-click-node="false"
                    :data="formatTreeData(formItem.options, formItem.treeprops)"
                    :node-key="formItem.treeprops.nodeKey"
                    :check-strictly="true"
                    :default-expanded-keys="
                      localFormModel[formItem.prop]
                        ? [localFormModel[formItem.prop]]
                        : []
                    "
                    :default-checked-keys="
                      localFormModel[formItem.prop]
                        ? [localFormModel[formItem.prop]]
                        : []
                    "
                    :highlight-current="true"
                    :current-node-key="localFormModel[formItem.prop]"
                    :props="formItem.treeprops"
                    default-expand-all
                    @node-click="
                      (data, node) => {
                        return handleNodeClick(
                          formItem.prop,
                          formItem.treeprops,
                          formItem,
                          data,
                          node
                        );
                      }
                    "
                  />
                </div>
              </el-select>
              <slot :name="formItem.prop + '_slot'" />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'inputNumber'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-input-number
                v-model="localFormModel[formItem.prop]"
                :min="formItem.min"
                :max="formItem.max"
                label=""
                :controls="formItem.hideControls === undefined ? true : formItem.hideControls"
                :step="formItem.step"
                :precision="formItem.precision ? formItem.precision : 0"
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'checkBox'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-checkbox-group
                v-model="localFormModel[formItem.prop]"
                size="mini"
                :disabled="formItem.isDisabled"
              >
                <el-checkbox
                  v-for="(optionItem, checkboxIndex) in formItem.options"
                  :key="checkboxIndex"
                  :label="
                    formItem.optionsConfig
                      ? optionItem[formItem.optionsConfig.value]
                      : optionItem.value
                  "
                  :border="formItem.border"
                >
                  {{
                    formItem.optionsConfig
                      ? optionItem[formItem.optionsConfig.label]
                      : optionItem.label
                  }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'switch'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-switch
                v-model="localFormModel[formItem.prop]"
                :active-color="formItem.activeColor || '#13ce66'"
                :inactive-color="formItem.inactiveColor || '#ff4949'"
                :active-text="formItem.activeText || ''"
                :inactive-text="formItem.inactiveText || ''"
                :active-value="formItem.activeValue || 1"
                :inactive-value="formItem.inactiveValue || 0"
                @change="formItem.change"
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'radio'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-radio-group
                v-model="localFormModel[formItem.prop]"
                :disabled="formItem.isDisabled"
                size="mini"
                @input="formItem.input"
              >
                <el-radio
                  v-for="(optionItem, checkboxIndex) in formItem.options"
                  :key="checkboxIndex"
                  :label="
                    formItem.optionsConfig
                      ? optionItem[formItem.optionsConfig.value]
                      : optionItem.value
                  "
                  :border="formItem.border"
                >
                  {{
                    formItem.optionsConfig
                      ? optionItem[formItem.optionsConfig.label]
                      : optionItem.label
                  }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'daterange'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-date-picker
                v-model="localFormModel[formItem.prop]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :format="formItem.format ? formItem.format : ''"
                :value-format="
                  formItem.valueFormat
                    ? formItem.valueFormat
                    : 'yyyy-MM-dd hh:mm:ss'
                "
                @change="
                  (val) => {
                    return formItem.changeFn ? formItem.changeFn(val) : null;
                  }
                "
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'date'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-date-picker
                v-model="localFormModel[formItem.prop]"
                type="date"
                placeholder="选择日期"
                :format="formItem.format ? formItem.format : ''"
                :value-format="
                  formItem.valueFormat ? formItem.valueFormat : 'yyyy-MM-dd'
                "
                :picker-options="formItem.pickerOptions"
                @change="
                  (val) => {
                    return formItem.changeFn ? formItem.changeFn(val) : null;
                  }
                "
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'datetime'"
              :label="formItem.label"
              :prop="formItem.prop"
              :class="formItem.prop"
            >
              <el-date-picker
                v-model="localFormModel[formItem.prop]"
                type="datetime"
                placeholder="选择日期时间"
                :format="formItem.format ? formItem.format : ''"
                :value-format="
                  formItem.valueFormat
                    ? formItem.valueFormat
                    : 'yyyy-MM-dd hh:mm:ss'
                "
                @change="
                  (val) => {
                    return formItem.changeFn ? formItem.changeFn(val) : null;
                  }
                "
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'upload'"
              :key="formItemIndex"
              :label="formItem.label"
              :prop="formItem.prop"
              :disabled="
                formItem.isDisabled === undefined ? false : formItem.isDisabled
              "
              :class="formItem.prop"
            >
              <UploadImg
                v-if="isShowUpload"
                :ref="`upliadFile${formItem.prop}`"
                :form-item="formItem"
                :init-file-list="localFormModel[formItem.prop]"
                @fileChange="
                  val => {
                    fileChange(val, formItem.prop)
                  }
                "
              />
            </el-form-item>
            <el-form-item
              v-if="formItem.type === 'wangEditor'"
              :key="formItemIndex"
              :label="formItem.label"
              :prop="formItem.prop"
              :disabled="
                formItem.isDisabled === undefined ? false : formItem.isDisabled
              "
              :class="formItem.prop"
            >
              <WangEditor :ref="formItem.prop" :content="localFormModel[formItem.prop]" :is-disabled="formItem.isDisabled" @change="(val) => {wangEditorChange(val, formItem.prop)}" />
            </el-form-item>
            <el-form-item v-if="formItem.type === 'empty'">
              <!-- 这个input用来占位,如果不用el-input占位，就不好设置empty类型的el-form-item，可能会导致页面样式混乱 -->
              <el-input style="visibility: hidden" />
            </el-form-item>
            <div v-if="formItem.type === 'slotLabel'">
              <p class="slotLabel">{{ formItem.label }}</p>
            </div>
            <!-- <el-form-item v-if="formItem.type === 'operation'">
              <template v-for="(ele, eleIndex) in operation.options">
                <el-button v-if="ele.isShow === undefined || ele.isShow === true" :size="ele.size" :type="ele.type" v-noMoreClick @click="btnCkick(ele)" :key="eleIndex">{{ ele.label }}</el-button>
              </template>
            </el-form-item> -->
          </el-col>
        </template>

      </el-row>
      <slot />
    </el-form>
    <div v-if="!disabled" class="operationBtn">
      <template v-for="(fnItem, fnIndex) in formFn">
        <el-button
          v-if="fnItem.isShow === undefined || fnItem.isShow === true"
          :key="fnIndex"
          v-noMoreClick
          :size="fnItem.size"
          :type="fnItem.btnType"
          @click="btnCkick(fnItem)"
        >
          {{ fnItem.label }}</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import UploadImg from './uploadFile.vue'
import DragDialog from './DragDialog.vue'
import FormMap from './formMap.vue'
import WangEditor from './WangEditor.vue'
export default {
  components: {
    UploadImg,
    FormMap,
    DragDialog,
    WangEditor
  },
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    formRule: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formFn: {
      type: Array,
      default: () => {
        return []
      }
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    gutter: {
      type: Number,
      default: 70
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowUpload: false, // 由于上传组件要显示初始文件，要先加载数据，再加载节点才能正常显示，就在这里统一控制同步加载
      isShowMap: false,
      carrierType: '' // 特定业务使用
    }
  },
  computed: {
    localFormModel() {
      return this.formModel
    },
    localFormRule() {
      return this.formRule
    }
  },
  watch: {
    // localFormModel: {
    //   // 把this.formModel中能转成数字类型的都转成数字类型，因为在回显的时候select绑定值和下拉框中的value经常由于一个是数字类型一个是字符串类而回显错误
    //   handler(newVal) {
    //     for (const key in newVal) {
    //       if (newVal[key]) {
    //         newVal[key] = this.convertToNumber(newVal[key])
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  created() {
    // 这个方法用于便捷添加一些表单项校验，只能传入当前getFormRule方法中提供的几条校验方法
    this.formItems.forEach((ele) => {
      if (!this.localFormRule[ele.prop]) {
        this.localFormRule[ele.prop] = []
      }
      if (ele.vaildType) {
        const arr = ele.vaildType.split(',')
        arr.forEach((item) => {
          const rule = this.getFormRule(item, ele)
          rule && this.localFormRule[ele.prop].push(rule)
        })
      }
    })
  },
  mounted() {
    this.isShowUpload = false
    this.$nextTick(() => {
      this.isShowUpload = true
    })
  },
  methods: {
    remoteMethod(val) {
      console.log(val)
    },
    getFormRule(val, ele) {
      if (val === 'required') {
        const str =
          ele.type === 'input' ? `请输入${ele.label}` : `请选择${ele.label}`
        // 必填校验
        return {
          required: true,
          message: ele.requireMessage ? ele.requireMessage : str,
          trigger: 'change'
        }
      } else if (val === 'number') {
        // 数字(带小数)校验
        return {
          pattern: /^[0-9]+(\.[0-9]+)?$/,
          message: ele.numberMessage
            ? ele.numberMessage
            : '请输入正确格式的数字',
          trigger: 'change'
        }
      } else if (val === 'naturalNumber') {
        // 数字(不带小数)校验
        return {
          pattern: /^[0-9]+$/,
          message: ele.numberMessage
            ? ele.numberMessage
            : '请输入正确格式的数字',
          trigger: 'change'
        }
      } else if (val === 'phone') {
        // 手机号码校验
        return {
          pattern: /^1[3-9]\d{9}$/,
          message: ele.phoneMessage
            ? ele.phoneMessage
            : '请输入正确格式的手机号码',
          trigger: 'blur'
        }
      } else if (val === 'roomNumber') {
        // 门牌号码校验
        return {
          pattern: /^[a-zA-Z0-9]*$/,
          message: ele.phoneMessage
            ? ele.phoneMessage
            : '请输入正确格式的门牌号',
          trigger: 'blur'
        }
      } else {
        return false
      }
    },
    btnCkick(btnItem) {
      if (btnItem.isValiDate) {
        this.$refs['commonForm'].validate((valid) => {
          if (valid) {
            btnItem.fn && btnItem.fn()
          }
        })
      } else {
        btnItem.fn && btnItem.fn()
      }
    },
    // 富文本内容改变执行以下方法
    wangEditorChange(val, prop) {
      this.localFormModel[prop] = val
    },
    // 设置selectTree类型下拉框的值
    formselectData(data, props) {
      const arr = []
      const fn = (array) => {
        array.forEach((ele) => {
          arr.push({
            label: ele[props.label],
            value: ele[props.nodeKey]
          })
          if (ele[props.children]) {
            fn(ele[props.children])
          }
        })
      }
      fn(data)
      return arr
    },
    // 设置selectTree类型下拉框的值
    formatTreeData(data, props) {
      const newArr = JSON.parse(JSON.stringify(data))
      if (props.disabled) {
        const fn = (arr) => {
          arr.forEach((ele) => {
            if (ele[props.disabled.label] === props.disabled.value) {
              ele.disabled = true
            }
            if (ele[props.children]) {
              fn(ele[props.children])
            }
          })
        }
        fn(newArr)
      }
      return newArr
    },
    // selectTree点击方法
    handleNodeClick(prop, treeprops, formItem, data, node) {
      if (!data.disabled) {
        this.localFormModel[prop] = data[treeprops.nodeKey]
        this.$refs['out' + prop][0].blur()
        // 把树的点击状态发送出去
        formItem.changeFn &&
          formItem.changeFn(data[treeprops.nodeKey], node.data)
      }
    },
    // selectTree点击清除按钮
    clear(ref) {
      this.$refs['tree' + ref][0].setCheckedKeys([])
    },
    // 地图组件获取坐标点
    getMapPoint(data) {
      this.localFormModel[data.prop] = data.lnglat.join(',')
    },
    // // 上传组件获取上传前的文件
    // fileChange(val, prop) {
    //   this.localFormModel[prop] = val;
    //   this.validateField([prop]);
    // },
    // // 上传组件获取上传后的文件路径
    // uploadFiles(val, prop) {
    //   this.localFormModel[prop] = val;
    // },
    // 上传组件获取上传前的文件
    fileChange(val, prop) {
      this.localFormModel[prop] = val
      this.validateField([prop])
      console.log(this.localFormModel)
    },
    // 写一个简便方法清除各别表单项的校验
    clearValidate(propArr) {
      this.$refs.commonForm.clearValidate(propArr)
    },
    // 写一个简便方法校验各别表单项
    validateField(propArr) {
      this.$refs.commonForm.validateField(propArr)
    },
    none() {
      console.log('none')
    },
    ceshifn() {
      console.log('ceshifn')
    },
    // 把能转成字符串类型的都转成字符串类型
    convertToNumber(val) {
      // const num = Number(str)
      // return isNaN(num) ? str : num
      return String(val)
    }
  }
}
</script>

<style lang="scss">
// @import "@/styles/index.scss";
.common-form {
  overflow: hidden;
  .el-textarea__inner::placeholder{
    font-family: "Microsoft YaHei"!important;
    color:#c6c6c6!important;
  }
  .el-textarea__inner{
     font-family: "Arial"!important;
  }
  .el-form-item {
    margin-bottom: 22px;
  }
  .el-form-item__label {
    font-size: 14px;
    // font-weight: bold;
    // color: #333;
    // font-weight: 600;
  }
  .el-form-item__content {
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .el-form-item.passwordReadonly {
    .el-icon-view {
      position: absolute;
      right: 10px;
      top: 13px;
      cursor: pointer;
    }
  }
  .poptitle-el-form-item .el-form-item__content .el-input {
    width: calc(100% - 30px);
  }
  .el-input.is-disabled .el-input__inner {
    color: #333;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #333;
  }
  .operationBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 20px;
  }
  .el-col {
    position: relative;
    .popTitle {
      position: absolute;
      right: 0;
      top: 0;
      // transform: translateX(100%);
      padding-left: 5px;
      // color: #dcdfe6;
      font-size: 16px;
    }
  }
  .slotLabel {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.form-common-tree {
  // .el-tree-node__label {
  //   color: #333;
  // }
  .el-tree-node__content {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  // .is-checked > .el-tree-node__content {
  //   background-color: #ecf4f3;
  // }
}
.select-tree-popper {
  height: 300px;
}
.el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #333;
}
</style>
