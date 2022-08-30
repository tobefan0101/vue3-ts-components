<template>
  <div
      class="comb-container overflow-hidden"
      :style="{ width: props.w + 'px', height: props.h + 'px' }"
  >
    <v-image :src="imgSrc" class="absolute" :style="style"></v-image>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { hex8toRgb, decodeColor } from '@/utils/color'
import { imgColorComb } from '@/apis/communication'
import * as _ from 'lodash'

const emits = defineEmits(['feed'])
const props = defineProps({
  src: {
    type: Array,
    default: () => []
  },
  color: {
    type: String,
    default: ''
  },
  w: {
    type: [Number, String],
    default: 0
  },
  h: {
    type: [Number, String],
    default: 0
  }
})
const useOri = ref(false)
const imgSrc = ref('')
watch(
    () => props.src,
    (val) => {
      // 如果有新图，则显示新图，否则显示旧图与颜色的合成
      if (val?.length > 1) {
        useOri.value = true
        imgSrc.value = val[1] as string
      } else {
        useOri.value = false
        imgSrc.value = val[0] as string
      }
    },
    { immediate: true }
)
const debounce = _.debounce(() => {
  const { color, alpha } = decodeColor(props.color)
  imgColorComb({
    color,
    alpha,
    img: imgSrc.value
  }).then((res) => {
    emits('feed', res)
  })
}, 10000)
// 监听颜色改变，将颜色和图片合并
watch(
    () => props.color,
    () => {
      if (!useOri.value) {
        debounce()
      }
    }
)
const style = computed(() => {
  const c = /^#[a-fA-F\d+]{8}$/.test(props.color)
  return useOri.value || !c
      ? {
        width: `${props.w}px`,
        height: `${props.h}px`,
        left: `0`,
        top: `0`
      }
      : {
        filter: `drop-shadow(${props.w}px ${props.h}px ${hex8toRgb(
            props.color
        )})`,
        width: `${props.w}px`,
        height: `${props.h}px`,
        left: `-${props.w}px`,
        top: `-${props.h}px`
      }
})
</script>

<style scoped lang="less">
.comb-container {
}
</style>