<template>
  <a @click="$router.push(`/album?id=${albumId}`)" class="w-full flex group" :title="albumName">
    <div class="w-5/6 relative">
      <img :src="picUrl" />
      <!-- play icon -->
      <PlayIcon :size="7" @click.stop="play" />
    </div>
    <img src="@/assets/img/album.png" class="w-1/6" />
  </a>
  <slot></slot>
</template>

<script>
import PlayIcon from '@/components/Icon/PlayIcon/PlayIcon.vue'
import api from '@/api'

export default {
  props: {
    albumId: {
      type: Number,
      required: true
    },
    picUrl: String,
    albumName: String
  },
  methods: {
    async play() {
      const { data: res } = await api.getAlbum(this.albumId)
      if (res.code === 200) {
        const tracks = res.songs
        tracks.forEach((item, index) => {
          if (!item.privilege.fee && !item.privilege.subp) tracks[index].disabled = '亲爱的,暂无版权'
        })
        this.$store.commit('resetAudioTracks', tracks)
        this.$store.commit('toPlay', tracks[0].id)
      }
    }
  },
  components: {
    PlayIcon
  }
}
</script>
