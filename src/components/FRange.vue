<template>
  <div class="range-wrap" :style="{ width: width + 'px' }">
    <div class="msk" v-if="showMsk"></div>
    <div class="color-cover" :style="style"></div>
    <input
        type="range"
        max="100"
        min="0"
        v-model="rangeNum"
        @change="changeEvent"
        :style="{ width: width + 'px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'

const emits = defineEmits(['update:num', 'feed'])
const props = defineProps({
  width: {
    type: [String, Number],
    default: 140
  },
  height: {
    type: [String, Number],
    default: 8
  },
  num: {
    type: Number,
    default: 0
  },
  showMsk: {
    type: Boolean,
    default: false
  },
  style: {
    type: String,
    default: ''
  }
})
const rangeNum = ref(0)
watch(
    () => props.num,
    (val) => {
      rangeNum.value = val
    },
    {
      immediate: true
    }
)
const changeEvent = () => {
  emits('update:num', rangeNum.value)
  emits('feed', rangeNum.value)
}
</script>

<style scoped lang="less">
input[type='range'] {
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-runnable-track {
  height: v-bind('props.height + "px"');
  background: transparent;
  border: none;
  border-radius: 3px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: v-bind('props.height + 3 + "px"');
  width: v-bind('props.height + 3 + "px"');
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #fff;
  margin-top: -3px;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.5);
}

input[type='range']:focus {
  outline: none;
}

input[type='range']:focus::-webkit-slider-runnable-track {
  background: transparent;
}

.range-wrap {
  position: relative;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.3);
  height: v-bind('props.height + "px"');
  border-radius: 4px;

  input[type='range'] {
    position: absolute;
    z-index: 3;
    left: -2px;
    top: -2px;
    cursor: pointer;
    background: transparent;
  }
}
</style>