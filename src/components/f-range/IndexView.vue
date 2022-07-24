<template>
  <div class="range-wrap" :style="{width:width+'px'}">
    <div class="msk" v-if="showMsk"></div>
    <div
        class="cover"
        :style="style"
    ></div>
    <input
        type="range"
        max="100"
        min="0"
        v-model="rangeNum"
        @change="changeEvent"
    />
  </div>
</template>

<script setup lang="ts">
import {
  defineEmits,
  defineProps,
  ref, watch
} from 'vue';

const emits = defineEmits(['update:num', 'feed'])
const props = defineProps({
  width: {
    type: [String, Number],
    default: 140
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
const rangeNum = ref(0);
watch(() => props.num, (val) => {
  rangeNum.value = val;
}, {
  immediate: true
})
const changeEvent = () => {
  emits('update:num', rangeNum.value);
  emits('feed')
}
</script>

<style scoped lang="less">
input[type='range'] {
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
  border: none;
  border-radius: 3px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 11px;
  width: 11px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #fff;
  margin-top: -4px;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.5);
}

input[type='range']:focus {
  outline: none;
}

input[type='range']:focus::-webkit-slider-runnable-track {
  background: transparent;
}

//马赛克背景
.msk {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  z-index: 1;
  background: #595959;
  background-image: linear-gradient(45deg,
  #ccc 25%,
  transparent 25%,
  transparent 75%,
  #ccc 75%,
  #ccc),
  linear-gradient(45deg,
  #ccc 26%,
  transparent 26%,
  transparent 74%,
  #ccc 74%,
  #ccc);
  background-size: 6px 6px;
  background-position: 0 0, 3px 3px;
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  z-index: 2;
}

.range-wrap {
  position: relative;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.3);
  height: 8px;
  border-radius: 4px;

  input[type='range'] {
    position: absolute;
    top: 0;
    z-index: 3;
    width: 139px;
    left: -2px;
    background: transparent;
  }
}
</style>