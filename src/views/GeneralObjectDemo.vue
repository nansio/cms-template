<template>
  <div class="farmers-mgmt">
    <GeneralObjectMgmt :config="config" />
  </div>
</template>

<script>

export default {
  name: 'FarmersMgmt',
  data() {
    return {
      config: {
        urls: {
          add: '',
          edit: '',
          detail: '',
          delete: ''
        },
        table: {
          query: {
            show: true,
            formItems: [
              {
                type: 'select',
                label: '综合体',
                prop: 'org',
                placeholder: '请选择'
              },
              {
                type: 'input',
                label: '种植户姓名',
                prop: 'name',
                placeholder: '请输入种植户姓名'
              }

            ],
            showAddBtn: true,
            btns: []
          },
          columns: []
        },
        dialog: {
          show: false,
          urls: {
            add: '',
            edit: '',
            detail: '',
            remove: ''
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
