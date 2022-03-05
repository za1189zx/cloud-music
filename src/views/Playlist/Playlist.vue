<template>
  <PageTemplate
    v-if="playlist"
    :resourceName="playlist.name"
    :subscribed="playlist.subscribed"
    :subscribedCount="playlist.subscribedCount"
    :shareCount="playlist.shareCount"
    :commentCount="commentList.total"
    :tags="playlist.tags"
    :description="playlist.description"
    subscribersTitle="喜欢这个歌单的人"
    :subscribers="playlist.subscribers"
    playlistTitle="热门歌单"
    :relatedList="relatedList"
  >
    <template v-slot:cover>
      <img :src="playlist.coverImgUrl + '?param=250y250'" alt="" class="ring-1 ring-gray-300 ring-offset-4" />
    </template>
    <template v-slot:info>
      <!-- 歌单创建者 -->
      <p class="h-9 flex items-center text-xs">
        <!-- 头像 -->
        <router-link to="">
          <img :src="playlist.creator.avatarUrl + '?param=36y36'" class="h-full" alt="" />
        </router-link>
        <!-- 名字 -->
        <router-link to="" class="ml-3 text-blue-500 hover:text-blue-500 hover:underline">
          {{ playlist.creator.nickname }}
        </router-link>
        <!-- 徽章 -->
        <img v-if="playlist.creator.avatarDetail" :src="playlist.creator.avatarDetail.identityIconUrl" class="h-3" />
        <!-- 创建时间 -->
        <span class="ml-4">
          {{ dayjs(this.playlist.createTime).format('YYYY-MM-DD') + ' 创建' }}
        </span>
      </p>
    </template>
    <template v-slot:module>
      <!-- 歌曲列表 -->
      <Header left="歌曲列表" leftClass="text-xl">
        <template v-slot:left>
          <!-- 歌曲数量 -->
          <span class="pl-4 text-gray-600">{{ playlist.trackCount + '首歌' }}</span>
        </template>
        <template v-slot:right>
          <!-- 播放次数 -->
          <div class="text-gray-600">
            播放：<span class="text-red-800 font-bold">{{ playlist.playCount }}</span
            >次
          </div>
        </template>
      </Header>
      <!-- 列表 -->
      <table class="w-full border border-gray-300 table-fixed">
        <thead class="h-9 border-b border-gray-300">
          <tr class="divide-x divide-gray-300 bg-gradient-to-b from-white to-gray-100">
            <th></th>
            <th class="w-1/3 pl-3 text-gray-600 font-normal">歌曲标题</th>
            <th class="w-1/6 pl-3 text-gray-600 font-normal">时长</th>
            <th class="pl-3 text-gray-600 font-normal">歌手</th>
            <th class="w-1/5 pl-3 text-gray-600 font-normal">专辑</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in playlist.tracks" :key="item.id" class="w-full h-8 odd:bg-gray-100">
            <!-- 标号 -->
            <td>
              <div class="flex items-center justify-around">
                <span>{{ index + 1 }}</span>
                <button class="w-4"><FillPlayIcon class="fill-gray-400 hover:fill-gray-500" /></button>
              </div>
            </td>
            <!-- 歌名 -->
            <td class="px-2.5 truncate">
              <router-link
                :to="`song?id=${item.id}`"
                class="text-gray-700 hover:text-gray-700 hover:underline"
                :title="item.name + (item.alia[0] ? ` - (${item.alia[0]})` : '')"
              >
                {{ item.name }} </router-link
              ><span v-if="item.alia[0]" class="text-gray-400" :title="item.alia[0]"> - ({{ item.alia[0] }})</span>
            </td>
            <!-- 时长 -->
            <td class="group px-2.5 text-gray-500">
              <span class="block group-hover:hidden">{{ dayjs(item.dt).format('mm:ss') }}</span>
              <div class="w-20 h-4 mr-4 flex-shrink-0 hidden group-hover:flex justify-between">
                <!-- 添加到播放列表 -->
                <button class="w-4 h-4" title="添加到播放列表">
                  <AddIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
                <!-- 收藏 -->
                <button class="w-4 h-4" title="收藏">
                  <AddFolderIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
                <!-- 分享 -->
                <button class="w-4 h-4" title="分享">
                  <ShareIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
                <!-- 下载 -->
                <button class="w-4 h-4" title="下载">
                  <DownLoadIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
              </div>
            </td>
            <!-- 歌手们 -->
            <td class="px-2.5 truncate">
              <ArtistNames :artists="item.ar" textColor="text-gray-700" intactTitle />
            </td>
            <!-- 专辑 -->
            <td class="px-2.5 truncate">
              <router-link to="" class="text-gray-700 hover:text-gray-700 hover:underline" :title="item.al.name">
                {{ item.al.name }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 更多内容下载 -->
      <div
        v-if="playlist.trackCount > playlist.tracks.length"
        class="w-full h-16 mt-8 flex flex-col items-center justify-between"
      >
        <div class="text-sm">查看更多内容，请下载客户端</div>
        <router-link
          to=""
          class="w-32 h-8 rounded-full flex-center flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 text-white hover:text-white"
          >立即下载</router-link
        >
      </div>
    </template>
  </PageTemplate>
  <div v-if="msg" class="max-w-5xl min-h-180 mx-auto pt-10 lg:border-l lg:border-r border-gray-300 flex justify-center">
    <h1 class="text-4xl font-bold">{{ msg }}</h1>
  </div>
</template>

<script>
import api from '@/api'
import { numToUnitWan } from '@/utils'
import PageTemplate from '@/components/PageTemplate/PageTemplate.vue'
import Header from '@/components/Header/Header.vue'
import ArtistNames from '@/components/ArtistNames/ArtistNames.vue'
import AddIcon from '@/components/Icon/AddIcon/AddIcon.vue'
import FillPlayIcon from '@/components/Icon/PlayIcon/FillPlayIcon.vue'
import ShareIcon from '@/components/Icon/ShareIcon/ShareIcon.vue'
import AddFolderIcon from '@/components/Icon/AddFolderIcon/AddFolderIcon.vue'
import DownLoadIcon from '@/components/Icon/DownLoadIcon/DownLoadIcon.vue'

import { computed } from 'vue'

export default {
  data() {
    return {
      resourceType: 2,
      playlist: null,
      icon: `background-image : url(${require('@/assets/sprite/icon.png')})`,
      opened: false,
      relatedList: null,
      commentList: {
        hotComments: null,
        comments: null,
        total: null
      },
      // 错误信息
      msg: null
    }
  },
  provide() {
    return {
      resourceType: computed(() => this.resourceType),
      resourceId: computed(() => this.$route.query.id),
      commentList: computed(() => this.commentList)
    }
  },
  watch: {
    '$route.query.id': {
      handler(id) {
        if (this.$route.name === 'Playlist') this.getPlaylist(id)
      },
      immediate: true
    }
  },
  inject: ['windowWidth'],
  methods: {
    async getPlaylist(id) {
      const [{ data: res1 }, { data: res2 }, { data: res3 }] = await Promise.all([
        api.getPlaylistDetail(id),
        api.getPlaylistRelated(id),
        api.getComment(this.resourceType, id)
      ]).catch(err => {
        this.playlist = null
        this.msg = err.data.msg
        if (err.data.msg.match('登录')) {
          this.$store.commit('toLogin', true)
        }
      })
      if (res1.code === 200) {
        this.playlist = res1.playlist
        document.title = res1.playlist.name + ' - 歌单 - 网易云音乐'
      }
      if (res2.code === 200) {
        this.relatedList = res2.playlists
      }
      if (res3.code === 200) {
        this.commentList.hotComments = res3.hotComments
        this.commentList.comments = res3.comments
        this.commentList.total = res3.total
      }
    },
    commentBtnHandler() {
      this.$refs.scrollTo.scrollIntoView(true)
      this.$refs.scrollTo.nextElementSibling.nextElementSibling.getElementsByTagName('textarea')[0].focus()
    },

    numToUnitWan
  },
  components: {
    PageTemplate,
    Header,
    ArtistNames,
    AddIcon,
    FillPlayIcon,
    ShareIcon,
    AddFolderIcon,
    DownLoadIcon
  }
}
</script>

<style scoped>
.playlist {
  background-position: 0 -243px;
}
</style>
