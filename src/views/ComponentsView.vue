<template>
  <div class="component-container">
    <div class="left-side">
      <ul>
        <li v-for="menu of leftMenu" :key="menu" @click="jumpTo(menu.hash)">
          <h3 :class="{'active':curHash === menu.hash}">{{ menu.title }}</h3>
        </li>
      </ul>
    </div>
    <div class="content">
      <div id="range" style="background-color: red"></div>
      <div id="colorPicker" style="background-color: blue"></div>
      <div id="colorSelect" style="background-color: green"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref
} from 'vue';

const leftMenu = [
  {
    title: 'Range 范围',
    hash: 'range'
  },
  {
    title: 'ColorPicker 取色器',
    hash: 'colorPicker'
  },
  {
    title: 'ColorSelect 颜色选择',
    hash: 'colorSelect'
  }
]
const curHash = ref('');
const jumpTo = (hash: string) => {
  curHash.value = hash;
  location.hash = hash;
}
onMounted(() => {
  const hash = location.hash;
  curHash.value = hash === '/' ? 'range' : hash.replace('#', '');
  window.addEventListener(
      'hashchange',
      () => {
      },
      false
  );
})
</script>

<style scoped lang="less">
.component-container {
  display: flex;
  position: relative;
  padding-left: 230px;
  height: calc(100vh - 114px);

  .left-side {
    width: 200px;
    padding-top: 10px;
    position: absolute;
    left: 0;
    top: 0;


    li {
      cursor: pointer;
      margin-top: 5px;

      h3 {
        font-size: 11px;
        color: #999;

        &.active {
          color: #0074a2;
        }
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
    div {
      height: 400px;
    }
  }
}

</style>