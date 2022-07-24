<template>
  <div class="container">
    <!--  颜色选择区域-->
    <!--  底色为主色，白色x轴从透明度100到0，黑色y轴从透明度0-100-->
    <div class="pick-container" :style="{'background-color':rgbToHex(mainColor)}">
      <div class="white-cover"></div>
      <div class="black-cover"></div>
      <div>
        <div class="slide"
             :style="{'left': position.x + 'px','top': position.y + 'px'}"></div>
      </div>
      <div class="picker" @mousedown="mousedownEvent($event)"></div>
    </div>
    <div class="range-container">
      <div class="color-show">
        <div class="msk"></div>
        <div :style="{'background-color':rgbToHex(pickColor.rgb), 'opacity': alphaRangeNum/ 100}"></div>
      </div>
      <div class="range-item">
        <!--  主色选择滑块-->
        <FRange v-model:num="colorRangeNum"
                style="background: -webkit-linear-gradient(left,red 0%,yellow 16.66%,lime 33.33%,aqua 50%,blue 66.66%,fuchsia 83.33%,red 100%);"
                @feed="colorRangeFeed"></FRange>
        <!--  透明度选择滑块-->
        <FRange v-model:num="alphaRangeNum"
                :style="'background-image:linear-gradient(to right, transparent, ' + rgbToHex(pickColor.rgb) + ')'"
                :show-msk="true"></FRange>
      </div>
    </div>
    <!--色值-->
    <div class="color-show-wrap">
      <div class="hex-input">
        <div class="text">#</div>
        <input type="text" v-model="hexColor" @change="hexChange">
      </div>
      <div>
        <div class="color-show-container" v-for="type of Object.keys(pickColor)">
          <div class="item" v-for="(k,i) of type.split('')">
            <input type="number" v-model="pickColor[type][i]" @change="syncData(type)">
            <div class="text">{{ k.toLocaleUpperCase() }}</div>
          </div>
          <div class="item">
            <input type="number" v-model="alphaRangeNum">
            <div class="text">A</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch, reactive, toRaw
} from 'vue';
import FRange from '@/components/f-range/IndexView';
import {
  colorList,
  colorPercent,
  getFinalPickColor,
  getColorBetween2Rgb,
  getMainColorByFinalPickerColor,
  gerRangeNumByFinalPickerColor,
  rgbToHex,
  hexToRgb,
  rgbToHsb,
  hsbToRgb,
  rgbToHsl,
  hslToRgb
} from "./color";

const width = 200, height = 100; // 颜色选择区域的宽高
const colorRangeNum = ref(0);
const colorRangeFeed = () => {
  const val = colorRangeNum.value;
  let index = 0;
  for (let i = colorPercent.length - 2; i >= 0; i--) {
    if (val >= colorPercent[i]) {
      index = i;
      break;
    }
  }
  mainColor.value = getColorBetween2Rgb(colorList[index], colorList[index + 1], (val - colorPercent[index]) / 16.66);
  getPickColor();
}
const alphaRangeNum = ref(100);
// 颜色选择区域的主色
const mainColor = ref([255, 0, 0]);
// 选中的颜色
const pickColor = reactive({
  rgb: [0, 0, 0],
  hsl: [0, 0, 0],
  hsb: [0, 0, 0]
})
// 颜色选择区域滑块的位置
const position = ref({
  x: width / 2,
  y: height / 2
})
const hexColor = ref('');
// 同步
const syncData = (type: string) => {
  let rgb = [];
  switch (type) {
    case 'rgb':
      rgb = toRaw(pickColor.rgb);
      pickColor.hsb = rgbToHsb(rgb);
      pickColor.hsl = rgbToHsl(rgb);
      break;
    case 'hsl': {
      rgb = hslToRgb(pickColor.hsl);
      pickColor.rgb = rgb;
      pickColor.hsb = rgbToHsb(rgb);
      break;
    }
    case 'hsb': {
      rgb = hsbToRgb(pickColor.hsb);
      pickColor.rgb = rgb;
      pickColor.hsl = rgbToHsl(rgb);
      break;
    }
  }
  hexColor.value = rgbToHex(rgb).replace('#', '');
  getMainColor(rgb);
}
// 获取选中的颜色
const getPickColor = () => {
  const x = position.value.x;
  const y = position.value.y;
  const finalRgb = getFinalPickColor(x / width, y / height, mainColor.value);
  pickColor.rgb = finalRgb;
  pickColor.hsb = rgbToHsb(finalRgb);
  pickColor.hsl = rgbToHsl(finalRgb);
  hexColor.value = rgbToHex(finalRgb).replace('#', '');
}
// hex input change事件
const hexChange = () => {
  pickColor.rgb = hexToRgb(hexColor.value);
  syncData('rgb');
}
// 获取颜色选择区域的主色
const getMainColor = (rgb: number[]) => {
  // const start
  const x = position.value.x;
  const y = position.value.y;
  const res = getMainColorByFinalPickerColor(x / width, y / height, rgb);
  mainColor.value = res
  colorRangeNum.value = gerRangeNumByFinalPickerColor(res)
}
// 拖拽以及点击选中颜色事件
const pickEvent = (e: MouseEvent) => {
  const x = e.offsetX;
  const y = e.offsetY;
  if (x > width - 5 || y > height - 5 || x < 5 || y < 5) return;
  position.value = {
    x,
    y
  }
  getPickColor();
}
let isSliding = false;
const mousedownEvent = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  pickEvent(e)
  isSliding = true;
}
const mouseMoveEvent = (e: MouseEvent) => {
  if (isSliding) {
    pickEvent(e)
  }
}
const mouseUpEvent = () => {
  isSliding = false;
}
onMounted(() => {
  nextTick(() => {
    colorRangeNum.value = 50;
    colorRangeFeed(); // 设置默认颜色
  })
  document.addEventListener('mousemove', mouseMoveEvent);
  document.addEventListener('mouseup', mouseUpEvent);
});
onUnmounted(() => {
  document.removeEventListener('mousemove', mouseMoveEvent);
  document.removeEventListener('mouseup', mouseUpEvent);
});
</script>

<style scoped lang="less">
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.container {
  background-color: #212121;
  padding: 16px;
  border-radius: 4px;
  position: absolute;
}

.pick-container {
  width: 200px;
  height: 100px;
  position: relative;

  div {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .white-cover {
    background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
  }

  .black-cover {
    background: linear-gradient(0deg, #000, transparent);
  }

  .slide {
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    transform: translate(-5px, -5px);
    border: 1px solid #fff;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5000);
    position: absolute;
    border-radius: 50%;
    cursor: pointer;
  }

  .picker {
    cursor: pointer;
  }
}

.range-container {
  display: flex;
  align-items: center;
  margin-top: 10px;

  .color-show {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    position: relative;
    margin-right: 8px;

    div {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      &.msk {
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
    }
  }

  .range-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.color-show-wrap {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;

  .hex-input {
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 4px;
    display: flex;
    align-items: center;

    .text {
      font-size: 12px;
      color: rgba(255, 255, 255, .8);
      margin-right: 2px;
    }

    input {
      height: 28px;
      width: 40px;
      background-color: transparent;
      color: rgba(255, 255, 255, 0.9);
      font-size: 10px;
      border: 0;
      outline: none;
    }
  }
}

.color-show-container {
  display: flex;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      height: 28px;
      width: 40px;
      border-radius: 4px;
      padding: 0 4px;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: block;
      color: rgba(255, 255, 255, 0.9);
      outline: none;
    }

    .text {
      color: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>