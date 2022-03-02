<template>
  <div class="my-5 border border-gray-300 divide-x divide-gray-300 bg-gray-100 flex">
    <!-- 三榜 -->
    <div v-for="item in toplistBill" :key="item.name" class="w-full">
      <!-- 榜头 -->
      <div class="p-5 flex">
        <!-- 榜单封面 -->
        <router-link to="/" class="w-2/5"><img :src="item.coverImgUrl" :title="item.name" /></router-link>
        <div class="ml-3 mt-2">
          <!-- 榜单名 -->
          <router-link to="/" class="text-gray-800 hover:text-gray-800 font-bold hover:underline" :title="item.name">{{
            item.name
          }}</router-link>
          <!-- 榜单按钮 -->
          <div class="w-13 h-10 flex items-center justify-between">
            <!-- 播放 -->
            <button class="w-5 h-5" title="播放">
              <FillPlayIcon class="fill-gray-400 hover:fill-gray-500" />
            </button>
            <!-- 收藏 -->
            <button class="w-5 h-5" title="收藏">
              <AddFolderIcon class="fill-gray-400 hover:fill-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <!-- 榜单列表 -->
      <ul class="mb-0">
        <li v-for="(song, sIndex) in item.tracks" :key="song.id" class="h-8 group odd:bg-gray-200 flex items-center">
          <!-- 榜单排名 -->
          <div :class="`w-8 mx-2 flex-shrink-0 text-base leading-8 text-center ${sIndex < 3 ? 'text-red-700' : ''}`">
            {{ sIndex + 1 }}
          </div>
          <!-- 歌曲 -->
          <router-link
            to="/"
            class="h-full flex-grow text-xs leading-8 text-gray-800 hover:text-gray-800 hover:underline"
            :title="song.name"
          >
            <p class="webkit-box line-1 mb-0 overflow-hidden overflow-ellipsis">{{ song.name }}</p>
          </router-link>
          <div class="w-16 h-4 mr-4 flex-shrink-0 hidden group-hover:flex justify-between">
            <!-- 播放 -->
            <button class="w-4 h-4" title="播放">
              <FillPlayIcon class="fill-gray-400 hover:fill-gray-500" />
            </button>
            <!-- 添加到播放列表 -->
            <button class="w-4 h-4" title="添加到播放列表">
              <AddIcon class="fill-gray-400 hover:fill-gray-500" />
            </button>
            <!-- 收藏 -->
            <button class="w-4 h-4" title="收藏">
              <AddFolderIcon class="fill-gray-400 hover:fill-gray-500" />
            </button>
          </div>
        </li>
        <li class="h-8 bg-gray-200 relative">
          <router-link to="/" class="absolute right-6 text-xs leading-8 text-gray-800 hover:text-gray-800 hover:underline"
            >查看全部&gt;
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import FillPlayIcon from '@/components/Icon/PlayIcon/FillPlayIcon.vue'
import AddFolderIcon from '../../Icon/AddFolderIcon/AddFolderIcon.vue'
import AddIcon from '../../Icon/AddIcon/AddIcon.vue'

export default {
  props: {
    toplistBill: Array
  },
  components: { FillPlayIcon, AddFolderIcon, AddIcon }
}
</script>
