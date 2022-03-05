<template>
  <div>
    <p v-for="(item, index) in lrc" v-show="index < 12 || opened" :key="item" class="mb-2">{{ item.text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    lyric: String,
    tlyric: String,
    opened: { type: Boolean, default: false }
  },
  computed: {
    lrc() {
      let lyric = this.formatLyric(this.lyric)
      if (!this.tlyric) return lyric
      lyric = lyric.concat(this.formatLyric(this.tlyric)).sort((a, b) => a.time - b.time)
      return lyric
    }
  },
  watch: {
    lrc: {
      handler(arr) {
        if (arr.length > 12) this.$emit('tooLong')
      },
      immediate: true
    }
  },
  emits: ['tooLong'],
  methods: {
    // 格式化时间字符串为时间
    formatTimeToNumber(timeString) {
      const splitArr = timeString.split(':').map(item => Number(item))
      return splitArr[0] * 60 + splitArr[1]
    },
    // 格式化歌词字符串为"时间-歌词"格式的数组
    formatLyric(lyric) {
      if (!lyric) return []
      const lyricParts = lyric.split('\n').filter(item => item)
      return lyricParts
        .map(item => {
          const splitItems = item.split(']')
          const lyricItem = {
            time: this.formatTimeToNumber(splitItems[0].slice(1)),
            text: splitItems[1]
          }
          return lyricItem
        })
        .filter(item => !Number.isNaN(item.time))
    }
  }
}
</script>

<style></style>
