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
    :trackCount="playlist.trackCount"
    :playCount="playlist.playCount"
    :tracks="tracks"
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
  </PageTemplate>
  <div v-if="msg" class="max-w-5xl min-h-180 mx-auto pt-10 lg:border-l lg:border-r border-gray-300 flex justify-center">
    <h1 class="text-4xl font-bold">{{ msg }}</h1>
  </div>
</template>

<script>
import api from '@/api'
import PageTemplate from '@/components/PageTemplate/PageTemplate.vue'

import { computed } from 'vue'

export default {
  data() {
    return {
      resourceType: 2,
      playlist: null,
      tracks: null,
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
        const tracks = res1.playlist.tracks
        res1.privileges.forEach((item, index) => {
          if (!item.fee && !item.subp) tracks[index].disabled = '亲爱的,暂无版权'
        })
        this.tracks = tracks
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
    }
  },
  components: {
    PageTemplate
  }
}
</script>
