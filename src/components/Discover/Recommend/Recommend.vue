<template>
  <ul class="sm:mt-5 grid gap-x-4 lg:gap-x-8 grid-cols-3 sm:grid-cols-5">
    <li v-for="item in recommendList" :key="item.id">
      <!-- 路由链接 -->
      <a
        @click="$router.push(routerTo(item))"
        :class="`${item.id === 'taste' ? 'square ' : ' '}group block w-full border border-gray-300 relative overflow-hidden`"
      >
        <!-- 每日歌曲推荐 -->
        <div
          v-if="item.id === 'taste'"
          class="w-full h-full bg-white flex flex-col items-center justify-evenly absolute select-none whitespace-nowrap"
        >
          <!-- 星期几 -->
          <div class="text-xs sm:text-sm text-gray-800">{{ '星期' + '日一二三四五六'.charAt(new Date().getDay()) }}</div>
          <!-- 几号 -->
          <div class="text-5xl xs:text-7xl md:text-8xl text-red-700">{{ new Date().getDate() }}</div>
        </div>
        <!-- 其他推荐项目（包括歌单和电台节目） -->
        <div v-else>
          <!-- 歌单（电台）封面 -->
          <img :src="item.picUrl + '?param=200y200'" :title="item.name" />
          <!-- 收听人数 -->
          <div
            class="w-3/5 pr-1 py-px xs:pr-2 absolute top-0 right-0 opacity-70 bg-gradient-to-r from-transparent to-gray-800 text-white leading-5 text-xs xs:text-sm text-right md:transform transition-transform delay-700 group-hover:-translate-y-full"
          >
            {{
              (item.playcount && numToUnitWan(item.playcount)) ||
              (item.playCount && numToUnitWan(item.playCount)) ||
              (item.program.adjustedPlayCount && numToUnitWan(item.program.adjustedPlayCount))
            }}
          </div>
        </div>
        <!-- play icon -->
        <PlayIcon @click.stop="play(item.id, item.program)" />
        <!-- 推荐原因 -->
        <div
          class="w-full px-2 py-1 bg-black bg-opacity-60 absolute top-0 text-sm text-gray-300 transform transition-transform delay-700 -translate-y-full md:group-hover:translate-y-0"
        >
          {{ item.copywriter || '热门推荐' }}
        </div>
      </a>
      <!-- 描述文本 -->
      <router-link
        :to="routerTo(item)"
        class="webkit-box line-3 h-8 sm:h-15 px-1 mt-1 mb-3.5 text-xs sm:text-sm text-black hover:text-black hover:underline overflow-hidden overflow-ellipsis"
        :title="item.name"
      >
        <i v-if="item.program" class="inline-block w-9 h-4 mr-px sm:h-5 align-bottom" :style="djprogramIcon"> </i>
        {{ item.name }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import PlayIcon from '@/components/Icon/PlayIcon/PlayIcon.vue'
import api from '@/api'
import { numToUnitWan } from '@/utils'

export default {
  data() {
    return {
      djprogramIcon: `background: url(${require('@/assets/img/djprogram.png')}) center no-repeat`
    }
  },
  props: {
    recommendList: {
      type: Array,
      required: true
    }
  },
  methods: {
    routerTo(item) {
      if (item.id === 'taste') return '/'
      else if (item.program) return '/'
      else return `/playlist?id=${item.id}`
    },
    async play(id, program) {
      if (id === 'taste') return
      else if (program) return
      const { data: res } = await api.getPlaylistDetail(id)
      if (res.code === 200) {
        const tracks = res.playlist.tracks
        res.privileges.forEach((item, index) => {
          if (!item.fee && !item.subp) tracks[index].disabled = '亲爱的,暂无版权'
        })
        this.$store.commit('resetAudioTracks', tracks)
        this.$store.commit('toPlay', tracks[0].id)
      }
    },
    numToUnitWan
  },
  components: {
    PlayIcon
  }
}
</script>

<style scoped>
@media (min-width: 640px) {
  .line-3 {
    --my-line-clamp: 3;
  }
}
</style>
