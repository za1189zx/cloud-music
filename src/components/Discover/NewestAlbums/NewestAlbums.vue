<template>
  <div class="py-6 md:py-7 lg:py-8 px-10 my-5 border border-gray-300 bg-gray-100 relative">
    <div class="overflow-hidden">
      <!-- 为了让 purge 收集依赖，否则可以写进 computed -->
      <div
        :class="`w-4/1 transform ${slideController === -1 ? '-translate-x-2/4' : ''}${
          slideController === 0 ? '-translate-x-0 slideController' : ''
        }${slideController === 1 ? '-translate-x-1/4 slideController' : ''}${
          slideController === 2 ? '-translate-x-2/4 slideController' : ''
        }${slideController === 3 ? '-translate-x-3/4 slideController' : ''}${slideController === 4 ? '-translate-x-1/4' : ''}`"
        ref="slide"
      >
        <!-- 复制一份列表，用于无缝轮播 -->
        <ul class="w-1/2 mb-0 inline-grid gap-x-4 grid-cols-10" v-for="n in 2" :key="n">
          <li v-for="item in newestAlbums" :key="item.id">
            <!-- 专辑封面 -->
            <AlbumBox :albumId="item.id" :picUrl="item.picUrl + '?param=200y200'" :albumName="item.name">
              <div class="w-5/6">
                <!-- 专辑名 -->
                <router-link
                  :to="`album?id=${item.id}`"
                  class="block text-xs text-gray-800 hover:text-gray-800 hover:underline truncate"
                  :title="item.name"
                >
                  {{ item.name }}
                </router-link>
                <!-- 歌手名 -->
                <p class="mb-0 leading-4 truncate">
                  <ArtistNames :artists="item.artists" textColor="text-gray-600" intactTitle />
                </p>
              </div>
            </AlbumBox>
          </li>
        </ul>
      </div>
    </div>
    <!-- 向左按钮 -->
    <div class="w-4 h-4 absolute top-2/5 left-4 flex-center cursor-pointer" @click="prev">
      <i class="w-3 h-3 block border-t-4 border-l-4 border-gray-600 transform -rotate-45"></i>
    </div>
    <!-- 向右按钮 -->
    <div class="w-4 h-4 absolute top-2/5 right-4 flex-center cursor-pointer" @click="next">
      <i class="w-3 h-3 block border-t-4 border-r-4 border-gray-600 transform rotate-45"></i>
    </div>
  </div>
</template>

<script>
import AlbumBox from '@/components/AlbumBox/AlbumBox.vue'
import ArtistNames from '../../ArtistNames/ArtistNames.vue'

export default {
  data() {
    return {
      flag: true,
      slideController: 2
    }
  },
  props: {
    newestAlbums: Array
  },
  methods: {
    prev() {
      if (!this.flag) return
      this.slideController -= 1
      this.flag = false
      if (this.slideController === -1) {
        setTimeout(() => (this.slideController = 1), 0)
      }
      setTimeout(() => (this.flag = true), 600)
    },
    next() {
      if (!this.flag) return
      this.slideController += 1
      this.flag = false
      if (this.slideController === 4) {
        setTimeout(() => (this.slideController = 2), 0)
      }
      setTimeout(() => (this.flag = true), 600)
    }
  },
  components: {
    AlbumBox,
    ArtistNames
  }
}
</script>

<style></style>
