<template>
  <div class="w-50 h-50 mx-auto flex-center relative">
    <img :src="picUrl + '?param=140y140'" class="w-2/3 absolute" />
    <img src="@/assets/img/album_circle.png" class="w-50 absolute" />
  </div>
  <slot></slot>
</template>

<script>
export default {
  props: {
    picUrl: String
  }
}
</script>
