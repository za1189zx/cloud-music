<template>
  <PageTemplate
    v-if="album"
    :resourceName="album.name"
    :shareCount="album.info.shareCount"
    :commentCount="album.info.commentCount"
    :description="album.description"
    :trackCount="album.size"
    :tracks="tracks"
    playlistTitle="Ta的其他热门专辑"
    :relatedList="relatedList"
  >
    <template v-slot:cover>
      <div class="w-full flex">
        <img :src="album.picUrl" class="w-5/6 relative" />
        <img src="@/assets/img/album.png" class="w-1/6" />
      </div>
    </template>
    <template v-slot:info>
      <!-- 歌手 -->
      <p class="text-gray-700">歌手：<ArtistNames :artists="album.artists" textColor="text-blue-600" /></p>
      <!-- 发行时间 -->
      <p class="text-gray-700">发行时间：{{ dayjs(album.publishTime).format('YYYY-MM-DD') }}</p>
      <!-- 发行公司 -->
      <p v-if="album.company" class="text-gray-700">发行公司：{{ album.company }}</p>
    </template>
  </PageTemplate>
  <div v-if="msg" class="max-w-5xl min-h-180 mx-auto pt-10 lg:border-l lg:border-r border-gray-300 flex justify-center">
    <h1 class="text-4xl font-bold">{{ msg }}</h1>
  </div>
</template>

<script>
import api from '@/api'
import PageTemplate from '@/components/PageTemplate/PageTemplate.vue'
import ArtistNames from '@/components/ArtistNames/ArtistNames.vue'
import { computed } from 'vue'

export default {
  data() {
    return {
      resourceType: 3,
      album: null,
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
        if (this.$route.name === 'Album') this.getAlbum(id)
      },
      immediate: true
    }
  },
  inject: ['windowWidth'],
  methods: {
    async getAlbum(id) {
      const [{ data: res1 }, { data: res2 }] = await Promise.all([api.getAlbum(id), api.getComment(this.resourceType, id)]).catch(
        err => {
          this.playlist = null
          this.msg = err.data.msg
          if (err.data.msg.match('登录')) {
            this.$store.commit('toLogin', true)
          }
        }
      )
      if (res1.code === 200) {
        const tracks = res1.songs
        tracks.forEach((item, index) => {
          if (!item.privilege.fee && !item.privilege.subp) tracks[index].disabled = '亲爱的,暂无版权'
        })
        this.tracks = tracks
        this.album = res1.album
        document.title = res1.album.name + ' - ' + res1.album.artist.name + ' - 专辑 - 网易云音乐'
      }
      if (res2.code === 200) {
        this.commentList.hotComments = res2.hotComments
        this.commentList.comments = res2.comments
        this.commentList.total = res2.total
      }
      const { data: res } = await api.getArtistAlbum(res1.album.artist.id, 5)
      if (res.code === 200) {
        this.relatedList = res.hotAlbums
      }
    }
  },
  components: {
    PageTemplate,

    ArtistNames
  }
}
</script>
