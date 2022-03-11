<template>
  <PageTemplate
    v-if="songDetail"
    :resourceName="songDetail.name"
    :alia="songDetail.tns ? songDetail.tns[0] : null"
    :lrc="lrc"
    :tracks="[songDetail]"
    playlistTitle="包含这首歌的歌单"
    :relatedList="simiPlayList"
    :simiSongsList="simiSongsList"
  >
    <template v-slot:cover>
      <AlbumBoxCircle v-if="songDetail" :picUrl="songDetail.al.picUrl" />
    </template>
    <template v-slot:info>
      <!-- 歌手 -->
      <p class="text-gray-400">歌手：<ArtistNames :artists="songDetail.ar" textColor="text-blue-600" /></p>
      <!-- 所属专辑 -->
      <p class="text-gray-400">
        所属专辑：<router-link :to="`album?id=${songDetail.al.id}`" class="text-blue-600 hover:text-blue-600 hover:underline">{{
          songDetail.al.name
        }}</router-link
        ><span v-if="songDetail.al.tns && songDetail.al.tns.length"> - ({{ songDetail.al.tns[0] }})</span>
      </p>
    </template>
  </PageTemplate>
</template>

<script>
import PageTemplate from '../../components/PageTemplate/PageTemplate.vue'
import api from '@/api'
import { computed } from 'vue'
import AlbumBoxCircle from '@/components/AlbumBox/AlbumBoxCircle.vue'
import ArtistNames from '../../components/ArtistNames/ArtistNames.vue'

export default {
  data() {
    return {
      resourceType: 0,
      songDetail: null,
      simiSongsList: null,
      simiPlayList: null,
      lrc: {
        lyric: '',
        lyricUser: null,
        tlyric: '',
        transUser: null
      },
      commentList: {
        hotComments: null,
        comments: null,
        total: null
      }
    }
  },
  provide() {
    return {
      resourceType: computed(() => this.resourceType),
      resourceId: computed(() => this.$route.query.id),
      commentList: computed(() => this.commentList)
    }
  },
  inject: ['windowWidth'],
  watch: {
    '$route.query.id': {
      handler(id) {
        if (this.$route.name === 'Song') this.getSong(id)
      },
      immediate: true
    }
  },

  methods: {
    async getSong(id) {
      const [{ data: res1 }, { data: res2 }, { data: res3 }, { data: res4 }, { data: res5 }] = await Promise.all([
        api.getSongDetail(id),
        api.getSimiSong(id),
        api.getSimiPlayList(id),
        api.getLyric(id),
        api.getComment(this.resourceType, id)
      ]).catch(err => {
        this.songDetail = null
        this.msg = err.data.msg
        if (err.data.msg.match('登录')) {
          this.$store.commit('toLogin', true)
        }
      })
      if (res1.code === 200) {
        this.songDetail = res1.songs[0]
        const ars = ' - ' + res1.songs[0].ar.map(ar => ar.name).join('/')
        document.title = res1.songs[0].name + ars + ' - 单曲 - 网易云音乐'
      }
      if (res2.code === 200) {
        this.simiSongsList = res2.songs
      }
      if (res3.code === 200) {
        this.simiPlayList = res3.playlists
      }
      if (res4.code === 200) {
        res4.lrc.lyric && (this.lrc.lyric = res4.lrc.lyric)
        res4.lyricUser && (this.lrc.lyricUser = res4.lyricUser)
        res4.tlyric && (this.lrc.tlyric = res4.tlyric.lyric)
        res4.transUser && (this.lrc.transUser = res4.transUser)
      }
      if (res5.code === 200) {
        this.commentList.hotComments = res5.hotComments
        this.commentList.comments = res5.comments
        this.commentList.total = res5.total
      }
      api.checkMusic(id).catch(err => (this.songDetail.disabled = err.data.message))
    }
  },
  components: { PageTemplate, AlbumBoxCircle, ArtistNames }
}
</script>
