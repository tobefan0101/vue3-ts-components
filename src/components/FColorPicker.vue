<template>
  <div
      class="dialog-container"
      v-show="visible"
      @click.stop
      :style="{ right: pickerRight + 'px' }"
  >
    <!--  颜色选择区域-->
    <!--  底色为主色，白色x轴从透明度100到0，黑色y轴从透明度0-100-->
    <div
        class="pick-container"
        :style="{ 'background-color': rgbToHex(mainColor) }"
    >
      <div class="white-cover"></div>
      <div class="black-cover"></div>
      <div>
        <div
            class="slide"
            :style="{ left: position.x + 'px', top: position.y + 'px' }"
        ></div>
      </div>
      <div class="picker" @mousedown="mousedownEvent($event)"></div>
    </div>
    <div class="range-container">
      <div class="color-show">
        <div class="msk"></div>
        <div
            class="color-cover"
            :style="{
            'background-color': rgbToHex(pickColor.rgb),
            opacity: alphaRangeNum / 100
          }"
        ></div>
      </div>
      <div class="range-item">
        <!--  主色选择滑块-->
        <VRange
            v-model:num="colorRangeNum"
            width="200"
            :style="{
            background: `-webkit-linear-gradient(
              left,
              red 0%,
              yellow 16.66%,
              lime 33.33%,
              aqua 50%,
              blue 66.66%,
              fuchsia 83.33%,
              red 100%
            )`
          }"
            @feed="colorRangeFeed"
        ></VRange>
        <!--  透明度选择滑块-->
        <VRange
            v-model:num="alphaRangeNum"
            width="200"
            :style="
            'background-image:linear-gradient(to right, transparent, ' +
            rgbToHex(pickColor.rgb) +
            ')'
          "
            :show-msk="true"
            @feed="alphaRangeFeed"
        ></VRange>
      </div>
      <div class="add-color">
        <v-icon src="add" width="22" @click="addColor"></v-icon>
      </div>
    </div>
    <!--色值-->
    <div class="color-val-wrap">
      <div class="hex-input">
        <div class="input">
          <div class="text">#</div>
          <input type="text" v-model="hexColor" @change="hexChange" />
        </div>
        <div class="text">HEX</div>
      </div>
      <div>
        <div
            class="color-val-container"
            v-for="type of Object.keys(pickColor)"
            :key="type"
            v-show="colorShowType === type"
        >
          <div class="item" v-for="(k, i) of type.split('')" :key="k">
            <input
                type="number"
                v-model="pickColor[type][i]"
                @change="syncData(type, true)"
            />
            <div class="text">{{ k.toLocaleUpperCase() }}</div>
          </div>
          <div class="item">
            <input
                type="number"
                v-model="alphaRangeNum"
                @keyup="alphaRangeFeed"
            />
            <div class="text">A</div>
          </div>
        </div>
      </div>
    </div>
    <v-divide width="244" bg="bg-alpha-deep-20" class="mt-16"></v-divide>
    <div class="added-list">
      <template v-for="item of addedColorList" :key="item">
        <div
            class="color-show"
            @click="selectThisColor(item)"
            @click.right="showGlobalDrop($event, item)"
        >
          <div class="msk"></div>
          <div
              class="color-cover"
              :style="{
              'background-color': item.color,
              opacity: item.alpha / 100
            }"
          ></div>
        </div>
      </template>
    </div>
</template>
<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  reactive,
  toRaw,
  computed
} from 'vue'
import { useStore } from 'vuex'
import VRange from '@/components/public/VRange.vue'
import {
  rgbToHex,
  hexToRgb,
  rgbToHsb,
  hsbToRgb,
  rgbToHsl,
  hslToRgb
} from '@/utils/color'
import { useColorSystem, useGlobalDrop } from '@/hooks/public'
import VDivide from '@/components/public/VDivide.vue'

const store = useStore()
const visible = computed(() => store.state.colorPickerVisible)
const width = 248,
    height = 160 // 颜色选择区域的宽高
const colorRangeNum = ref(0)
const colorRangeFeed = () => {
  renderHSB()
}
const alphaRangeFeed = () => {
  store.state.colorPickedFeed({
    alpha: alphaRangeNum.value,
    color: hexColor.value
  })
}
const pickerRight = computed(() => store.state.colorPickerRight)
const alphaRangeNum = ref(100)
// 颜色选择区域的主色
const mainColor = ref([255, 0, 0])
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
const hexColor = ref('')
const colorShowType = ref('hsb') // 默认展示RGB
const addedColorList = ref<
    Array<{
      color: string
      alpha: number
    }>
    >([])

const addColor = () => {
  const color = '#' + hexColor.value
  const alpha = alphaRangeNum.value
  const isExist = addedColorList.value.some((item) => {
    return item.color === color && item.alpha === alpha
  })
  if (!isExist && addedColorList.value.length < 18) {
    addedColorList.value.push({
      color,
      alpha
    })
    localStorage.setItem(
        'vvThemeToolColorPickerAddedList',
        JSON.stringify(addedColorList.value)
    )
  }
}
const showGlobalDrop = (
    e: MouseEvent,
    item: {
      color: string
      alpha: number
    }
) => {
  useGlobalDrop({
    target: e,
    items: ['删除'],
    feed: () => {
      const index = addedColorList.value.findIndex((tt) => {
        return tt.color === item.color && tt.alpha === item.alpha
      })
      addedColorList.value.splice(index, 1)
      localStorage.setItem(
          'vvThemeToolColorPickerAddedList',
          JSON.stringify(addedColorList.value)
      )
    }
  })
}
const selectThisColor = (item: { color: string; alpha: number }) => {
  alphaRangeNum.value = item.alpha
  hexColor.value = item.color
  hexChange()
  hideDialog()
}
const renderHSB = () => {
  // rangeNum的范围时0-100，HSB的范围是0-360
  const H = Math.round((colorRangeNum.value / 100) * 360)
  const S = Math.round((position.value.x / width) * 100)
  const B = Math.round(100 - (position.value.y / height) * 100)
  pickColor.hsb = [H, S, B]
  syncData('hsb')
}
// 同步HSB RGB HEX HSL
const syncData = (type: string, setPosition = false) => {
  let rgb: number[] = []
  switch (type) {
    case 'rgb':
      rgb = toRaw(pickColor.rgb)
      pickColor.hsb = rgbToHsb(rgb)
      pickColor.hsl = rgbToHsl(rgb)
      break
    case 'hsl': {
      rgb = hslToRgb(pickColor.hsl)
      pickColor.rgb = rgb
      pickColor.hsb = rgbToHsb(rgb)
      break
    }
    case 'hsb': {
      rgb = hsbToRgb(pickColor.hsb)
      pickColor.rgb = rgb
      pickColor.hsl = rgbToHsl(rgb)
      break
    }
  }
  hexColor.value = rgbToHex(rgb).replace('#', '')
  if (setPosition) {
    colorRangeNum.value = Math.round((pickColor.hsb[0] / 360) * 100)
    position.value.x = Math.round((pickColor.hsb[1] / 100) * width)
    position.value.y = Math.round(((100 - pickColor.hsb[2]) / 100) * height)
  }
  mainColor.value = hsbToRgb([pickColor.hsb[0], 100, 100])
  alphaRangeFeed()
}
// hex input change事件
const hexChange = () => {
  pickColor.rgb = hexToRgb(hexColor.value)
  syncData('rgb', true)
}
// 拖拽以及点击选中颜色事件
const pickEvent = (e: MouseEvent) => {
  const x = e.offsetX
  const y = e.offsetY
  if (x > width - 5 || y > height - 5 || x < 5 || y < 5) return
  position.value = {
    x,
    y
  }
  renderHSB()
}
let isSliding = false
const mousedownEvent = (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
  pickEvent(e)
  isSliding = true
}
const mouseMoveEvent = (e: MouseEvent) => {
  if (isSliding) {
    pickEvent(e)
  }
}
const mouseUpEvent = () => {
  isSliding = false
}
watch(
    () => store.state.colorPickerVisible,
    (val) => {
      if (val) {
        const color = store.state.colorPickerColor
        alphaRangeNum.value = +store.state.colorPickerAlpha
        hexColor.value = color?.replace('#', '')
        hexChange()
      }
    }
)
const hideDialog = () => {
  store.commit('SET_COLOR_PICKER_VISIBLE', false)
}

onMounted(() => {
  document.addEventListener('click', hideDialog)
  if (localStorage.getItem('vvThemeToolColorPickerAddedList')) {
    addedColorList.value = JSON.parse(
        localStorage.getItem('vvThemeToolColorPickerAddedList') as string
    )
  }
  document.addEventListener('mousemove', mouseMoveEvent)
  document.addEventListener('mouseup', mouseUpEvent)
})
onUnmounted(() => {
  document.removeEventListener('click', hideDialog)
  document.removeEventListener('mousemove', mouseMoveEvent)
  document.removeEventListener('mouseup', mouseUpEvent)
})
    </script>
<style scoped lang="less">
    input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.dialog-container {
  background-color: #212121;
  padding: 8px;
  border-radius: 4px;
  position: absolute;
  top: 0;
  z-index: 999;
  max-height: calc(100vh - 51px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 250px;
}

.pick-container {
  width: 248px;
  height: 160px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

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
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5);
    position: absolute;
    border-radius: 50%;
    cursor: pointer;
  }

.picker {
    cursor: pointer;
  }
}

.color-show {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-right: 4px;

  div {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.color-system-list {
.color-show {
    width: 20px;
    height: 20px;
  }
}

.added-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
  gap: 8px;

.color-show {
    width: 20px;
    height: 20px;
    margin-right: 0;
    cursor: pointer;
  }
}
.range-container {
  display: flex;
  align-items: center;
  margin-top: 10px;

.range-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

.add-color {
    cursor: pointer;
  }
}

.color-val-wrap {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;

.hex-input {
    display: flex;
    flex-direction: column;
    align-items: center;

  .text {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 4px;
    }

  .input {
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding-left: 8px;
      display: flex;
      align-items: center;

    .text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin-right: 2px;
        margin-top: 0;
      }

      input {
        height: 26px;
        width: 52px;
        box-sizing: border-box;
        background-color: transparent;
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        border: 0;
        outline: none;
      }
    }
  }
}

.color-val-container {
  display: flex;

.item {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      height: 28px;
      width: 39px;
      box-sizing: border-box;
      border-radius: 4px;
      margin-left: 5px;
      font-size: 12px;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: block;
      color: rgba(255, 255, 255, 0.9);
      outline: #456fff;
    }

  .text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 10px;
      margin-top: 4px;
    }
  }
}

.color-val {
  width: 60px;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 14px;
  font-size: 10px;
  text-align: center;
}
</style>