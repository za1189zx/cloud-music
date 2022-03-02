<template>
  <router-link to="" class="w-full flex group" :title="albumName">
    <div class="w-5/6 relative">
      <img :src="picUrl" />
      <!-- play icon -->
      <PlayIcon :size="7" />
    </div>
    <img src="@/assets/img/album.png" class="w-1/6" />
  </router-link>
  <slot></slot>
</template>

<script>
import PlayIcon from '@/components/Icon/PlayIcon/PlayIcon.vue'

export default {
  props: {
    picUrl: String,
    albumName: String
  },
  components: {
    PlayIcon
  }
}
</script>
