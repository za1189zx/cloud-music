<template>
  <a-menu v-model:selectedKeys="current" class="justify-center border-gray-300" style="" mode="horizontal" z-index="-1">
    <a-menu-item key="1"><router-link to="/">推荐</router-link></a-menu-item>
    <a-menu-item key="2"><router-link to="">排行榜</router-link></a-menu-item>
    <a-menu-item key="3" v-if="windowWidth >= 640"><router-link to="">歌单</router-link></a-menu-item>
    <a-menu-item key="4" v-if="windowWidth >= 640"><router-link to="">主播电台</router-link></a-menu-item>
    <a-menu-item key="5" v-if="windowWidth >= 640"><router-link to="">歌手</router-link></a-menu-item>
    <a-menu-item key="6"><router-link to="">新碟上架</router-link></a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data() {
    return {
      current: ['1']
    }
  },
  inject: ['windowWidth']
}
</script>

<style scoped>
.ant-menu-horizontal {
  border-color: #d4d4d4;
}
</style>
