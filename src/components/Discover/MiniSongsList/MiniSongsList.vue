<template>
  <ul class="mb-0">
    <li v-for="(item, index) in list" :key="item.id">
      <router-link to="" class="w-full pl-1 flex items-center text-black hover:text-black">
        <!-- 排名 -->
        <div
          v-if="toRank"
          :class="`w-8 flex-shrink-0 text-base leading-8 text-center ${index < 3 ? 'text-red-600' : 'text-gray-400'}`"
        >
          {{ index &lt; 9 ? '0' + ( index + 1 ) : index + 1 }}
        </div>
        <!-- 音乐 -->
        <div class="w-full pr-2 py-1 border-b border-gray-200 flex-grow flex items-center justify-between">
          <div class="flex-grow">
            <!-- 歌名 -->
            <p class="webkit-box line-1 mb-0 text-base overflow-hidden">
              {{ item.name
              }}<span v-if="item.song.alias.length !== 0" class="text-gray-400">{{ ' (' + item.song.alias[0] + ')' }}</span>
            </p>
            <!-- 歌手 -->
            <p class="webkit-box line-1 mb-0 text-xs leading-4 text-gray-400 overflow-hidden">
              <span v-for="(artist, i) in item.song.artists" :key="artist.id">
                {{ i !== 0 ? ' / ' + artist.name : artist.name }} </span
              ><span>{{ ' - ' + item.song.album.name }}</span>
            </p>
          </div>
          <svg
            class="w-4 h-4 flex-shrink-0 fill-gray-400"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M512 0C229.216 0 0 229.216 0 512s229.216 512 512 512 512-229.216 512-512S794.784 0 512 0z m0 928C282.24 928 96 741.76 96 512S282.24 96 512 96s416 186.24 416 416-186.24 416-416 416zM384 288l384 224-384 224z"
              p-id="5472"
            ></path>
          </svg>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    list: Array,
    toRank: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style></style>
