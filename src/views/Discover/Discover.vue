<template>
  <div class="h-full overflow-auto">
    <!-- 轮播图 -->
    <Swiper />
    <!-- 版心 -->
    <div class="max-w-5xl sm:pt-1 sm:pb-5 sm:px-4 lg:px-8 mx-auto lg:border-l lg:border-r border-gray-300 bg-white">
      <!-- 热门推荐 -->
      <Header left="热门推荐" right="/" />
      <Recommend :recommendList="recommendList" />
      <!-- 新碟上架 -->
      <Header v-if="windowWidth >= 640" left="新碟上架" right="/" />
      <NewestAlbums v-if="windowWidth >= 640" :newestAlbums="newestAlbums" />
      <!-- 榜单 -->
      <Header v-if="windowWidth >= 640" left="榜单" right="/" />
      <ToplistBill v-if="windowWidth >= 640" :toplistBill="toplistBill" />
      <!-- 最新音乐 -->
      <Header v-if="windowWidth < 640" left="最新音乐" right="/" />
      <MiniSongsList v-if="windowWidth < 640" :list="newestSongs" />
    </div>
  </div>
</template>

<script>
import Swiper from '@/components/Swiper/Swiper.vue'
import Header from '@/components/Header/Header.vue'
import Recommend from '@/components/Discover/Recommend/Recommend.vue'
import NewestAlbums from '@/components/Discover/NewestAlbums/NewestAlbums.vue'
import ToplistBill from '@/components/Discover/ToplistBill/ToplistBill.vue'
import MiniSongsList from '@/components/Discover/MiniSongsList/MiniSongsList.vue'

export default {
  inject: ['windowWidth'],
  computed: {
    recommendList() {
      if (this.windowWidth >= 640) return this.$store.getters.list
      else return this.$store.getters.miniList
    },
    newestAlbums() {
      return this.$store.state.moduleDiscover.newestAlbums
    },
    toplistBill() {
      return this.$store.state.moduleDiscover.toplistBill
    },
    newestSongs() {
      return this.$store.state.moduleDiscover.newestSongs
    }
  },
  created() {
    this.$store.dispatch('recommends')
    this.$store.dispatch('newestAlbums')
    this.$store.dispatch('toplist')
    this.$store.dispatch('newestSongs')
  },
  components: {
    Swiper,
    Header,
    Recommend,
    NewestAlbums,
    ToplistBill,
    MiniSongsList
  }
}
</script>
