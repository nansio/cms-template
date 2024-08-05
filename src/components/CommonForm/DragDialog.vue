<template>
  <div id="drag-dialog" :style="{width: width}" :class="{popupClass}">
    <div class="drag-dialog-header">
      <span>{{ title }}</span>
      <span class="close-box"><i class="el-icon-close" @click="closeFn" /></span>
    </div>
    <div id="drag-dialog-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DragDialog',
  props: {
    popupClass: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    position: {
      type: String,
      default: () => {
        return 'center-150px'
      }
    },
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initDrag()
    this.setInitPosition()
  },
  methods: {
    setInitPosition() {
      if (this.position) {
        // 获取drag元素
        const drag = document.getElementById('drag-dialog')
        const app_div = document.getElementById('app')
        const arr = this.position.split('-')
        if (arr.includes('left')) {
          drag.style.left = 0
        }
        if (arr.includes('top')) {
          drag.style.top = 0
        }
        if (arr.includes('right')) {
          drag.style.left = app_div.clientWidth - drag.clientWidth + 'px'
        }
        if (arr.includes('bottom')) {
          drag.style.top = app_div.clientHeight - drag.clientHeight + 'px'
        }
        if (arr[0] === 'center') {
          drag.style.left = (app_div.clientWidth - drag.clientWidth) / 2 + 'px'
        }
        if (arr[1] === 'center') {
          drag.style.top = (app_div.clientHeight - drag.clientHeight) / 2 + 'px'
        }
        if (!arr[0].includes(['right', 'left'])) {
          drag.style.left = arr[0]
        }
        if (!arr[1].includes(['top', 'bottom'])) {
          drag.style.top = arr[1]
        }
      }
    },
    initDrag() {
      // 获取内容元素
      const content = document.getElementById('drag-dialog-content')
      content.onmousedown = function(e) {
        // 阻止事件冒泡
        e.stopPropagation()
      }
      // 获取drag元素
      const drag = document.getElementById('drag-dialog')
      // 获取画布元素
      const container = document.getElementById('app')
      // 当鼠标按下时
      drag.onmousedown = function(e) {
        console.log('onmousedown', 'drag-dialog')
        // 做到浏览器兼容
        e = e || window.event
        const diffX = e.clientX - drag.offsetLeft
        const diffY = e.clientY - drag.offsetTop
        drag.style.cursor = 'move'
        // 当拉着box移动时
        document.onmousemove = function(e) {
          // 浏览器兼容
          e = e || window.event
          // 元素的 clientX 和 clientY 默认是以元素左上角位置来计算的，这里需要向左向上同时减去鼠标点击时的偏移位置差，从而可以保证鼠标始终显示在拖拽元素时的位置
          let left = e.clientX - diffX
          let top = e.clientY - diffY
          // 边界处理，防止超出各个边
          // 保证拖拽元素不超出画布边界，则不要超出画布减去拖拽元素本身宽高的距离
          if (left < 0) {
            left = 0
          } else if (left > container.clientWidth - drag.offsetWidth) {
            left = container.clientWidth - drag.offsetWidth
          }
          if (top < 0) {
            top = 0
          } else if (top > container.clientHeight - drag.offsetHeight) {
            top = container.clientHeight - drag.offsetHeight
          }
          // 实时给元素定位赋值
          drag.style.left = left + 'px'
          drag.style.top = top + 'px'
        }
        // 当鼠标抬起时
        document.onmouseup = function() {
          this.onmousemove = null
          this.onmouseup = null
          drag.style.cursor = 'auto'
        }
      }
    },
    closeFn() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
#drag-dialog {
  /* width: ; */
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  .drag-dialog-header {
    height: 40px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translateX();
    .close-box {
      cursor: pointer;
    }
  }
  #drag-dialog-content {
    padding: 5px;
  }
}
</style>
