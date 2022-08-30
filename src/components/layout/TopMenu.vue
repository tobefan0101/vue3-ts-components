<template>
  <div class="top-menu">
    <ul>
      <li v-for="menu of menuList" :key="menu.key" >
        <router-link :to="menu.route" :class="{'active': menu.route==='/'}"> {{ menu.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
    onMounted
} from 'vue';
import {useRoute} from "vue-router";

const route = useRoute();
const menuList = [{
  title: 'Home',
  route: '/'
}, {
  title: 'Components',
  route: '/component'
}, {
  title: 'About me',
  route: '/about'
}];
onMounted(()=>{
  const path = route.fullPath;
  console.log(path)
})
</script>

<style scoped lang="less">
.top-menu {
  height: 36px;
  font-size: 10px;
  color: #fff;
  line-height: 34px;
  background-color: #222;
  margin: 0 auto;
  max-width: 1128px;
  font-weight: 700;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  box-shadow: 1px 2px 5px 1px grey;

  ul {
    display: flex;

    li {
      a {
        display: block;
        line-height: 36px;
        padding: 0 15px;
        font-size: 11px;
        font-weight: 700;
        margin-right: 5px;
        position: relative;
        cursor: pointer;

        &:hover {
          background-color: #0074a2;
        }

        &:hover::after, &.active::after {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 0;
          height: 0;
          margin-left: -4px;
          border-bottom: 4px solid #ffffff;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
      }
    }
  }
}
</style>