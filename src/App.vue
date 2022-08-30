<template>
    <div class="app-container">
      <div class="top-header">
        <h1>Fan</h1>
        <h2>A blog about a blog</h2>
      </div>
      <top-menu></top-menu>
      <router-view></router-view>
    </div>
</template>
<script lang="ts" setup>
import TopMenu from '@/components/layout/TopMenu.vue'
</script>
<style lang="less">
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, p, blockquote, th, td, tbody {
  margin: 0;
  padding: 0;
  list-style: none;
}
a {
  color: inherit;
  text-decoration: none;
}
h1, h2, h3, h4, h5, h6 {
  font-family: Verdana, Arial, Helvetica, sans-serif;
  font-weight: 400;
}

.app-container {
  max-width: 1128px;
  margin: 0 auto;

  .top-header {
    padding: 10px 0;

    h1 {
      font-size: 30px;
      font-weight: 400;
      text-decoration: none;
      text-shadow: 0.1px 0.1px 0.1px #333;
    }

    h2 {
      color: #999;
      font-size: .928571rem;
      font-weight: 400;
      line-height: 1.5;
    }
  }
}
</style>
