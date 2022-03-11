<template>
  <!-- 全宽背景 -->
  <div class="my-blur w-full h-auto flex justify-center relative overflow-hidden" :style="bgImage">
    <div class="max-w-5xl h-72 hidden md:flex items-center relative">
      <!-- 轮播图 -->
      <a-carousel class="w-192" effect="fade" autoplay :beforeChange="changeHandler" ref="carousel">
        <div v-for="item in bannerList" :key="item.targetId">
          <a v-if="item.url" :href="item.url"> <img :src="item.imageUrl" /> </a>
          <router-link v-else :to="routerTo(item)"> <img :src="item.imageUrl" /> </router-link>
        </div>
      </a-carousel>
      <!-- 下载按钮 -->
      <div class="download hidden lg:block" :style="download">
        <router-link class="download-btn block opacity-0 hover:opacity-100" to="" :style="download"></router-link>
      </div>
      <!-- 向左按钮 -->
      <div
        class="w-9 h-16 flex items-center justify-center absolute top-28 -left-16 hover:bg-opacity-30 hover:bg-black cursor-pointer"
        @click="$refs.carousel.prev"
      >
        <i class="w-7 h-7 block border-t border-l border-white transform -rotate-45 translate-x-2"></i>
      </div>
      <!-- 向右按钮 -->
      <div
        class="w-9 h-16 flex items-center justify-center absolute top-28 -right-16 hover:bg-opacity-30 hover:bg-black cursor-pointer"
        @click="$refs.carousel.next"
      >
        <i class="w-7 h-7 block border-b border-r border-white transform -rotate-45 -translate-x-2"></i>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      bannerList: [],
      index: 0,
      download: `background-image: url(${require('@/assets/img/download.png')})`
    }
  },
  computed: {
    bgImage() {
      if (this.bannerList.length) return `background-image: url(${this.bannerList[this.index].imageUrl}); background-size: 0 0;`
      else return ''
    }
  },
  methods: {
    async getBannerList() {
      if (this.bannerList.length) return
      const { data: res } = await api.getBanner()
      if (res.banners.length) this.bannerList = res.banners
    },
    routerTo(item) {
      if (item.targetType === 1) return `/song?id=${item.targetId}`
      if (item.targetType === 10) return `/album?id=${item.targetId}`
      if (item.targetType === 1000) return `/playlist?id=${item.targetId}`
      if (item.targetType === 1004) return `/mv?id=${item.targetId}`
      else return '/'
    },
    changeHandler(_from, to) {
      this.index = to
    }
  },
  created() {
    this.getBannerList()
  }
}
</script>

<style scoped>
.my-blur {
  --my-blur: 70px;
}
.ant-carousel :deep(.slick-slide) {
  height: 285px;
}

.download {
  position: relative;
  width: 254px;
  height: 285px;
}
.download-btn {
  position: absolute;
  top: 185px;
  left: 19px;
  width: 215px;
  height: 56px;
  background-position: 0 -289px;
}
</style>
