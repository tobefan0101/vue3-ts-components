<template>
  <div
      class="absolute border ratate-wrap box border-alpha-0"
      :class="{ 'is-focus': isFocus }"
      :style="style"
      @click.stop="emits('update:checked', true)"
      @mousedown="mouseDownHandler($event, 'wrap')"
      v-show="src != ''"
      ref="ele"
  >
    <div
        class="square left-top"
        @mousedown="mouseDownHandler($event, 'left-top')"
    ></div>
    <div class="square top" @mousedown="mouseDownHandler($event, 'top')"></div>
    <div
        class="square right-top"
        @mousedown="mouseDownHandler($event, 'right-top')"
    ></div>
    <div
        class="square left"
        @mousedown="mouseDownHandler($event, 'left')"
    ></div>
    <div
        class="square right"
        @mousedown="mouseDownHandler($event, 'right')"
    ></div>
    <div
        class="square left-bottom"
        @mousedown="mouseDownHandler($event, 'left-bottom')"
    ></div>
    <div
        class="square bottom"
        @mousedown="mouseDownHandler($event, 'bottom')"
    ></div>
    <div
        class="square right-bottom"
        @mousedown="mouseDownHandler($event, 'right-bottom')"
    ></div>
    <div class="rotate" @mousedown="mouseDownHandler($event, 'rotate')">
      <v-icon src="update" width="15"></v-icon>
    </div>
    <v-image :src="src" v-if="src !== ''"></v-image>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  computed,
  defineEmits,
  onMounted,
  onUnmounted,
  shallowRef,
  watch
} from 'vue'
const emits = defineEmits([
  'update:w',
  'update:h',
  'update:x',
  'update:y',
  'update:r',
  'update:checked'
])
const ele = shallowRef<HTMLElement>()
const props = defineProps({
  w: {
    type: Number,
    default: 100
  },
  h: {
    type: Number,
    default: 100
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  r: {
    type: Number,
    default: 0
  },
  src: {
    type: String,
    default: ''
  },
  checked: {
    type: Boolean,
    default: false
  }
})

const isFocus = ref(false)
watch(
    () => props.checked,
    (val) => {
      isFocus.value = val
    }
)

let isHandle = false
let status = ''
let parentRect = {
  w: 0,
  h: 0,
  x: 0,
  y: 0
}
let coordinate = {
  x: 0,
  y: 0
}
let ori_d: {
  w: number
  h: number
  x: number
  y: number
  r: number
}
let center_coordinate = {
  x: 0,
  y: 0
}
const style = computed(() => {
  return {
    left: props.x + 'px',
    top: props.y + 'px',
    width: props.w + 'px',
    height: props.h + 'px',
    transform: `rotate(${props.r}deg)`
  }
})
const mouseDownHandler = (e: MouseEvent, type: string) => {
  e.stopPropagation()
  e.preventDefault()
  if (!isFocus.value) return
  status = type
  isHandle = true
  coordinate = {
    x: e.pageX,
    y: e.pageY
  }
  ori_d = {
    w: props.w,
    h: props.h,
    x: props.x,
    y: props.y,
    r: props.r
  }
  const react = ele.value?.getBoundingClientRect()
  center_coordinate = {
    x: (react?.left as number) + (react?.width as number) / 2,
    y: (react?.top as number) + (react?.height as number) / 2
  }
}
const mouseEvent = (e: MouseEvent) => {
  if (!isHandle) return
  if (
      e.pageX - parentRect.w - parentRect.x >= 0 ||
      e.pageY - parentRect.h - parentRect.y >= 0
  )
    return
  switch (status) {
    case 'wrap': {
      const left = e.pageX - coordinate.x + ori_d.x
      const top = e.pageY - coordinate.y + ori_d.y
      emits('update:x', left)
      emits('update:y', top)
      break
    }
    case 'top': {
      const height = ori_d.h - (e.pageY - coordinate.y)
      const top = ori_d.y + (e.pageY - coordinate.y)
      emits('update:h', height < 1 ? 1 : height)
      emits('update:y', top)
      break
    }
    case 'bottom': {
      const height = ori_d.h + (e.pageY - coordinate.y)
      emits('update:h', height < 1 ? 1 : height)
      break
    }
    case 'left': {
      const width = ori_d.w - (e.pageX - coordinate.x)
      const left = ori_d.x + (e.pageX - coordinate.x)
      emits('update:w', width < 1 ? 1 : width)
      emits('update:x', left)
      break
    }
    case 'right': {
      const width = ori_d.w + (e.pageX - coordinate.x)
      emits('update:w', width < 1 ? 1 : width)
      break
    }
    case 'left-top': {
      const width = ori_d.w - (e.pageX - coordinate.x)
      const left = ori_d.x + (e.pageX - coordinate.x)
      const height = ori_d.h - (e.pageY - coordinate.y)
      const top = ori_d.y + (e.pageY - coordinate.y)
      emits('update:h', height)
      emits('update:y', top)
      emits('update:w', width)
      emits('update:x', left)
      break
    }

    case 'right-top': {
      const width = ori_d.w + (e.pageX - coordinate.x)
      const height = ori_d.h - (e.pageY - coordinate.y)
      const top = ori_d.y + (e.pageY - coordinate.y)
      emits('update:h', height)
      emits('update:y', top)
      emits('update:w', width)
      break
    }
    case 'left-bottom': {
      const width = ori_d.w - (e.pageX - coordinate.x)
      const left = ori_d.x + (e.pageX - coordinate.x)
      const height = ori_d.h + (e.pageY - coordinate.y)
      emits('update:h', height)
      emits('update:w', width)
      emits('update:x', left)
      break
    }
    case 'right-bottom': {
      const width = ori_d.w + (e.pageX - coordinate.x)
      const height = ori_d.h + (e.pageY - coordinate.y)
      emits('update:h', height)
      emits('update:w', width)
      break
    }
    case 'rotate': {
      let angle =
          Math.atan2(
              e.pageX - center_coordinate.x,
              -(e.pageY - center_coordinate.y)
          ) *
          (180 / Math.PI)
      if (angle < 0) {
        angle = 360 + angle
      }
      emits('update:r', Math.floor(angle))
      break
    }
  }
}
const mouseUpEvent = () => {
  isHandle = false
}
watch(
    () => props.x,
    (val) => {
      if (val < 0) {
        emits('update:x', 0)
      }
      if (val + props.w > parentRect.w) {
        emits('update:x', parentRect.w - props.w)
      }
    }
)
watch(
    () => props.y,
    (val) => {
      if (val < 0) {
        emits('update:y', 0)
      }
      if (val + props.h > parentRect.h) {
        emits('update:y', parentRect.h - props.h)
      }
    }
)
watch(
    () => props.w,
    (val) => {
      if (val > parentRect.w) {
        emits('update:w', parentRect.w)
      }
    }
)
watch(
    () => props.h,
    (val) => {
      if (val > parentRect.h) {
        emits('update:h', parentRect.h)
      }
    }
)
onMounted(() => {
  document.addEventListener('mousemove', mouseEvent)
  document.addEventListener('mouseup', mouseUpEvent)
  document.addEventListener('click', () => {
    emits('update:checked', false)
  })
  const rect = (ele.value?.parentNode as HTMLElement)?.getBoundingClientRect()
  parentRect.w = rect.width
  parentRect.h = rect.height
  parentRect.x = rect.left
  parentRect.y = rect.top
})
onUnmounted(() => {
  document.removeEventListener('mousemove', mouseEvent)
  document.removeEventListener('mouseup', mouseUpEvent)
})
</script>

<style scoped lang="less">
.ratate-wrap {
  &.is-focus {
    cursor: move;
    .square,
    .rotate {
      display: block;
    }
  }
  .rotate {
    position: absolute;
    left: 50%;
    margin-left: -8px;
    top: -20px;
    display: none;
    cursor: grab;
  }
  .square {
    width: 4px;
    height: 4px;
    border: 1px solid #fff;
    position: absolute;
    background-color: #fff;
    display: none;
    z-index: 1;
    &.left-top {
      left: -3px;
      top: -3px;
      cursor: nw-resize;
    }
    &.top {
      left: 50%;
      margin-left: -3px;
      top: -3px;
      cursor: n-resize;
    }
    &.right-top {
      right: -3px;
      top: -3px;
      cursor: ne-resize;
    }
    &.left-bottom {
      left: -3px;
      bottom: -3px;
      cursor: sw-resize;
    }
    &.bottom {
      left: 50%;
      margin-left: -3px;
      bottom: -3px;
      cursor: n-resize;
    }
    &.right-bottom {
      right: -3px;
      bottom: -3px;
      cursor: se-resize;
    }
    &.left {
      top: 50%;
      margin-top: -3px;
      left: -3px;
      cursor: e-resize;
    }
    &.right {
      top: 50%;
      margin-top: -3px;
      right: -3px;
      cursor: e-resize;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>