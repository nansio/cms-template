<template>
  <el-form-item :label="item.label" :prop="item.prop">
    <el-input v-model="item.value" placeholder="" size="normal" clearable />

  </el-form-item>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
